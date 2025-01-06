class Router {
  constructor() {
    this.routes = [];
  }

  setRoutes(routes) {
    this.routes = routes;
    this._loadInitialRoute();
  }

  _matchedURL(urlSegs) {
    const path = '/' + urlSegs.join('/');
    return this.routes.find(route => {
      const [routePath] = route.path.split('?');
      return routePath === path;
    });
  }

  _loadInitialRoute() {
    const pathNameSplit = window.location.pathname.split('/');
    const pathSegs = pathNameSplit.length > 1 ? pathNameSplit.slice(1) : [''];
    this._loadRoute(...pathSegs);
  }

  _loadRoute(...urlSegs) {
    const matchedRoute = this._matchedURL(urlSegs);
    if (!matchedRoute) throw new Error('Route Not Found');
    matchedRoute.callback();
  }

  navigateTo(path) {
    window.history.pushState({}, '', path);
    const pathNameSplit = path.split('/');
    let pathSegs = pathNameSplit.length > 1 ? pathNameSplit.slice(1) : [''];
    if (pathSegs[0].includes('?')) {
      const filterPathSegs = pathSegs[0].split('?');
      pathSegs = filterPathSegs.slice(0, 1);
    }
    this._loadRoute(...pathSegs);
    window.scrollTo({
      top: 0,
      left: 0,
    });

    this._activeNavigationLinkHandler(path);
  }

  _activeNavigationLinkHandler = path => {
    const navBtns = document.querySelectorAll(
      `.header__max-width-container__btn-container__btn-link`,
    );
    navBtns.forEach(btn => btn.classList.remove('nav-active'));
    const activePath =
      path === '/'
        ? 'home'
        : path === '/collections'
          ? 'bookmarks'
          : path.split('/')[1].toLowerCase();
    navBtns.forEach(btn => {
      const curBtn =
        btn.dataset.route === '/'
          ? 'home'
          : btn.dataset.route.split('/')[1].toLowerCase();
      if (curBtn === activePath) {
        btn.classList.add(`nav-active`);
      }
    });
  };

  addHandlerRouter() {
    window.addEventListener('popstate', () => {
      this._loadInitialRoute();
    });

    const events = ['popstate', 'load'];
    events.forEach(event =>
      window.addEventListener(event, () =>
        this._activeNavigationLinkHandler(window.location.pathname),
      ),
    );
  }
}

export default new Router();
