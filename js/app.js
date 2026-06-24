/**
 * CameraHub 主应用逻辑
 * 各页面渲染函数 + 全局初始化
 */
const mainContent = document.getElementById('mainContent');

// 工具函数
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==================== 全局页脚 ====================
function footerHTML() {
  return `
    <footer style="background:var(--text);color:#fff;padding:50px 0 30px;margin-top:60px">
      <div class="container" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px">
        <div>
          <h4 style="margin-bottom:12px;font-size:1.1rem">📷 CameraHub</h4>
          <p style="font-size:.85rem;opacity:.7;line-height:1.8">专业摄影器材租赁与二手保真交易平台。让每一个摄影爱好者都能用上心仪的器材。</p>
        </div>
        <div>
          <h4 style="margin-bottom:12px">服务协议</h4>
          <ul style="list-style:none;font-size:.85rem;opacity:.7;line-height:2">
            <li><a href="#" class="footer-link" data-agreement="rental">租赁服务协议</a></li>
            <li><a href="#" class="footer-link" data-agreement="trading">二手交易协议</a></li>
            <li><a href="#" class="footer-link" data-agreement="privacy">隐私政策</a></li>
          </ul>
        </div>
        <div>
          <h4 style="margin-bottom:12px">帮助与客服</h4>
          <ul style="list-style:none;font-size:.85rem;opacity:.7;line-height:2">
            <li>📧 support@camerahub.com</li>
            <li>📞 400-888-1234</li>
            <li>💬 在线客服 (9:00-21:00)</li>
            <li><a href="#" class="footer-link" id="openChatBtn">立即咨询</a></li>
          </ul>
        </div>
        <div>
          <h4 style="margin-bottom:12px">关注我们</h4>
          <p style="font-size:.82rem;opacity:.6">微信搜索 "CameraHub"<br>关注公众号获取最新器材资讯</p>
        </div>
      </div>
      <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid rgba(255,255,255,.15);font-size:.78rem;opacity:.5">
        © 2026 CameraHub 相机租赁与二手保真交易平台 | 京ICP备XXXXXXXX号
      </div>
    </footer>
  `;
}

function initFooterLinks() {
  document.querySelectorAll('.footer-link[data-agreement]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const key = link.dataset.agreement;
      if (key === 'privacy') {
        showAgreement({ title: '隐私政策', content: '<h4>隐私政策</h4><p>CameraHub重视您的隐私保护。我们仅收集平台使用所必需的个人信息（手机号、实名认证信息），不会向第三方出售或共享您的个人信息。租赁和交易记录仅用于订单管理，不会用于商业推广。</p>' });
      } else {
        showAgreement(MockData.agreements[key]);
      }
    });
  });
  document.getElementById('openChatBtn')?.addEventListener('click', e => {
    e.preventDefault();
    openCustomerService();
  });
}

function showAgreement(agreement) {
  const modal = document.getElementById('agreementModal');
  const title = document.getElementById('agreementTitle');
  const body = document.getElementById('agreementBody');
  if (!modal || !title || !body) return;
  title.textContent = agreement.title;
  body.innerHTML = agreement.content;
  openModal('agreementModal');
}

function openCustomerService() {
  showToast('已连接在线客服，请描述您的问题', 'success', 4000);
  // 模拟客服对话
  setTimeout(() => {
    showToast('客服小美：您好，请问有什么可以帮您？', 'success', 4000);
  }, 2000);
}

// ==================== 首页 ====================
function renderHomePage() {
  // 首页重置筛选条件
  store.resetFilters();
  const hotProducts = filterProducts('rent').slice(0, 6);
  const usedProducts = filterProducts('used').slice(0, 4);

  mainContent.innerHTML = `
    <section class="hero">
      <div class="hero-content container">
        <h1>专业摄影器材租赁与交易平台</h1>
        <p>从入门到旗舰，覆盖全品牌全品类摄影器材。租得放心，买得安心，CameraHub为您保驾护航。</p>
        <div class="hero-btns">
          <a href="#/products" class="btn btn-primary">📸 浏览器材</a>
          <a href="#/used" class="btn btn-outline">🔄 二手交易</a>
          <a href="#/authenticate" class="btn btn-outline">✅ 保真鉴定</a>
        </div>
        <div class="stats-bar">
          <div class="stat-item"><div class="stat-num">100+</div><div class="stat-label">品牌覆盖</div></div>
          <div class="stat-item"><div class="stat-num">500+</div><div class="stat-label">器材品类</div></div>
          <div class="stat-item"><div class="stat-num">99.8%</div><div class="stat-label">好评率</div></div>
          <div class="stat-item"><div class="stat-num">24h</div><div class="stat-label">急速配送</div></div>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="section-header">
        <div><h2 class="section-title">器材分类</h2><p class="section-subtitle">全品类覆盖，满足各类拍摄需求</p></div>
      </div>
      <div class="category-grid">
        ${MockData.categories.map(c => `
          <a href="#/products" class="category-card" data-category="${c.id}">
            <div class="category-icon">${c.icon}</div>
            <div class="category-name">${c.name}</div>
          </a>
        `).join('')}
      </div>
    </section>

    <section class="section container">
      <div class="section-header">
        <div><h2 class="section-title">🔥 热门租赁</h2><p class="section-subtitle">精选热门器材，即刻租赁</p></div>
        <a href="#/products" class="btn btn-outline btn-sm">查看全部 →</a>
      </div>
      <div class="product-grid">
        ${hotProducts.map(p => renderProductCard(p)).join('')}
      </div>
    </section>

    <section class="section container">
      <div class="section-header">
        <div><h2 class="section-title">🔄 二手精选</h2><p class="section-subtitle">卖家认证，品质保障</p></div>
        <a href="#/used" class="btn btn-outline btn-sm">查看全部 →</a>
      </div>
      <div class="product-grid">
        ${usedProducts.map(p => renderProductCard(p)).join('')}
      </div>
    </section>

    <section class="section container">
      <div class="section-header"><h2 class="section-title">❓ 常见问题</h2></div>
      <div style="max-width:800px;margin:0 auto">
        ${MockData.faq.map(faq => `
          <details style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;margin-bottom:10px;cursor:pointer">
            <summary style="font-weight:500;font-size:.95rem">${faq.q}</summary>
            <p style="margin-top:10px;font-size:.88rem;color:var(--text-secondary)">${faq.a}</p>
          </details>
        `).join('')}
      </div>
    </section>
    ${footerHTML()}
  `;

  // 分类卡片点击
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      store.setFilter('category', card.dataset.category);
      store.setFilter('type', 'rent');
      navigate('#/products');
    });
  });
  bindProductCardEvents();
  initFooterLinks();
}

