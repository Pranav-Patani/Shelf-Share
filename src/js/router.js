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
    return this.routes.find(route => route.path === path);
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
    const pathSegs = pathNameSplit.length > 1 ? pathNameSplit.slice(1) : [''];
    this._loadRoute(...pathSegs);
  }

  addHandlerRouter() {
    // For popstate event, when user choose to navigate through browser's back and forward buttons, rather than the Router's navigateTo method
    window.addEventListener('popstate', () => {
      this._loadInitialRoute();
    });
  }
}

export default new Router();
