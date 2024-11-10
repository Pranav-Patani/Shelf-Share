import Router from './router';
import HomeView from './views/homeView';

// eslint-disable-next-line no-undef
if (module.hot) {
  // eslint-disable-next-line no-undef
  module.hot.accept();
}

// Router
const controlRouter = function () {
  const routes = [{ path: '/', callback: () => HomeView.render() }];

  const router = new Router(routes);
  router.addHandlerRouter();
};

const init = function () {
  controlRouter();
};

init();
