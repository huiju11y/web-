/**
 * CameraHub 状态管理 Store
 * 全局状态管理：用户、购物车、筛选条件、订单、鉴定
 * 支持按用户隔离 localStorage 持久化
 */
class Store {
  constructor() {
    this.state = {
      user: null,
      cart: [],
      orders: [],
      authenticateCases: [],
      filters: {
        category: null,
        brand: null,
        condition: null,
        priceMin: '',
        priceMax: '',
        type: 'rent',
        sort: 'default',
        keyword: '',
      }
    };
    this.listeners = [];
    this._loadFromStorage();
  }

  _storageKey() {
    if (this.state.user && this.state.user.phone) {
      return 'camerahub_' + this.state.user.phone;
    }
    return 'camerahub_guest';
  }

  _loadFromStorage() {
    try {
      const key = this._storageKey();
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.user = parsed.user || null;
        this.state.cart = parsed.cart || [];
        this.state.orders = parsed.orders || [];
        this.state.authenticateCases = parsed.authenticateCases || [];
      }
      // 合并 MockData 的示例订单和鉴定案例（首次加载时）
      if (this.state.orders.length === 0) {
        this.state.orders = [...MockData.orders];
      }
      if (this.state.authenticateCases.length === 0) {
        this.state.authenticateCases = [...MockData.authenticateCases];
      }
    } catch (e) { /* ignore */ }
  }

  _saveToStorage() {
    try {
      const key = this._storageKey();
      localStorage.setItem(key, JSON.stringify({
        user: this.state.user,
        cart: this.state.cart,
        orders: this.state.orders,
        authenticateCases: this.state.authenticateCases,
      }));
    } catch (e) { /* ignore */ }
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // ========== 用户 ==========
  setUser(user) {
    // 切换用户前，先保存当前用户数据
    if (this.state.user && !user) {
      this._saveToStorage();
    }
    this.state.user = user;
    if (user) {
      // 登录后加载该用户的数据
      this._loadFromStorage();
    }
    this._saveToStorage();
    this.notify();
  }

  // ========== 订单 ==========
  getOrders() {
    return [...this.state.orders];
  }

  addOrder(order) {
    this.state.orders.unshift(order);
    this._saveToStorage();
    this.notify();
  }

  cancelOrder(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      // 恢复库存
      const product = MockData.products.find(p => p.id === order.productId);
      if (product) product.stock = (product.stock || 0) + 1;
      this._saveToStorage();
      this.notify();
    }
  }

  completeOrder(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'completed';
      order.endDate = new Date().toISOString().split('T')[0];
      // 归还后恢复库存
      const product = MockData.products.find(p => p.id === order.productId);
      if (product && order.period) {
        product.stock = (product.stock || 0) + 1;
      }
      this._saveToStorage();
      this.notify();
    }
  }

  // 扣减库存，返回是否成功
  decreaseStock(productId) {
    const product = MockData.products.find(p => p.id === productId);
    if (!product) return false;
    if (product.stock < 1) return false;
    product.stock--;
    return true;
  }

  // 恢复库存
  increaseStock(productId) {
    const product = MockData.products.find(p => p.id === productId);
    if (product) product.stock = (product.stock || 0) + 1;
  }

  // ========== 鉴定 ==========
  getAuthenticateCases() {
    return [...this.state.authenticateCases];
  }

  addAuthenticateCase(caseData) {
    this.state.authenticateCases.unshift(caseData);
    this._saveToStorage();
    this.notify();
  }

  // ========== 筛选 ==========
  resetFilters() {
    this.state.filters = {
      category: null,
      brand: null,
      condition: null,
      priceMin: '',
      priceMax: '',
      type: 'rent',
      sort: 'default',
      keyword: '',
    };
    this.notify();
  }

  setFilter(key, value) {
    this.state.filters[key] = value;
    this.notify();
  }

  // ========== 购物车 ==========
  addToCart(product, period, days, startDate) {
    const existing = this.state.cart.find(c => c.productId === product.id);
    if (existing) {
      existing.period = period;
      existing.days = days;
      existing.startDate = startDate;
    } else {
      this.state.cart.push({
        productId: product.id,
        productName: product.name,
        productImg: product.images[0],
        period,
        days,
        startDate,
        dailyPrice: product.price.daily,
        deposit: product.price.deposit || 0,
      });
    }
    this._saveToStorage();
    this.notify();
  }

  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(c => c.productId !== productId);
    this._saveToStorage();
    this.notify();
  }

  updateCartItem(productId, updates) {
    const item = this.state.cart.find(c => c.productId === productId);
    if (item) {
      Object.assign(item, updates);
      this._saveToStorage();
      this.notify();
    }
  }

  clearCart() {
    this.state.cart = [];
    this._saveToStorage();
    this.notify();
  }

  getCartTotal() {
    return this.state.cart.reduce((sum, item) => {
      const product = MockData.products.find(p => p.id === item.productId);
      if (!product || !product.price) return sum + item.dailyPrice * item.days;
      const p = product.price;
      const days = item.days || 1;
      if (item.period === 'weekly') {
        return sum + p.weekly * Math.ceil(days / 7);
      }
      if (item.period === 'monthly') {
        return sum + p.monthly * Math.ceil(days / 30);
      }
      if (item.period === 'custom') {
        const dailyOnly = p.daily * days;
        const withWeeks = Math.floor(days / 7) * p.weekly + (days % 7) * p.daily;
        const withMonths = Math.floor(days / 30) * p.monthly
          + Math.ceil((days % 30) / 7) * p.weekly
          + (days % 30 % 7) * p.daily;
        return sum + Math.min(dailyOnly, withWeeks, withMonths);
      }
      return sum + p.daily * days;
    }, 0);
  }

  getCartDeposit() {
    return this.state.cart.reduce((sum, item) => sum + (item.deposit || 0), 0);
  }
}

const store = new Store();
