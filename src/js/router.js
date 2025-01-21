class Router {
  constructor() {
    this._routes = [];
  }

  set routes(routes) {
    this._routes = routes;
    this._loadInitialRoute();
  }

  get routes() {
    return this._routes;
  }

  _matchedURL(path) {
    return this.routes.find(route => route.path === path);
  }

  _loadInitialRoute() {
    const path = window.location.pathname;
    this._loadRoute(path);
  }

  _loadRoute(path) {
    try {
      const matchedRoute = this._matchedURL(path);
      if (!matchedRoute) throw new Error('Route Not Found');
      matchedRoute.callback();
    } catch (err) {
      console.error(err);
      this.navigateTo('/page-not-found');
    }
  }

  navigateTo(path) {
    window.history.pushState('', '', path);
    const splitPath = path.split('?');
    if (splitPath.length > 1) {
      path = splitPath[0];
    }
    this._loadRoute(path);
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
    navBtns.forEach(btn =>
      btn.classList.remove(
        'header__max-width-container__btn-container__btn-link--active',
      ),
    );
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
        btn.classList.add(
          `header__max-width-container__btn-container__btn-link--active`,
        );
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
