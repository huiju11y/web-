/**
 * CameraHub 可复用组件库
 * 筛选器、租期选择器、价格计算器、商品卡片、弹窗等
 */

// ==================== 图片工具 ====================
// 智能占位图 — 按品牌/品类生成差异化视觉
function productImgUrl(seed, width, height) {
  const colors = ['#2563eb','#16a34a','#dc2626','#f59e0b','#8b5cf6','#ec4899','#06b6d4'];
  const hash = (seed || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const bg = colors[Math.abs(hash) % colors.length];
  const fs = Math.min(width, height) / 6;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bg}" stop-opacity="0.9"/><stop offset="100%" stop-color="${bg}" stop-opacity="0.6"/></linearGradient></defs>
    <rect fill="url(#g)" width="${width}" height="${height}"/>
    <text x="${width/2}" y="${height/2 - fs*0.3}" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="${fs}" font-family="sans-serif">📷</text>
    <text x="${width/2}" y="${height/2 + fs*0.7}" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="${fs*0.35}" font-family="sans-serif">CameraHub</text>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// ==================== Toast 通知 ====================
function showToast(message, type = 'success', duration = 2500) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ==================== 筛选器组件 ====================
function renderFilterBar(filters, options = {}) {
  const { showTypeSwitch = true, showBrand = true, showCondition = true, showPrice = true, showSort = true, showKeyword = false } = options;

  // 搜索框
  const keywordInput = showKeyword ? `
    <div class="filter-group" style="flex:1;min-width:180px">
      <input type="text" class="input" placeholder="🔍 搜索器材名称/参数..." data-filter="keyword" value="${filters.keyword || ''}" style="padding:6px 12px;font-size:.82rem" />
    </div>
  ` : '';

  const typeSwitch = showTypeSwitch ? `
    <div class="filter-group">
      <span class="filter-label">类型:</span>
      <button class="filter-chip ${filters.type === 'rent' ? 'active' : ''}" data-filter="type" data-value="rent">租赁</button>
      <button class="filter-chip ${filters.type === 'used' ? 'active' : ''}" data-filter="type" data-value="used">二手</button>
    </div>
  ` : '';

  const categoryChips = MockData.categories.map(c =>
    `<button class="filter-chip ${filters.category === c.id ? 'active' : ''}" data-filter="category" data-value="${c.id}">${c.icon} ${c.name}</button>`
  ).join('');

  const brandChips = showBrand ? MockData.brands.map(b =>
    `<button class="filter-chip ${filters.brand === b.id ? 'active' : ''}" data-filter="brand" data-value="${b.id}">${b.name}</button>`
  ).join('') : '';

  const conditionChips = showCondition ? MockData.conditions.map(c =>
    `<button class="filter-chip ${filters.condition === c.id ? 'active' : ''}" data-filter="condition" data-value="${c.id}">${c.name}</button>`
  ).join('') : '';

  const priceInput = showPrice ? `
    <span class="filter-label">价格:</span>
    <div class="filter-price">
      <input type="number" class="input" placeholder="最低" data-filter="priceMin" value="${filters.priceMin}" />
      <span>-</span>
      <input type="number" class="input" placeholder="最高" data-filter="priceMax" value="${filters.priceMax}" />
    </div>
  ` : '';

  const sortSelect = showSort ? `
    <span class="filter-label">排序:</span>
    <select class="input" data-filter="sort" style="width:auto;padding:6px 12px;">
      <option value="default" ${filters.sort === 'default' ? 'selected' : ''}>默认</option>
      <option value="price_asc" ${filters.sort === 'price_asc' ? 'selected' : ''}>价格从低到高</option>
      <option value="price_desc" ${filters.sort === 'price_desc' ? 'selected' : ''}>价格从高到低</option>
      <option value="rating" ${filters.sort === 'rating' ? 'selected' : ''}>评分最高</option>
    </select>
  ` : '';

  const hasFilter = filters.category || filters.brand || filters.condition || filters.priceMin || filters.priceMax || filters.keyword;
  const resetBtn = hasFilter ? `<button class="filter-reset" data-filter="reset">✕ 清除筛选</button>` : '';

  return `
    <div class="filter-bar" id="filterBar">
      ${keywordInput}
      ${keywordInput && typeSwitch ? '<span class="filter-divider"></span>' : ''}
      ${typeSwitch}
      ${typeSwitch ? '<span class="filter-divider"></span>' : ''}
      <div class="filter-group">
        <span class="filter-label">品类:</span>
        ${categoryChips}
      </div>
      ${brandChips ? '<span class="filter-divider"></span>' : ''}
      ${brandChips ? `<div class="filter-group"><span class="filter-label">品牌:</span>${brandChips}</div>` : ''}
      ${conditionChips ? '<span class="filter-divider"></span>' : ''}
      ${conditionChips ? `<div class="filter-group"><span class="filter-label">成色:</span>${conditionChips}</div>` : ''}
      ${priceInput ? '<span class="filter-divider"></span>' : ''}
      ${priceInput ? `<div class="filter-group">${priceInput}</div>` : ''}
      ${sortSelect ? '<span class="filter-divider"></span>' : ''}
      ${sortSelect ? `<div class="filter-group">${sortSelect}</div>` : ''}
      ${resetBtn ? '<span class="filter-divider"></span>' : ''}
      ${resetBtn}
    </div>
  `;
}

function bindFilterEvents(applyFilterFn) {
  const bar = document.getElementById('filterBar');
  if (!bar) return;
  bar.addEventListener('click', e => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    const key = chip.dataset.filter;
    if (key === 'reset') {
      store.resetFilters();
      applyFilterFn();
      return;
    }
    // keyword input 的点击不应该触发 chip 逻辑
    if (key === 'keyword') return;
    const value = chip.dataset.value;
    // type 不允许 toggle 关闭（页面类型固定）
    if (key === 'type') {
      store.setFilter(key, value);
    } else if (key === 'category' || key === 'brand' || key === 'condition') {
      const current = store.state.filters[key];
      store.setFilter(key, current === value ? null : value);
    }
    applyFilterFn();
  });
  bar.addEventListener('change', e => {
    const el = e.target.closest('[data-filter]');
    if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'SELECT')) return;
    store.setFilter(el.dataset.filter, el.value);
    applyFilterFn();
  });
  // keyword 搜索：输入时实时筛选（防抖）
  let keywordTimer;
  bar.addEventListener('input', e => {
    const el = e.target.closest('[data-filter="keyword"]');
    if (!el) return;
    clearTimeout(keywordTimer);
    keywordTimer = setTimeout(() => {
      store.setFilter('keyword', el.value);
      applyFilterFn();
    }, 300);
  });
}

