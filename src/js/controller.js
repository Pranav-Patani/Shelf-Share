import * as model from './model';
import BookView from './views/bookView';
import SearchView from './views/searchView';
import FindBooksView from './views/findBooksView';
import CreateCollectionsView from './views/createCollectionsView';
import IndividualCollectionView from './views/individualCollectionView';
import BookmarksView from './views/bookmarksView';
import CollectionsView from './views/collectionsView';
import Router from './router';
import HomeView from './views/homeView';
import HeaderView from './views/headerView';
import FooterView from './views/footerView';
import ErrorView from './views/errorView';
import {
  createShortUrlId,
  getOriginalUrlParams,
  deleteSupabseRow,
} from './shortUrlUtils';
import {
  debounce,
  helperShare,
  getUrlData,
  setUrlData,
  mixPanelTrack,
  checkUtm,
} from './helpers';
import { MIXPANEL_TOKEN, MIXPANEL_EVENTS } from './config';
import mixpanel from 'mixpanel-browser';

//Pollifilling

import 'core-js/stable';
import 'regenerator-runtime/runtime'; // For Async Functions

// eslint-disable-next-line no-undef
if (module.hot) {
  // eslint-disable-next-line no-undef
  module.hot.accept();
}

// Router

const controlRouter = function () {
  const routes = [
    { path: '/', callback: () => setUpHomeView() },
    {
      path: '/find-books',
      callback: () => setUpSearchView(window.location.pathname),
    },
    { path: '/bookmarks', callback: () => setUpBookmarksView() },
    { path: '/collections', callback: () => setUpCollectionsView() },
    {
      path: '/create-collections',
      callback: () => setUpSearchView(window.location.pathname),
    },
    { path: '/book', callback: () => controlBooks() },
    { path: '/collection', callback: () => controlIndividualCollectionRoute() },
    { path: '/error', callback: () => setUpErrorView() },
  ];

  Router.setRoutes(routes);
  Router.addHandlerRouter();
};

// Initial View

const setUpInitialView = function () {
  HeaderView.render();
  HeaderView.addHandlerNavbarPosition();
  HeaderView.addHandlerCloseMenu();
  FooterView.render();
};

// Error View
const setUpErrorView = function () {
  ErrorView.render();
};

// Home View

const setUpHomeView = function () {
  HomeView.render();
  HomeView.addHandlerCarousel();
  HomeView.addHandlerSearch(controlHomeSearch);
  HomeView.addHandlerDebounce(query => controlSearchDebounce(query, 'home'));
  const properties = checkUtm();
  mixPanelTrack(MIXPANEL_EVENTS.VIEWED_HOME_PAGE, properties);
};

const controlHomeSearch = function (query) {
  Router.navigateTo('/find-books');
  controlSearchResults('/find-books', query);

  mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SEARCH, {
    from: 'Home Page',
  });
};

// Individual Book View

const setUpBookViewHandlers = function () {
  BookView.addHandlerTabHandler();
  BookView.addHandlerShare(controlBookShare);
  BookView.addHandlerXShare((title, url) => controlXShare(title, url));
  BookView.addHandlerAddBookmark(controlAddBookmark);
};

const controlBooks = async function () {
  try {
    const { id } = getUrlData('book-id');
    if (!id) {
      return;
    }
    BookView.renderLoader();
    await model.loadBook(id);
    BookView.render(model.state.book);
    setUpBookViewHandlers();
    const utm = checkUtm();
    mixPanelTrack(MIXPANEL_EVENTS.VIEWED_BOOK, {
      title: model.state.book.title,
      ...utm,
    });

    window.scrollTo({
      top: 0,
      left: 0,
    });
  } catch (err) {
    console.log(err);
    Router.navigateTo('/error');
  }
};

const controlBookShare = async function (title) {
  try {
    const path = window.location.href;
    const message = await helperShare(path, title);
    if (!message) return;
    BookView.renderToast(message, false);

    mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SHARE, {
      type: 'Default',
      item: 'Book',
    });
  } catch (err) {
    console.error(err);
    BookView.renderToast(`Couldn't copy the URL`, true);
  }
};

const controlXShare = function (title, url) {
  const text = `Check out the book ${title} on shelf share.`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(xUrl, '_blank');

  mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SHARE, {
    type: 'X',
    item: 'Book',
  });
};

const controlBookUrlCreation = function (route, id) {
  Router.navigateTo(setUrlData(route, { id }, false));
};

// Search Results View