// ==================== 租赁商品列表 ====================
function renderProductsPage() {
  // 设置类型为租赁（如果从二手切换过来需要更新）
  if (store.state.filters.type === 'used') store.setFilter('type', 'rent');
  const products = filterProducts('rent');

  mainContent.innerHTML = `
    <div class="section container">
      <h2 class="section-title" style="margin-bottom:4px">📸 器材租赁</h2>
      <p class="section-subtitle" style="margin-bottom:20px">全品类摄影器材，按天/周/月灵活租赁</p>
      ${renderFilterBar(store.state.filters, { showTypeSwitch: true, showBrand: true, showCondition: true, showPrice: true, showSort: true, showKeyword: true })}
      ${products.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>暂无匹配器材</h3>
          <p>${store.state.filters.keyword ? `未找到与"<b>${escapeHTML(store.state.filters.keyword)}</b>"匹配的器材` : '请尝试调整筛选条件'}</p>
          ${store.state.filters.keyword ? `
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              <button class="btn btn-primary" id="aiSearchBtn" style="background:linear-gradient(135deg,#2563eb,#7c3aed)">
                🤖 AI 智能搜索
              </button>
              <button class="btn btn-outline" id="clearKeywordBtn">清除搜索</button>
            </div>
            <div id="aiSearchStatus" style="margin-top:12px;font-size:.85rem;color:var(--text-secondary)"></div>
            <div id="aiSearchResults" style="margin-top:16px"></div>
          ` : ''}
        </div>
      ` : `
        <div class="product-grid">${products.map(p => renderProductCard(p)).join('')}</div>
        <p style="text-align:center;color:var(--text-secondary);margin-top:20px;font-size:.85rem">共 ${products.length} 件器材</p>
      `}
    </div>
    ${footerHTML()}
  `;

  bindFilterEvents(() => {
    // 如果用户切换到二手类型，跳转到二手页面
    if (store.state.filters.type === 'used') {
      navigate('#/used');
      return;
    }
    renderProductsPage();
  });
  bindProductCardEvents();
  bindAISearchEvents('rent');
  initFooterLinks();
}

// ==================== 语义搜索统一绑定 ====================
function bindAISearchEvents(type) {
  const aiBtn = document.getElementById('aiSearchBtn');
  const clearBtn = document.getElementById('clearKeywordBtn');
  const statusEl = document.getElementById('aiSearchStatus');
  const resultsEl = document.getElementById('aiSearchResults');

  clearBtn?.addEventListener('click', () => {
    store.setFilter('keyword', '');
    if (type === 'used') navigate('#/used');
    else navigate('#/products');
  });

  aiBtn?.addEventListener('click', async () => {
    const query = store.state.filters.keyword;
    if (!query) return;

    aiBtn.disabled = true;
    aiBtn.textContent = '⏳ AI 思考中...';
    if (statusEl) statusEl.textContent = '正在调取 AI 理解您的搜索意图...';

    const result = await AIService.semanticSearch(query);

    aiBtn.disabled = false;
    aiBtn.textContent = '🤖 AI 智能搜索';

    if (result.error) {
      if (statusEl) statusEl.innerHTML = `<span style="color:var(--danger)">❌ ${result.error}</span>`;
      return;
    }

    if (!result.results || result.results.length === 0) {
      if (statusEl) statusEl.textContent = '😔 AI 也没有找到匹配的器材，请换个说法试试';
      return;
    }

    // 渲染 AI 搜索结果
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--success)">✅ AI 理解了您的需求，共找到 ${result.results.length} 件器材：</span>`;
    if (resultsEl) {
      resultsEl.innerHTML = `
        <div class="product-grid" style="margin-top:12px">
          ${result.results.map(p => renderProductCard(p)).join('')}
        </div>
      `;
      bindProductCardEvents();
    }
  });
}

