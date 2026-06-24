/**
 * CameraHub 前端路由
 * Hash-based SPA路由
 */
const routes = {};

function route(path, handler) {
  routes[path] = handler;
}

function initRoutes() {
  // 延迟注册，确保所有页面渲染函数已定义
  route('/', renderHomePage);
  route('/products', renderProductsPage);
  route('/product/:id', params => renderProductDetail(parseInt(params.id)));
  route('/used', renderUsedPage);
  route('/used/:id', params => renderUsedDetail(parseInt(params.id)));
  route('/authenticate', renderAuthenticatePage);
  route('/cart', renderCartPage);
  route('/orders', renderOrdersPage);
  route('/publish-used', renderPublishUsedPage);
}

function matchRoute(hash) {
  const path = hash.replace(/^#/, '') || '/';
  // 精确匹配
  if (routes[path]) return { handler: routes[path], params: {} };
  // 动态路由匹配 :param
  for (const [pattern, handler] of Object.entries(routes)) {
    if (!pattern.includes(':')) continue;
    // 构建正则: 将 :param 替换为捕获组
    const regexStr = '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, '([^/]+)') + '$';
    const match = path.match(new RegExp(regexStr));
    if (match) {
      const paramNames = [...pattern.matchAll(/:(\w+)/g)].map(m => m[1]);
      const params = {};
      paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
      return { handler, params };
    }
  }
  // 404
  return { handler: renderNotFound, params: {} };
}

function navigate(hash) {
  window.location.hash = hash;
}

window.addEventListener('hashchange', () => {
  handleRoute();
});

function handleRoute() {
  const { handler, params } = matchRoute(window.location.hash);
  // 更新导航状态
  const currentPath = window.location.hash.replace(/^#/, '') || '/';
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === currentPath);
  });
  // 关闭移动侧栏
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  // 滚动到顶部
  window.scrollTo(0, 0);
  // 执行路由处理函数
  handler(params);
}