const controlSearchResults = async function (path, query, category) {
  try {
    if (!query && !category) return;
    controlSearchUrlCreation(query, category, path);
    if (category) {
      mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SEARCH_FILTER, {
        type: category,
      });
    }

    if (path === '/find-books') {
      FindBooksView.renderLoader();
      mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SEARCH, {
        from: 'Find Books Page',
      });
    }
    if (path === '/create-collections') {
      CreateCollectionsView.renderLoader();

      mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SEARCH, {
        from: 'Create Collections Page',
      });
    }
    await model.loadSearchResults(query, category);

    if (path === '/find-books') {
      FindBooksView.render(model.state.search.results);
    }
    if (path === '/create-collections') {
      CreateCollectionsView.render(model.state.search.results);
    }
  } catch (err) {
    console.error(err);
    if (path === '/find-books') {
      FindBooksView.renderAlert();
    }
    if (path === '/create-collections') {
      CreateCollectionsView.renderAlert();
    }
  }
};

const controlSearchUrlCreation = function (query, category, path) {
  const searchParameters = { query, category, path };
  setUrlData(window.location.pathname, searchParameters);
};

const controlUrlSearchResultsLoad = function () {
  const searchParams = getUrlData();
  if (!searchParams) return;
  controlSearchResults(
    searchParams.path,
    searchParams.query,
    searchParams.category,
  );
};

const controlSearchResultBookmark = async function (bookId) {
  try {
    if (!bookId) throw new Error('Book ID is missing');

    const book = model.state.search.results.find(book => book.id === bookId);
    if (!book) throw new Error('Book not found in search results');

    if (!book.bookmarked) {
      model.addBookmark(book);
    } else {
      model.deleteBookmark(book.id);
    }

    book.bookmarked = !book.bookmarked;

    FindBooksView.update(model.state.search.results);
  } catch (err) {
    console.error(`Error in controlSearchResultBookmark: ${err.message}`);
  }
};

const setUpSearchView = function (path) {
  if (path === '/create-collections') {
    SearchView.render('', true, 'collection-btn');
    CreateCollectionsView.addHandlerAddBook(controlAddToCollection);
    SearchView.addHandlerCreateCollection(controlCreateCollection);
    SearchView.addHandlerResetSelections(controlResetSelections);
    SearchView.updateSelectedBooks(model.state.selectedBooks);

    mixPanelTrack(MIXPANEL_EVENTS.VIEWED_CREATE_COLLECTIONS_PAGE);
  } else if (path === '/find-books') {
    SearchView.render();
    FindBooksView.addHandlerBookmark(controlSearchResultBookmark);
    mixPanelTrack(MIXPANEL_EVENTS.VIEWED_FIND_BOOKS_PAGE);
  }
  SearchView.addHandlerSearch((query, category) =>
    controlSearchResults(path, query, category),
  );
  SearchView.addHandlerDebounce(query =>
    controlSearchDebounce(query, 'search'),
  );
  SearchView.addHandlerBookRoutes((route, id) =>
    controlBookUrlCreation(route, id),
  );
  controlUrlSearchResultsLoad();
};

const searchDebounceCallback = async function (query, path) {
  try {
    if (!query) {
      return;
    }
    await model.loadSearchTitles(query);
    if (path === 'home') {
      HomeView.updateSuggestions(model.state.search.titles);
    }
    if (path === 'search') {
      SearchView.updateSuggestions(model.state.search.titles);
    }
  } catch (err) {
    console.error(err);
    if (path === 'home') {
      HomeView.renderAlert();
    }
    if (path === 'search') {
      SearchView.renderAlert();
    }
  }
};

const debouncedSearch = debounce(searchDebounceCallback);

const controlSearchDebounce = (query, path) => debouncedSearch(query, path);

// Bookmarks

const controlAddBookmark = function () {
  if (!model.state.book.bookmarked) {
    model.addBookmark(model.state.book);

    mixPanelTrack(MIXPANEL_EVENTS.CLICKED_BOOKMARK, {
      title: model.state.book.title,
      authors: model.state.book.authors.join(`, `),
    });
  } else model.deleteBookmark(model.state.book.id);
  BookView.update(model.state.book);
};

const controlRemoveBookmark = function (bookId) {
  model.deleteBookmark(bookId);

  // Find a more optimal way to render the below part

  BookmarksView.render(model.state.bookmarks);
  BookmarksView.addHandlerRemoveBookmark(controlRemoveBookmark);
  BookmarksView.addHandlerLinks();
};

const setUpBookmarksView = function () {
  BookmarksView.renderLoader();
  BookmarksView.render(model.state.bookmarks);
  BookmarksView.addHandlerRemoveBookmark(controlRemoveBookmark);
  BookmarksView.addHandlerLinks();
  BookmarksView.addHandlerBookRoutes((route, id) =>
    controlBookUrlCreation(route, id),
  );

  mixPanelTrack(MIXPANEL_EVENTS.VIEWED_SHELF);
};