// ==================== 商品详情 ====================
function renderProductDetail(id) {
  const product = MockData.products.find(p => p.id === id);
  if (!product) { renderNotFound(); return; }

  const condition = MockData.conditions.find(c => c.id === product.condition);
  const brand = MockData.brands.find(b => b.id === product.brand);
  const category = MockData.categories.find(c => c.id === product.category);
  const selection = { period: 'daily', days: 1, startDate: new Date().toISOString().split('T')[0] };

  const isUsed = product.type === 'used';

  mainContent.innerHTML = `
    <div class="container" style="padding-bottom:50px">
      <div class="detail-layout">
        <div class="detail-gallery">
          <div class="detail-main-img">
            <img src="${productImgUrl(product.shortName.replace(/\s/g,''), 800, 600)}" alt="${product.name}" />
          </div>
          <div class="detail-thumbs">
            ${(product.images || ['placeholder']).map((_, i) => `
              <div class="detail-thumb ${i === 0 ? 'active' : ''}">
                <img src="${productImgUrl(product.shortName.replace(/\s/g,'') + i, 140, 140)}" alt="" />
              </div>
            `).join('')}
          </div>
        </div>

        <div class="detail-info">
          <span class="product-tag" style="position:static;display:inline-flex;margin-bottom:12px">${isUsed ? '二手交易' : '器材租赁'}</span>
          <h1>${product.name}</h1>
          <div class="detail-rating">
            <span style="color:var(--warning)">${'⭐'.repeat(Math.round((product.rating || 80) / 20))}</span>
            <span>${product.rating || 80}%好评</span>
            <span>|</span>
            <span>已租/售 ${product.sold || 0} 次</span>
            ${product.stock > 0 ? `<span style="color:var(--success)">| 库存${product.stock}件</span>` : '<span style="color:var(--danger)">| 暂无库存</span>'}
          </div>

          ${isUsed ? `
            <div class="detail-price-block">
              <div style="font-size:.85rem;color:var(--text-secondary);margin-bottom:4px">售价</div>
              <div class="detail-price">¥${(product.price.sell || 0).toLocaleString()}${product.stock < 1 ? '<span style="font-size:1rem;color:var(--danger);margin-left:12px">已售罄</span>' : ''}</div>
              <div class="detail-price-note">原价 ¥${(product.price.original || (product.price.sell || 0) * 1.5).toLocaleString()}</div>
            </div>
          ` : `
            <div class="detail-price-block">
              <div style="font-size:.85rem;color:var(--text-secondary);margin-bottom:4px">日租金</div>
              <div class="detail-price">¥${product.price.daily}<span style="font-size:1rem;font-weight:400">/天</span></div>
              <div class="detail-price-note">周租 ¥${product.price.weekly} | 月租 ¥${product.price.monthly} | 押金 ¥${product.price.deposit}</div>
            </div>
          `}

          <div class="detail-meta">
            <div class="detail-meta-row"><span class="detail-meta-label">品牌</span><span>${brand ? brand.name : '-'}</span></div>
            <div class="detail-meta-row"><span class="detail-meta-label">品类</span><span>${category ? category.name : '-'}</span></div>
            <div class="detail-meta-row"><span class="detail-meta-label">成色</span><span>${condition ? condition.name : '-'}</span></div>
            ${Object.entries(product.specs || {}).map(([k, v]) => `
              <div class="detail-meta-row"><span class="detail-meta-label">${k}</span><span>${v}</span></div>
            `).join('')}
          </div>

          ${!isUsed ? `
            <div class="detail-section">
              <h3>选择租期</h3>
              <div id="rentalSelector">${renderRentalPeriodSelector(product, selection)}</div>
              <div style="margin-top:12px">
                <label style="font-size:.85rem;font-weight:600;display:block;margin-bottom:6px">起租日期</label>
                <input type="date" class="input" id="rentalStartDate" value="${selection.startDate}" min="${selection.startDate}" style="max-width:200px" />
              </div>
            </div>
            <div id="priceCalculator">${renderPriceCalculator(product, selection)}</div>
          ` : ''}

          <div class="detail-actions">
            ${!isUsed ? `
              <button class="btn btn-primary btn-lg" id="addToCartBtn" style="flex:2" ${product.stock < 1 ? 'disabled' : ''}>
                🛒 加入购物车
              </button>
              <button class="btn btn-outline btn-lg" id="rentNowBtn" style="flex:1" ${product.stock < 1 ? 'disabled' : ''}>
                立即租赁
              </button>
            ` : `
              <button class="btn btn-primary btn-lg" style="flex:1" id="buyUsedBtn" ${product.stock < 1 ? 'disabled' : ''}>
                ${product.stock < 1 ? '🚫 已售罄' : `💰 立即购买 ¥${(product.price.sell || 0).toLocaleString()}`}
              </button>
              <button class="btn btn-outline btn-lg" style="flex:1" id="applyAuthBtn">
                ✅ 申请保真鉴定
              </button>
            `}
          </div>
        </div>
      </div>

      <div class="detail-section" style="margin-top:30px">
        <h3>器材描述</h3>
        <div class="detail-desc">${product.desc}</div>
      </div>

      ${isUsed && product.seller ? `
        <div class="detail-section">
          <h3>卖家信息</h3>
          <div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--bg);border-radius:var(--radius)">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:600">${product.seller.name[0]}</div>
            <div>
              <div style="font-weight:600">${product.seller.name} <span style="font-weight:400;color:var(--text-secondary);font-size:.82rem">⭐${product.seller.rating}</span></div>
              <div style="font-size:.82rem;color:var(--text-secondary)">${product.seller.trades}笔交易 | ${product.seller.joined}年加入</div>
            </div>
          </div>
        </div>
      ` : ''}

      ${product.reviews && product.reviews.length > 0 ? `
        <div class="detail-section">
          <h3>用户评价 (${product.reviews.length})</h3>
          <div class="review-list">
            ${product.reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-avatar">${r.avatar}</div>
                  <div>
                    <div class="review-name">${r.user}</div>
                    <div class="review-date">${r.date}</div>
                  </div>
                  <div class="review-rating">${'⭐'.repeat(r.rating)}</div>
                </div>
                <div class="review-content">${r.content}</div>
                ${r.pics && r.pics.length > 0 ? `
                  <div class="review-imgs">${r.pics.map((_, i) => `<img src="${productImgUrl('review' + i, 160, 160)}" alt="" />`).join('')}</div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
    ${footerHTML()}
  `;

  // 租期选择
  bindRentalPeriodEvents((sel) => {
    selection.period = sel.period;
    selection.days = sel.days;
    const calcDiv = document.getElementById('priceCalculator');
    if (calcDiv) calcDiv.innerHTML = renderPriceCalculator(product, selection);
  });

  // 起租日期
  document.getElementById('rentalStartDate')?.addEventListener('change', (e) => {
    selection.startDate = e.target.value;
  });

  // 缩略图
  document.querySelectorAll('.detail-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const mainImg = document.querySelector('.detail-main-img img');
      const thumbImg = thumb.querySelector('img');
      if (mainImg && thumbImg) mainImg.src = thumbImg.src;
    });
  });

  // 购物车按钮
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    if (!store.state.user) { openModal('loginModal'); showToast('请先登录', 'warning'); return; }
    if (product.stock < 1) { showToast('该器材暂无库存', 'error'); return; }
    store.addToCart(product, selection.period, selection.days, selection.startDate);
    updateCartUI();
    showToast(`已将 ${product.shortName} 加入购物车`, 'success');
  });

  document.getElementById('rentNowBtn')?.addEventListener('click', () => {
    if (!store.state.user) { openModal('loginModal'); showToast('请先登录', 'warning'); return; }
    if (product.stock < 1) { showToast('该器材暂无库存', 'error'); return; }
    store.addToCart(product, selection.period, selection.days, selection.startDate);
    updateCartUI();
    navigate('#/cart');
  });

  document.getElementById('buyUsedBtn')?.addEventListener('click', () => {
    if (!store.state.user) { openModal('loginModal'); showToast('请先登录', 'warning'); return; }
    if (product.stock < 1) { showToast('该商品已售罄', 'error'); return; }
    store.decreaseStock(product.id);
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
    store.addOrder({
      id: orderId, productId: product.id, productName: product.name,
      productImg: product.images ? product.images[0] : '', period: null, days: 0,
      price: product.price.sell, deposit: 0, status: 'completed',
      startDate: null, endDate: null, createdAt: new Date().toISOString().split('T')[0],
      isPurchase: true,
    });
    showToast(`购买成功！订单号: ${orderId}`, 'success');
    setTimeout(() => navigate('#/orders'), 1500);
  });

  document.getElementById('applyAuthBtn')?.addEventListener('click', () => {
    store.setFilter('keyword', product.shortName);
    navigate('#/authenticate');
  });

  initFooterLinks();
}