// ==================== 租期选择组件 ====================
function renderRentalPeriodSelector(product, selected = { period: 'daily', days: 1, startDate: '' }) {
  const { price } = product;
  const periods = [
    { key: 'daily', label: `按天 ¥${price.daily}/天`, days: 1 },
    { key: 'weekly', label: `按周 ¥${price.weekly}/周(省${price.daily * 7 - price.weekly})`, days: 7 },
    { key: 'monthly', label: `按月 ¥${price.monthly}/月(省${price.daily * 30 - price.monthly})`, days: 30 },
    { key: 'custom', label: '自定义天数', days: selected.days || 3 },
  ];

  return `
    <div class="rental-period" data-component="rental-period">
      ${periods.map(p => `
        <button class="period-option ${selected.period === p.key ? 'active' : ''}" data-period="${p.key}" data-days="${p.days}">
          ${p.label}
        </button>
      `).join('')}
    </div>
    <div class="period-custom" id="periodCustom" style="display:${selected.period === 'custom' ? 'flex' : 'none'}">
      <span>租赁天数:</span>
      <input type="number" class="input" id="customDays" min="1" max="90" value="${selected.days}" />
      <span>天</span>
    </div>
  `;
}

function bindRentalPeriodEvents(onChange) {
  const container = document.querySelector('[data-component="rental-period"]');
  if (!container) return;
  container.addEventListener('click', e => {
    const btn = e.target.closest('.period-option');
    if (!btn) return;
    container.querySelectorAll('.period-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const period = btn.dataset.period;
    const days = parseInt(btn.dataset.days);
    const customDiv = document.getElementById('periodCustom');
    if (customDiv) customDiv.style.display = period === 'custom' ? 'flex' : 'none';
    onChange({ period, days });
  });
  const customInput = document.getElementById('customDays');
  if (customInput) {
    customInput.addEventListener('input', () => {
      const days = parseInt(customInput.value) || 1;
      onChange({ period: 'custom', days: Math.max(1, Math.min(90, days)) });
    });
  }
}

// ==================== 价格计算组件 ====================
function renderPriceCalculator(product, selection) {
  const { price } = product;
  let rentalPrice = 0;
  let unit = '';

  if (selection.period === 'daily') {
    rentalPrice = price.daily * selection.days;
    unit = `¥${price.daily} × ${selection.days}天`;
  } else if (selection.period === 'weekly') {
    const weeks = Math.max(1, Math.ceil(selection.days / 7));
    rentalPrice = price.weekly * weeks;
    unit = `¥${price.weekly} × ${weeks}周`;
  } else if (selection.period === 'monthly') {
    const months = Math.max(1, Math.ceil(selection.days / 30));
    rentalPrice = price.monthly * months;
    unit = `¥${price.monthly} × ${months}月`;
  } else if (selection.period === 'custom') {
    // 自动选最优组合：按天 vs 按周混搭 vs 按月混搭
    const days = selection.days;
    const dailyOnly = price.daily * days;
    const withWeeks = Math.floor(days / 7) * price.weekly + (days % 7) * price.daily;
    const withMonths = Math.floor(days / 30) * price.monthly + Math.ceil((days % 30) / 7) * price.weekly + (days % 30 % 7) * price.daily;
    const best = Math.min(dailyOnly, withWeeks, withMonths);
    rentalPrice = best;
    if (days >= 30 && best === dailyOnly) {
      unit = `¥${price.daily} × ${days}天`;
    } else if (days >= 7 && Math.abs(best - withWeeks) <= withMonths) {
      const w = Math.floor(days / 7), r = days % 7;
      unit = `¥${price.weekly} × ${w}周${r > 0 ? ' + ¥' + price.daily + ' × ' + r + '天' : ''}`;
    } else if (days >= 30) {
      const m = Math.floor(days / 30), w = Math.ceil((days % 30) / 7), r = days % 30 % 7;
      unit = `¥${price.monthly} × ${m}月${w > 0 ? ' + ¥' + price.weekly + ' × ' + w + '周' : ''}${r > 0 ? ' + ¥' + price.daily + ' × ' + r + '天' : ''}`;
    } else {
      unit = `¥${price.daily} × ${days}天`;
    }
  }
  const serviceFee = Math.round(rentalPrice * 0.05);
  const total = rentalPrice + serviceFee;

  return `
    <div class="price-calc">
      <div class="price-calc-row">
        <span>租金 (${unit})</span>
        <span class="price">¥${rentalPrice.toLocaleString()}</span>
      </div>
      <div class="price-calc-row">
        <span>服务费 (5%)</span>
        <span class="price">¥${serviceFee.toLocaleString()}</span>
      </div>
      <div class="price-calc-row">
        <span>押金 (退还)</span>
        <span class="price">¥${price.deposit.toLocaleString()}</span>
      </div>
      <div class="price-calc-row total">
        <span>应付总额</span>
        <span class="price">¥${(total + price.deposit).toLocaleString()}</span>
      </div>
      <div class="price-calc-row" style="font-size:.8rem;color:var(--text-secondary);border:none;">
        <span>归还验收后押金 ¥${price.deposit.toLocaleString()} 退还</span>
        <span>实付 ≈ ¥${total.toLocaleString()}</span>
      </div>
    </div>
  `;
}

// ==================== 商品卡片组件 ====================
function renderProductCard(product) {
  const isUsed = product.type === 'used';
  const priceDisplay = isUsed
    ? `<span class="product-price">¥${product.price.sell.toLocaleString()}<span class="product-price-unit">/售价</span></span>`
    : `<span class="product-price">¥${product.price.daily}<span class="product-price-unit">/天起</span></span>`;

  const tagHtml = product.stock < 1
    ? `<span class="product-tag" style="background:var(--danger)">已售罄</span>`
    : (isUsed
      ? `<span class="product-tag used">二手</span>`
      : `<span class="product-tag">租赁</span>`);

  const ratingHtml = product.rating
    ? `<span class="product-rating">⭐ ${product.rating}%好评</span>`
    : '';

  const conditionName = MockData.conditions.find(c => c.id === product.condition);
  const conditionHtml = conditionName ? `<span class="product-condition">${conditionName.name}</span>` : '';

  const stockHint = !isUsed && product.stock < 1 ? '<span class="product-condition" style="color:var(--danger)">暂无库存</span>' : '';
  const soldOutOverlay = product.stock < 1 ? ' style="opacity:0.7"' : '';

  return `
    <div class="product-card" data-product-id="${product.id}" data-link="${isUsed ? '#/used/' + product.id : '#/product/' + product.id}"${soldOutOverlay}>
      <div class="product-img-wrap">
        <img class="product-img" src="${productImgUrl(product.shortName.replace(/\s/g,''), 400, 300)}" alt="${product.name}" loading="lazy" />
        ${tagHtml}
      </div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <div class="product-meta">
          ${conditionHtml}
          ${stockHint}
          ${ratingHtml}
          ${isUsed && product.seller ? `<span>👤 ${product.seller.name}</span>` : ''}
        </div>
        <div class="product-footer">
          ${priceDisplay}
          <button class="btn btn-sm btn-outline" data-action="view">查看详情</button>
        </div>
      </div>
    </div>
  `;
}

// ==================== 弹窗组件 ====================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  // backdrop
  if (!modal.querySelector('.modal-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', () => closeModal(modalId));
    modal.prepend(backdrop);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
}

function initModals() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-modal-close]')) {
      const modal = e.target.closest('.modal');
      if (modal) modal.classList.remove('open');
    }
    if (e.target.closest('.modal-backdrop')) {
      e.target.closest('.modal').classList.remove('open');
    }
  });
}