// Collections

const setUpCollectionsView = function () {
  CollectionsView.renderLoader();
  console.log(model.state.collections);
  CollectionsView.render(model.state.collections);
  CollectionsView.addHandlerViewCollection(
    controlIndividualCollectionViewButton,
  );
  CollectionsView.addHandlerDeleteCollection(controlDeleteCollection);
  CollectionsView.addHandlerLinks();
};

const controlAddToCollection = function (bookId) {
  const book = model.state.search.results.find(book => book.id === bookId);
  if (book) {
    if (book.selected) {
      model.removeSelectedBook(bookId);
    } else {
      model.addSelectedBook(book);
    }
    SearchView.updateSelectedBooks(model.state.selectedBooks);
    CreateCollectionsView.update(model.state.search.results);
  }
};

const controlResetSelections = function () {
  model.resetSelectedBooks();
  SearchView.updateSelectedBooks(model.state.selectedBooks);
  CreateCollectionsView.update(model.state.search.results);
};

const controlCreateCollection = function (collectionName, totalBooks) {
  if (!collectionName) return;

  model.createCollection(collectionName);
  SearchView.updateSelectedBooks(model.state.selectedBooks);
  CreateCollectionsView.update(model.state.search.results);

  mixPanelTrack(MIXPANEL_EVENTS.CREATED_COLLECTION, {
    name: collectionName,
    totalBooks: totalBooks,
  });
};

// Individual Collection

const controlRenderIndividualCollection = function (collection) {
  IndividualCollectionView.render(collection, true, 'no-button');
  IndividualCollectionView.addHandlerShare(() =>
    controlIndividualCollectionShare(collection),
  );
  IndividualCollectionView.addHandlerBookRoutes((route, id) =>
    controlBookUrlCreation(route, id),
  );
  window.scrollTo({
    top: 0,
    left: 0,
  });
  mixPanelTrack(MIXPANEL_EVENTS.VIEWED_COLLECTION);
};

const controlIndividualCollectionViewButton = async function (collectionId) {
  IndividualCollectionView.renderLoader();
  const collection = model.state.collections.find(
    collection =>
      collection.collectionId === Number(collectionId) ||
      collection.id === Number(collectionId),
  );
  if (!collection) IndividualCollectionView.renderAlert();
  controlRenderIndividualCollection(collection);
  const shortId = await createShortUrlId(collection);
  window.history.pushState('', '', `/collection?sId=${shortId}`);
};

const controlIndividualCollectionRoute = async function () {
  try {
    IndividualCollectionView.renderLoader();
    const { sId } = getUrlData();
    const collection = await getOriginalUrlParams(sId);
    controlRenderIndividualCollection(collection);
  } catch (e) {
    console.error(e);
    Router.navigateTo('/error');
  }
};

const controlIndividualCollectionShare = async function (collection) {
  try {
    const shortUrlId = await createShortUrlId(collection);
    const message = await helperShare(
      `${window.location.origin}/collection?sId=${shortUrlId}`,
      collection.collectionName,
      true,
    );
    if (!message) throw new Error(`Error copying URL`);

    IndividualCollectionView.renderToast(message, false);

    mixPanelTrack(MIXPANEL_EVENTS.CLICKED_SHARE, {
      type: 'Default',
      item: 'Collection',
    });
  } catch (err) {
    console.error(err);
    IndividualCollectionView.renderToast(`Couldn't copy the URL`, true);
  }
};

const deleteCollectionFromSupabase = function (collectionId) {
  deleteSupabseRow(collectionId);
};

const controlDeleteCollection = function (collectionId) {
  model.deleteCollection(collectionId);

  CollectionsView.render(model.state.collections);

  CollectionsView.addHandlerViewCollection(
    controlIndividualCollectionViewButton,
  );
  CollectionsView.addHandlerDeleteCollection(controlDeleteCollection);
  CollectionsView.addHandlerLinks();
  deleteCollectionFromSupabase(collectionId);
};

// Not in use currently

// const controlIndividualCollectionRemoveBook = function (bookId, collectionId) {
//   model.deleteIndividualCollectionBook(bookId, collectionId);
//   const collection = model.state.collections.find(
//     collection => collection.collectionId === Number(collectionId),
//   );
//   if (collection) {
//     controlRenderIndividualCollection(collection);
//   } else {
//     Router.navigateTo('/collections');
//   }
// };

const init = function () {
  if (MIXPANEL_TOKEN) {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: false,
      persistence: 'localStorage',
    });
  }

  setUpInitialView();
  controlRouter();
};

init();