// ==================== 二手交易列表 ====================
function renderUsedPage() {
  if (store.state.filters.type === 'rent') store.setFilter('type', 'used');
  const products = filterProducts('used');

  mainContent.innerHTML = `
    <div class="section container">
      <h2 class="section-title" style="margin-bottom:4px">🔄 二手交易</h2>
      <p class="section-subtitle" style="margin-bottom:20px">卖家认证，保真鉴定，放心交易</p>
      ${renderFilterBar(store.state.filters, { showTypeSwitch: true, showBrand: true, showCondition: true, showPrice: true, showSort: true, showKeyword: true })}
      ${products.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>暂无二手器材</h3>
          <p>${store.state.filters.keyword ? `未找到与"<b>${escapeHTML(store.state.filters.keyword)}</b>"匹配的二手器材` : '请尝试调整筛选条件，或发布您的器材'}</p>
          ${store.state.filters.keyword ? `
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
              <button class="btn btn-primary" id="aiSearchBtn" style="background:linear-gradient(135deg,#2563eb,#7c3aed)">
                🤖 AI 智能搜索
              </button>
              <button class="btn btn-outline" id="clearKeywordBtn">清除搜索</button>
            </div>
            <div id="aiSearchStatus" style="margin-top:12px;font-size:.85rem;color:var(--text-secondary)"></div>
            <div id="aiSearchResults" style="margin-top:16px"></div>
          ` : `
            <a href="#/publish-used" class="btn btn-primary">发布二手器材</a>
          `}
        </div>
      ` : `
        <div class="product-grid">${products.map(p => renderProductCard(p)).join('')}</div>
        <p style="text-align:center;color:var(--text-secondary);margin-top:20px;font-size:.85rem">共 ${products.length} 件二手器材</p>
      `}
      <div style="text-align:center;margin-top:24px">
        <a href="#/publish-used" class="btn btn-outline">📢 发布您的二手器材</a>
      </div>
    </div>
    ${footerHTML()}
  `;

  bindFilterEvents(() => {
    if (store.state.filters.type === 'rent') {
      navigate('#/products');
      return;
    }
    renderUsedPage();
  });
  bindProductCardEvents();
  bindAISearchEvents('used');
  initFooterLinks();
}

// ==================== 二手详情（复用到ProductDetail） ====================
function renderUsedDetail(id) {
  renderProductDetail(id);
}

// ==================== 保真鉴定页 ====================
function renderAuthenticatePage() {
  mainContent.innerHTML = `
    <div class="container section">
      <div class="authenticate-hero">
        <h2>✅ 专业保真鉴定服务</h2>
        <p>联合专业检测机构，为您的二手器材提供权威鉴定报告</p>
        <a href="#/used" class="btn btn-outline" style="border-color:#fff;color:#fff">浏览二手器材</a>
      </div>
      <div class="authenticate-steps">
        <div class="step-card">
          <div class="step-number">1</div>
          <h4>提交申请</h4>
          <p>填写器材信息和鉴定需求</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h4>送检器材</h4>
          <p>将器材寄送至指定检测中心</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h4>专业检测</h4>
          <p>3-5个工作日全面检测</p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h4>出具报告</h4>
          <p>获得权威鉴定报告</p>
        </div>
      </div>
      <div class="authenticate-form">
        <h3 style="margin-bottom:20px">提交鉴定申请</h3>
        <div class="form-group">
          <label>器材名称 <span style="color:var(--danger)">*</span></label>
          <input type="text" class="input" id="authProductName" placeholder="请输入器材完整名称" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>品牌 <span style="color:var(--danger)">*</span></label>
            <select class="input" id="authBrand">
              <option value="">请选择品牌</option>
              ${MockData.brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>品类 <span style="color:var(--danger)">*</span></label>
            <select class="input" id="authCategory">
              <option value="">请选择品类</option>
              ${MockData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>机身/镜头编号</label>
          <input type="text" class="input" id="authSerial" placeholder="请输入序列号（如有）" />
        </div>
        <div class="form-group">
          <label>鉴定需求说明</label>
          <textarea class="input" id="authDesc" placeholder="请描述需要重点检测的内容" rows="3"></textarea>
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="submitAuthBtn">提交鉴定申请</button>
      </div>
      <div style="margin-top:40px">
        <h3 class="section-title" style="margin-bottom:16px">📋 鉴定案例</h3>
        ${store.getAuthenticateCases().map(c => `
          <div class="order-card">
            <div class="order-header">
              <span>${c.id} | ${c.productName}</span>
              <span class="order-status ${c.status === 'completed' ? 'completed' : 'pending'}">
                ${c.status === 'completed' ? (c.result === 'pass' ? '✓ 鉴定通过' : '✕ 鉴定未过') : '⏳ 鉴定中'}
              </span>
            </div>
            <div class="order-body">
              <p style="font-size:.85rem;color:var(--text-secondary)">申请人: ${c.applicant} | 提交日期: ${c.submitDate}</p>
              ${c.report ? `
                <div style="margin-top:12px;padding:16px;background:var(--bg);border-radius:var(--radius)">
                  <p style="font-weight:600;margin-bottom:8px">鉴定结论</p>
                  <p style="font-size:.88rem;color:var(--text-secondary)">${c.report.conclusion}</p>
                  <div style="margin-top:8px;font-size:.82rem;color:var(--text-secondary)">
                    ${Object.entries(c.report.details).map(([k, v]) => `<span style="display:inline-block;margin:4px 16px 4px 0">• ${k}: ${v}</span>`).join('')}
                  </div>
                  <p style="margin-top:8px;font-size:.78rem;color:var(--text-secondary)">鉴定师: ${c.report.inspector} | 鉴定日期: ${c.report.inspectDate}</p>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ${footerHTML()}
  `;

  document.getElementById('submitAuthBtn')?.addEventListener('click', () => {
    if (!store.state.user) { openModal('loginModal'); showToast('请先登录', 'warning'); return; }
    const name = document.getElementById('authProductName').value.trim();
    if (!name) { showToast('请输入器材名称', 'error'); return; }
    const brand = document.getElementById('authBrand').value;
    if (!brand) { showToast('请选择品牌', 'error'); return; }
    const category = document.getElementById('authCategory').value;
    if (!category) { showToast('请选择品类', 'error'); return; }
    store.addAuthenticateCase({
      id: 'AUTH-' + Date.now().toString(36).toUpperCase(),
      productName: name,
      brand,
      category,
      applicant: store.state.user.name,
      submitDate: new Date().toISOString().split('T')[0],
      status: 'pending', result: null, report: null,
    });
    showToast('鉴定申请已提交，请将器材寄送至指定地址', 'success');
    setTimeout(() => renderAuthenticatePage(), 1000);
  });
  initFooterLinks();
}

// ==================== 购物车页 ====================
function renderCartPage() {
  const cart = store.state.cart;

  mainContent.innerHTML = `
    <div class="cart-page container section">
      <h2 class="section-title" style="margin-bottom:20px">🛒 购物车</h2>
      ${cart.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">🛒</div>
          <h3>购物车为空</h3>
          <p>快去挑选心仪的器材吧</p>
          <a href="#/products" class="btn btn-primary">去租赁</a>
        </div>
      ` : `
        ${cart.map(item => {
          const product = MockData.products.find(p => p.id === item.productId);
          if (!product) return '';
          return `
            <div class="cart-page-item">
              <img src="${productImgUrl(product.shortName.replace(/\s/g,''), 200, 200)}" alt="${item.productName}" />
              <div class="cart-page-info">
                <div class="cart-page-name">${item.productName}</div>
                <div class="cart-page-meta">押金: ¥${item.deposit.toLocaleString()} | 日租金: ¥${item.dailyPrice}</div>
                <div class="cart-page-meta">周期: ${item.period === 'daily' ? '按天' : item.period === 'weekly' ? '按周' : item.period === 'monthly' ? '按月' : '自定义'}</div>
                <div class="cart-page-price">¥${calcItemPrice(product, item).toLocaleString()}</div>
                <div class="cart-page-actions">
                  <div class="qty-ctrl">
                    <button data-qty="${item.productId}" data-action="down">−</button>
                    <span>${item.days}天</span>
                    <button data-qty="${item.productId}" data-action="up">+</button>
                  </div>
                  <button class="btn btn-sm btn-outline" data-remove="${item.productId}" style="color:var(--danger);border-color:var(--danger)">删除</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
        <div class="cart-summary-block">
          <div class="cart-summary-row"><span>器材数量</span><span>${cart.length} 件</span></div>
          <div class="cart-summary-row"><span>租金合计</span><span style="color:var(--danger);font-weight:600">¥${store.getCartTotal().toLocaleString()}</span></div>
          <div class="cart-summary-row"><span>押金合计 (退还)</span><span style="color:var(--text-secondary)">¥${store.getCartDeposit().toLocaleString()}</span></div>
          <div class="cart-summary-row total"><span>应付总额</span><span style="color:var(--danger)">¥${(store.getCartTotal() + store.getCartDeposit()).toLocaleString()}</span></div>
          <p style="font-size:.8rem;color:var(--text-secondary);margin:4px 0 16px">归还验收后押金全额退还</p>
          <button class="btn btn-primary btn-block btn-lg" id="cartSubmitBtn">提交订单</button>
        </div>
      `}
    </div>
    ${footerHTML()}
  `;

  document.querySelectorAll('[data-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = parseInt(btn.dataset.qty);
      const action = btn.dataset.action;
      const item = store.state.cart.find(c => c.productId === pid);
      if (!item) return;
      let newDays = item.days;
      if (action === 'up') newDays = Math.min(90, newDays + 1);
      else newDays = Math.max(1, newDays - 1);
      store.updateCartItem(pid, { days: newDays, period: 'custom' });
      renderCartPage();
    });
  });

  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.removeFromCart(parseInt(btn.dataset.remove));
      updateCartUI();
      showToast('已从购物车移除');
      renderCartPage();
    });
  });

  document.getElementById('cartSubmitBtn')?.addEventListener('click', () => {
    if (!store.state.user) { openModal('loginModal'); showToast('请先登录', 'warning'); return; }
    if (store.state.cart.length === 0) return;
    checkoutCart();
    renderCartPage();
  });
  initFooterLinks();
}

// ==================== 订单页 ====================
function renderOrdersPage() {
  if (!store.state.user) {
    mainContent.innerHTML = `
      <div class="section container">
        <div class="empty-state">
          <div class="empty-icon">🔒</div>
          <h3>请先登录</h3>
          <p>登录后可查看您的订单</p>
          <button class="btn btn-primary" id="orderLoginBtn">立即登录</button>
        </div>
      </div>
      ${footerHTML()}
    `;
    document.getElementById('orderLoginBtn')?.addEventListener('click', () => openModal('loginModal'));
    initFooterLinks();
    return;
  }

  const orders = store.getOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const statusMap = {
    pending: { label: '待处理', cls: 'pending' },
    renting: { label: '租赁中', cls: 'renting' },
    completed: { label: '已完成', cls: 'completed' },
    cancelled: { label: '已取消', cls: 'cancelled' },
  };

  mainContent.innerHTML = `
    <div class="section container">
      <h2 class="section-title" style="margin-bottom:20px">📋 我的订单</h2>
      <div class="tabs">
        <button class="tab active" data-order-tab="all">全部</button>
        <button class="tab" data-order-tab="renting">租赁中</button>
        <button class="tab" data-order-tab="pending">待处理</button>
        <button class="tab" data-order-tab="completed">已完成</button>
      </div>
      ${orders.length === 0 ? `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>暂无订单</h3>
          <p>快去租赁或购买器材吧</p>
          <a href="#/products" class="btn btn-primary">去租赁</a>
        </div>
      ` : `
        <div id="orderList">
          ${orders.map(o => {
            const status = statusMap[o.status] || { label: o.status, cls: '' };
            return `
              <div class="order-card" data-status="${o.status}" data-order-id="${o.id}" data-product-id="${o.productId}">
                <div class="order-header">
                  <span>${o.id} | ${o.createdAt}</span>
                  <span class="order-status ${status.cls}">${status.label}</span>
                </div>
                <div class="order-body">
                  <div class="order-product">
                    <img src="${productImgUrl('order' + o.productId, 140, 140)}" alt="${o.productName}" />
                    <div>
                      <div style="font-weight:600;margin-bottom:4px">${o.productName}</div>
                      <div style="font-size:.82rem;color:var(--text-secondary)">
                        ${o.isPurchase ? '二手购买' : (o.period === 'daily' ? `按天租赁 x${o.days}天` : o.period === 'weekly' ? '按周租赁' : o.period === 'monthly' ? '按月租赁' : `自定义 x${o.days}天`)}
                        ${o.startDate ? ` | ${o.startDate} ~ ${o.endDate || '进行中'}` : ''}
                      </div>
                      <div style="font-weight:600;color:var(--danger);margin-top:4px">¥${o.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div class="order-footer">
                  ${o.status === 'renting' ? '<button class="btn btn-sm btn-outline" data-action="return">📦 申请归还</button>' : ''}
                  ${o.status === 'completed' ? '<button class="btn btn-sm btn-outline" data-action="rerent">🔄 再次租赁</button>' : ''}
                  ${o.status === 'pending' ? '<button class="btn btn-sm btn-danger" data-action="cancel">✕ 取消订单</button>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div id="orderEmptyHint" style="display:none;text-align:center;padding:30px;color:var(--text-secondary);font-size:.9rem">该分类暂无订单</div>
      `}
    </div>
    ${footerHTML()}
  `;

  // Tab 切换（带空状态提示）
  document.querySelectorAll('[data-order-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-order-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.orderTab;
      let visibleCount = 0;
      document.querySelectorAll('.order-card').forEach(card => {
        if (filter === 'all') { card.style.display = ''; visibleCount++; }
        else if (card.dataset.status === filter) { card.style.display = ''; visibleCount++; }
        else { card.style.display = 'none'; }
      });
      // 显示/隐藏空提示
      const emptyHint = document.getElementById('orderEmptyHint');
      if (emptyHint) emptyHint.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });

  // 订单操作按钮 - 取消订单
  document.querySelectorAll('[data-action="cancel"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.order-card');
      const orderId = card.dataset.orderId;
      if (confirm('确定要取消该订单吗？')) {
        store.cancelOrder(orderId);
        showToast('订单已取消', 'success');
        renderOrdersPage();
      }
    });
  });

  // 订单操作按钮 - 申请归还
  document.querySelectorAll('[data-action="return"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.order-card');
      const orderId = card.dataset.orderId;
      if (confirm('确认归还器材？归还后押金将在24小时内退还。')) {
        store.completeOrder(orderId);
        showToast('归还申请已提交，押金将在24小时内退还', 'success');
        renderOrdersPage();
      }
    });
  });

  // 订单操作按钮 - 再次租赁
  document.querySelectorAll('[data-action="rerent"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.order-card');
      const pid = card.dataset.productId;
      if (pid) navigate('#/product/' + pid);
    });
  });

  initFooterLinks();
}