// ==================== 购物车面板 ====================
function updateCartUI() {
  const cart = store.state.cart;
  const badge = document.getElementById('cartBadge');
  const body = document.getElementById('cartPanelBody');
  const footer = document.getElementById('cartPanelFooter');
  const totalPrice = document.getElementById('cartTotalPrice');
  const totalDeposit = document.getElementById('cartTotalDeposit');

  const count = cart.length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (!body) return;

  if (count === 0) {
    body.innerHTML = '<p class="cart-empty">🛒 购物车为空</p>';
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(item => {
    const product = MockData.products.find(p => p.id === item.productId);
    const link = product ? (product.type === 'used' ? '#/used/' + product.id : '#/product/' + product.id) : '#';
    let priceText = '';
    if (item.period === 'daily') priceText = `¥${item.dailyPrice} × ${item.days}天`;
    else if (item.period === 'weekly') priceText = `¥${(product?.price.weekly || item.dailyPrice * 7)}/周`;
    else if (item.period === 'monthly') priceText = `¥${(product?.price.monthly || item.dailyPrice * 30)}/月`;
    else priceText = `¥${item.dailyPrice} × ${item.days}天`;
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${productImgUrl(product?.shortName?.replace(/\s/g,'') || 'item', 100, 100)}" alt="${item.productName}" style="cursor:pointer" onclick="navigate('${link}');toggleCartPanel()" />
        <div class="cart-item-info" style="cursor:pointer" onclick="navigate('${link}');toggleCartPanel()">
          <div class="cart-item-name">${item.productName}</div>
          <div class="cart-item-meta">${priceText} | 押金 ¥${item.deposit}</div>
          <div class="cart-item-price">¥${product ? calcItemPrice(product, item) : 0}</div>
        </div>
        <button class="cart-item-remove" data-remove="${item.productId}">✕</button>
      </div>
    `;
  }).join('');

  if (footer) {
    footer.style.display = 'block';
    totalPrice.textContent = `¥${store.getCartTotal()}`;
    totalDeposit.textContent = `¥${store.getCartDeposit()}`;
  }

  body.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      store.removeFromCart(parseInt(btn.dataset.remove));
      showToast('已从购物车移除');
    });
  });
}

function calcItemPrice(product, item) {
  if (!product || !product.price) return item.dailyPrice * item.days;
  const p = product.price;
  const days = item.days || 1;
  if (item.period === 'weekly') {
    const weeks = Math.ceil(days / 7);
    return p.weekly * weeks;
  }
  if (item.period === 'monthly') {
    const months = Math.ceil(days / 30);
    return p.monthly * months;
  }
  if (item.period === 'custom') {
    // 自动选最优：纯日租 vs 周+日 vs 月+周+日
    const dailyOnly = p.daily * days;
    const withWeeks = Math.floor(days / 7) * p.weekly + (days % 7) * p.daily;
    const withMonths = Math.floor(days / 30) * p.monthly
      + Math.ceil((days % 30) / 7) * p.weekly
      + (days % 30 % 7) * p.daily;
    return Math.min(dailyOnly, withWeeks, withMonths);
  }
  // daily or fallback
  return p.daily * days;
}

function toggleCartPanel() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  } else {
    updateCartUI();
    panel.classList.add('open');
    overlay.classList.add('open');
  }
}

function initCartPanel() {
  document.getElementById('cartBtn')?.addEventListener('click', toggleCartPanel);
  document.getElementById('cartPanelClose')?.addEventListener('click', toggleCartPanel);
  document.getElementById('cartOverlay')?.addEventListener('click', toggleCartPanel);
  document.getElementById('cartCheckoutBtn')?.addEventListener('click', () => {
    if (!store.state.user) {
      toggleCartPanel();
      openModal('loginModal');
      showToast('请先登录后再下单', 'warning');
      return;
    }
    if (store.state.cart.length === 0) {
      showToast('购物车为空', 'warning');
      return;
    }
    toggleCartPanel();
    navigate('#/cart');
  });
}

function checkoutCart() {
  const cart = [...store.state.cart];
  const totalPrice = store.getCartTotal();
  const totalDeposit = store.getCartDeposit();
  const now = new Date();

  // 库存检查
  for (const item of cart) {
    const product = MockData.products.find(p => p.id === item.productId);
    if (!product || product.stock < 1) {
      showToast(`「${item.productName}」库存不足，无法下单`, 'error');
      return;
    }
  }

  cart.forEach(item => {
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    const product = MockData.products.find(p => p.id === item.productId);
    // 扣减库存
    store.decreaseStock(item.productId);
    store.addOrder({
      id: orderId,
      productId: item.productId,
      productName: item.productName,
      productImg: item.productImg,
      period: item.period,
      days: item.days,
      price: calcItemPrice(product || { price: { weekly: item.dailyPrice * 7, monthly: item.dailyPrice * 30 } }, item),
      deposit: item.deposit,
      status: 'renting',
      startDate: item.startDate || now.toISOString().split('T')[0],
      endDate: '',
      createdAt: now.toISOString().split('T')[0],
    });
  });

  store.clearCart();
  toggleCartPanel();
  updateCartUI();
  showToast(`下单成功！共 ${cart.length} 件器材，应付 ¥${totalPrice + totalDeposit}`, 'success');
  if (window.location.hash === '#/orders') {
    navigate('#/orders');
  }
}

// ==================== 用户状态更新 ====================
function updateUserUI() {
  const user = store.state.user;
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = user.name;
    if (userAvatar) userAvatar.textContent = user.name[0];
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userMenu) userMenu.style.display = 'none';
  }
}

// ==================== 登录功能 ====================
// API 基础地址（与当前页面同源）
const API_BASE = '';

// 发送验证码倒计时
let codeCountdown = null;

function startCodeCountdown(btn) {
  let sec = 60;
  btn.disabled = true;
  if (codeCountdown) clearInterval(codeCountdown);
  codeCountdown = setInterval(() => {
    sec--;
    btn.textContent = `${sec}s后重发`;
    if (sec <= 0) {
      clearInterval(codeCountdown);
      codeCountdown = null;
      btn.disabled = false;
      btn.textContent = '获取验证码';
    }
  }, 1000);
}

async function sendSmsCode(phone) {
  try {
    const resp = await fetch(`${API_BASE}/api/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await resp.json();
    if (data.success) {
      if (data.mock) {
        showToast('验证码已发送（模拟模式，请查看服务端控制台）', 'success');
      } else {
        showToast('验证码已发送至您的手机', 'success');
      }
      return true;
    } else {
      showToast(data.message || '发送失败', 'error');
      return false;
    }
  } catch (err) {
    showToast('网络错误，请确保后端服务已启动（node server.js）', 'error');
    console.error('发送验证码失败:', err);
    return false;
  }
}

async function doLogin(phone, code, studentId) {
  try {
    const resp = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code, studentId }),
    });
    const data = await resp.json();
    if (data.success) {
      store.setUser(data.user);
      closeModal('loginModal');
      updateUserUI();
      showToast(`欢迎回来，${data.user.name}！`, 'success');
      return true;
    } else {
      showToast(data.message || '登录失败', 'error');
      return false;
    }
  } catch (err) {
    showToast('网络错误，请确保后端服务已启动', 'error');
    console.error('登录失败:', err);
    return false;
  }
}

