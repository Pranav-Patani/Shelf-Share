class Router {
  constructor(routes) {
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

  _navigateTo(path) {
    window.history.pushState({}, '', path);
    const pathNameSplit = path.split('/');
    const pathSegs = pathNameSplit.length > 1 ? pathNameSplit.slice(1) : [''];
    this._loadRoute(...pathSegs);
  }

  addHandlerRouter() {
    const links = document.querySelectorAll('.router-link');
    links.forEach(a =>
      a.getAttribute('data-route')
        ? a.addEventListener('click', e => {
            e.preventDefault();
            this._navigateTo(a.getAttribute('data-route'));
          })
        : '',
    );
    window.addEventListener('popstate', () => {
      this._loadInitialRoute();
    });
  }
}

export default Router;