// ==================== 发布二手页 ====================
function renderPublishUsedPage() {
  if (!store.state.user) {
    mainContent.innerHTML = `
      <div class="section container">
        <div class="empty-state">
          <div class="empty-icon">🔒</div>
          <h3>请先登录</h3>
          <p>登录后可发布二手器材</p>
          <button class="btn btn-primary" id="publishLoginBtn">立即登录</button>
        </div>
      </div>
      ${footerHTML()}
    `;
    document.getElementById('publishLoginBtn')?.addEventListener('click', () => openModal('loginModal'));
    initFooterLinks();
    return;
  }

  mainContent.innerHTML = `
    <div class="container section">
      <div class="publish-form">
        <h2>📢 发布二手器材</h2>
        <p style="font-size:.85rem;color:var(--text-secondary);margin-bottom:20px">请如实描述器材信息，虚假描述将影响卖家信用</p>
        <div class="form-group">
          <label>器材完整名称 <span style="color:var(--danger)">*</span></label>
          <input type="text" class="input" id="pubName" placeholder="如 Canon EOS R5 单机" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>品牌 <span style="color:var(--danger)">*</span></label>
            <select class="input" id="pubBrand"><option value="">请选择</option>${MockData.brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label>品类 <span style="color:var(--danger)">*</span></label>
            <select class="input" id="pubCategory"><option value="">请选择</option>${MockData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>成色</label>
            <select class="input" id="pubCondition">${MockData.conditions.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label>售价 (¥) <span style="color:var(--danger)">*</span></label>
            <input type="number" class="input" id="pubPrice" placeholder="输入价格" />
          </div>
        </div>
        <div class="form-group">
          <label>原价 (¥)</label>
          <input type="number" class="input" id="pubOriginalPrice" placeholder="选填，用于展示折价" />
        </div>
        <div class="form-group">
          <label>器材参数</label>
          <div id="pubSpecsContainer">
            <div class="spec-row" style="display:flex;gap:8px;margin-bottom:8px">
              <input type="text" class="input" placeholder="参数名（如传感器）" data-spec-key style="flex:1" />
              <input type="text" class="input" placeholder="参数值（如4500万像素）" data-spec-val style="flex:1" />
              <button type="button" class="btn btn-sm btn-outline" data-spec-remove style="display:none;flex-shrink:0">✕</button>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-outline" id="addSpecBtn" style="margin-top:8px">+ 添加参数</button>
        </div>
        <div class="form-group">
          <label>商品描述 <span style="color:var(--danger)">*</span></label>
          <textarea class="input" id="pubDesc" placeholder="请详细描述器材使用情况、瑕疵、配件等信息" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label>所在地</label>
          <input type="text" class="input" id="pubLocation" placeholder="如 北京" />
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="pubSubmitBtn">发布器材</button>
      </div>
    </div>
    ${footerHTML()}
  `;

  // 参数行添加/删除
  document.getElementById('addSpecBtn')?.addEventListener('click', () => {
    const container = document.getElementById('pubSpecsContainer');
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.style.cssText = 'display:flex;gap:8px;margin-bottom:8px';
    row.innerHTML = `
      <input type="text" class="input" placeholder="参数名" data-spec-key style="flex:1" />
      <input type="text" class="input" placeholder="参数值" data-spec-val style="flex:1" />
      <button type="button" class="btn btn-sm btn-outline" data-spec-remove style="flex-shrink:0">✕</button>
    `;
    container.appendChild(row);
    row.querySelector('[data-spec-remove]').addEventListener('click', () => row.remove());
  });
  // 初始删除按钮事件
  document.querySelectorAll('[data-spec-remove]').forEach(btn => {
    btn.parentElement && btn.addEventListener('click', () => btn.parentElement.remove());
  });

  document.getElementById('pubSubmitBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('pubName').value.trim();
    if (!name) { showToast('请输入器材名称', 'error'); return; }
    const brand = document.getElementById('pubBrand').value;
    if (!brand) { showToast('请选择品牌', 'error'); return; }
    const category = document.getElementById('pubCategory').value;
    if (!category) { showToast('请选择品类', 'error'); return; }
    const price = document.getElementById('pubPrice').value;
    if (!price || parseInt(price) <= 0) { showToast('请输入有效售价', 'error'); return; }
    const desc = document.getElementById('pubDesc').value.trim();
    if (!desc) { showToast('请输入商品描述', 'error'); return; }

    // 从 key-value 表单收集参数
    const specs = {};
    document.querySelectorAll('#pubSpecsContainer .spec-row').forEach(row => {
      const key = row.querySelector('[data-spec-key]').value.trim();
      const val = row.querySelector('[data-spec-val]').value.trim();
      if (key && val) specs[key] = val;
    });

    const result = await API.publishUsed({
      name, brand, category,
      condition: document.getElementById('pubCondition').value,
      price,
      originalPrice: document.getElementById('pubOriginalPrice').value || '0',
      specs: specs,
      desc,
      location: document.getElementById('pubLocation').value || '',
    });
    if (result.code === 0) {
      showToast('发布成功！您的器材已上架', 'success');
      setTimeout(() => navigate('#/used'), 1500);
    } else {
      showToast(result.message || '发布失败', 'error');
    }
  });
  initFooterLinks();
}

