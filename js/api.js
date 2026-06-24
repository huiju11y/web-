/**
 * CameraHub Mock API 层
 * 模拟异步接口调用，可替换为真实后端API
 */
const API = {
  // 模拟延迟
  _delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));
  },

  // 获取商品列表
  async getProducts(filters = {}) {
    await this._delay();
    let products = [...MockData.products];
    if (filters.type) products = products.filter(p => p.type === filters.type);
    if (filters.category) products = products.filter(p => p.category === filters.category);
    if (filters.brand) products = products.filter(p => p.brand === filters.brand);
    return { code: 0, data: products, total: products.length };
  },

  // 获取商品详情
  async getProductDetail(id) {
    await this._delay();
    const product = MockData.products.find(p => p.id === parseInt(id));
    if (!product) return { code: 404, message: '商品不存在' };
    return { code: 0, data: product };
  },

  // 获取用户订单
  async getOrders() {
    await this._delay();
    if (!store.state.user) return { code: 401, message: '请先登录' };
    return { code: 0, data: store.getOrders() };
  },

  // 创建订单
  async createOrder(orderData) {
    await this._delay(500);
    if (!store.state.user) return { code: 401, message: '请先登录' };
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
    const order = { id: orderId, ...orderData, createdAt: new Date().toISOString().split('T')[0] };
    store.addOrder(order);
    return { code: 0, data: order, message: '下单成功' };
  },

  // 发布二手器材
  async publishUsed(data) {
    await this._delay(500);
    if (!store.state.user) return { code: 401, message: '请先登录' };
    const newId = Math.max(...MockData.products.map(p => p.id)) + 1;
    // specs 现在可以是对象或 JSON 字符串（向后兼容）
    let specs = data.specs;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs || '{}'); } catch (e) { specs = {}; }
    }
    const product = {
      id: newId,
      type: 'used',
      category: data.category,
      brand: data.brand,
      condition: data.condition,
      name: data.name,
      shortName: data.name,
      specs: specs || {},
      price: { sell: parseInt(data.price), original: parseInt(data.originalPrice) || 0, deposit: 0 },
      images: ['placeholder'],
      desc: data.desc,
      seller: { name: store.state.user.name, rating: 5.0, trades: 0, joined: store.state.user.memberSince },
      stock: 1, sold: 0, listedAt: new Date().toISOString().split('T')[0],
      rating: 0, reviews: [],
      location: data.location || '待定',
    };
    MockData.products.push(product);
    return { code: 0, data: product, message: '发布成功' };
  },

  // 提交保真鉴定申请
  async submitAuthenticate(data) {
    await this._delay(500);
    if (!store.state.user) return { code: 401, message: '请先登录' };
    const caseId = 'AUTH-' + Date.now().toString(36).toUpperCase();
    store.addAuthenticateCase({
      id: caseId,
      ...data,
      applicant: store.state.user.name,
      submitDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      result: null,
      report: null,
    });
    return { code: 0, data: { id: caseId }, message: '鉴定申请已提交' };
  },

  // 获取鉴定案例
  async getAuthenticateCases() {
    await this._delay();
    return { code: 0, data: store.getAuthenticateCases() };
  },
};