function initLogin() {
  document.getElementById('loginBtn')?.addEventListener('click', () => openModal('loginModal'));

  // 发送验证码
  document.getElementById('sendCodeBtn')?.addEventListener('click', async () => {
    const phone = document.getElementById('loginPhone').value.trim();
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的11位手机号', 'error');
      return;
    }
    const btn = document.getElementById('sendCodeBtn');
    if (btn.disabled) return; // 倒计时中

    const ok = await sendSmsCode(phone);
    if (ok) startCodeCountdown(btn);
  });

  // 登录提交
  document.getElementById('loginSubmitBtn')?.addEventListener('click', async () => {
    const studentId = document.getElementById('loginStudentId').value.trim();
    const phone = document.getElementById('loginPhone').value.trim();
    const code = document.getElementById('loginCode').value.trim();

    if (!studentId) {
      showToast('请输入学号', 'error');
      return;
    }
    if (!/^\d{6,12}$/.test(studentId)) {
      showToast('请输入正确的学号（6-12位数字）', 'error');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast('请输入正确的11位手机号', 'error');
      return;
    }
    if (!code || code.length < 4) {
      showToast('请输入验证码', 'error');
      return;
    }

    const btn = document.getElementById('loginSubmitBtn');
    btn.disabled = true;
    btn.textContent = '登录中...';
    await doLogin(phone, code, studentId);
    btn.disabled = false;
    btn.textContent = '登录 / 注册';
  });

  // 退出登录
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    store.setUser(null);
    updateUserUI();
    showToast('已退出登录');
    navigate('#/');
  });
}