// ==================== 404页面 ====================
function renderNotFound() {
  mainContent.innerHTML = `
    <div class="section container">
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>页面未找到</h3>
        <p>您访问的页面不存在或已被移除</p>
        <a href="#/" class="btn btn-primary">返回首页</a>
      </div>
    </div>
    ${footerHTML()}
  `;
  initFooterLinks();
}

// ==================== 通用事件绑定 ====================
function bindProductCardEvents() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      const link = card.dataset.link;
      if (link) navigate(link);
    });
  });
  document.querySelectorAll('[data-action="view"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (card?.dataset.link) navigate(card.dataset.link);
    });
  });
}

// ==================== 全局初始化 ====================
function initApp() {
  // 注册路由（在所有页面函数定义后）
  initRoutes();

  // 初始化弹窗关闭事件
  initModals();

  // 初始化登录
  initLogin();

  // 初始化购物车面板
  initCartPanel();

  // 初始化移动端侧栏
  initMobileSidebar();

  // 更新用户 UI
  updateUserUI();
  updateCartUI();

  // 监听 store 变化更新UI
  store.subscribe(() => {
    updateUserUI();
    updateCartUI();
  });

  // 导航链接点击
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.dataset.nav);
    });
  });

  // 首次路由
  handleRoute();

  // 初始化 AI 智能助手（DeepSeek）
  if (typeof initAI === 'function') {
    initAI();
  }
}

// 启动应用 - 兼容 DOM 已加载的情况
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