// ==================== 移动端侧栏 ====================
function initMobileSidebar() {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const close = document.getElementById('sidebarClose');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  });
  close?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
  sidebar.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  });
}

// ==================== 筛选排序函数 ====================
function filterProducts(type = null) {
  const f = store.state.filters;
  let products = [...MockData.products];

  if (type) {
    products = products.filter(p => p.type === type);
  } else if (f.type) {
    products = products.filter(p => p.type === f.type);
  }
  if (f.category) products = products.filter(p => p.category === f.category);
  if (f.brand) products = products.filter(p => p.brand === f.brand);
  if (f.condition) products = products.filter(p => p.condition === f.condition);
  if (f.keyword) {
    const kw = f.keyword.toLowerCase();
    // ====== 中文同义词 & 意图映射 ======
    const synonymMap = {
      '人像': ['portrait', '85mm', '70-200', 'f1.4', 'f1.2', '大光圈', '虚化', '定焦'],
      '风光': ['landscape', '广角', '16-35', '14-24', '高像素', '6100万', '4500万', '全画幅'],
      '视频': ['video', 'vlog', '4k', '8k', '电影', '摄像机', '拍摄', '稳定', 'fx3', 'pocket'],
      'vlog': ['pocket', '口袋', '自拍', '轻便', '视频'],
      '入门': ['新手', '便宜', '性价比', '入门级'],
      '专业': ['旗舰', '顶级', '商用', 'pro'],
      '便宜': ['入门', '性价比', '实惠', '二手'],
      '轻便': ['微单', 'mirrorless', '轻', '便携'],
      '高像素': ['6100万', '4500万', '一亿', '1.02亿'],
      '运动': ['体育', '连拍', '追焦', '高速'],
      '婚礼': ['跟拍', '人像', '活动'],
      '商业': ['广告', '产品', '中画幅', '灯光'],
    };
    // 展开同义词
    let searchTerms = [kw];
    for (const [intent, synonyms] of Object.entries(synonymMap)) {
      if (kw.includes(intent) || kw.includes(intent.toLowerCase())) {
        searchTerms.push(...synonyms);
      }
    }

    products = products.filter(p => {
      // 拼接所有可搜索文本
      const brandName = (MockData.brands.find(b => b.id === p.brand)?.name || '').toLowerCase();
      const catName = (MockData.categories.find(c => c.id === p.category)?.name || '').toLowerCase();
      const condName = (MockData.conditions.find(c => c.id === p.condition)?.name || '').toLowerCase();
      const specsText = p.specs ? Object.values(p.specs).join(' ').toLowerCase() : '';
      const searchFields = [
        p.name.toLowerCase(),
        p.shortName.toLowerCase(),
        (p.desc || '').toLowerCase(),
        brandName,
        catName,
        condName,
        specsText,
      ].join(' ');

      // 任一搜索词命中即可
      return searchTerms.some(term => searchFields.includes(term));
    });
  }
  if (f.priceMin) {
    const min = parseInt(f.priceMin);
    products = products.filter(p => {
      const pPrice = p.type === 'used' ? (p.price.sell || 0) : p.price.daily;
      return pPrice >= min;
    });
  }
  if (f.priceMax) {
    const max = parseInt(f.priceMax);
    products = products.filter(p => {
      const pPrice = p.type === 'used' ? (p.price.sell || 0) : p.price.daily;
      return pPrice <= max;
    });
  }
  if (f.sort === 'price_asc') {
    products.sort((a, b) => {
      const aP = a.type === 'used' ? (a.price.sell || 0) : a.price.daily;
      const bP = b.type === 'used' ? (b.price.sell || 0) : b.price.daily;
      return aP - bP;
    });
  } else if (f.sort === 'price_desc') {
    products.sort((a, b) => {
      const aP = a.type === 'used' ? (a.price.sell || 0) : a.price.daily;
      const bP = b.type === 'used' ? (b.price.sell || 0) : b.price.daily;
      return bP - aP;
    });
  } else if (f.sort === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  return products;
}
