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
import bookView from './views/bookView';

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
    { path: '/findBooks', callback: () => setUpSearchView('findBooks') },
    { path: '/bookmarks', callback: () => setUpBookmarksView() },
    { path: '/collections', callback: () => setUpCollectionsView() },
    {
      path: '/createCollections',
      callback: () => setUpSearchView('createCollections'),
    },
  ];

  Router.setRoutes(routes);
  Router.addHandlerRouter();
};

// Initial View

const setUpInitialView = function () {
  HeaderView.render();
  HeaderView.addHandlerNavigationLinks();
  HeaderView.addHandlerActiveLink();
  HeaderView.addHandlerNavbarPosition();
  FooterView.render();
};

const setUpHomeView = function () {
  HomeView.render();
  HomeView.addHandlerCTALinks();
  HomeView.addHandlerCarousel();
};

// Individual Book View

const controlBooks = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    await model.loadBook(id);
    BookView.render(model.state.book);
    BookView.addHandlerTabHandler();
    window.scrollTo({
      top: 0,
      left: 0,
    });
  } catch (err) {
    console.log(err);
  }
};

// Search Results View

const controlSearchResults = async function (path, query, category) {
  try {
    if (!query && !category) return;
    await model.loadSearchResults(query, category);
    if (path === 'findBooks') FindBooksView.render(model.state.search.results);
    if (path === 'createCollections')
      CreateCollectionsView.render(model.state.search.results);
  } catch (err) {
    console.error(err);
  }
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
  if (path === 'createCollections') {
    SearchView.render('', true, 'collection-btn');
    CreateCollectionsView.addHandlerAddBook(controlAddToCollection);
    SearchView.addHandlerCreateCollection(controlCreateCollection);
  } else if (path === 'findBooks') {
    SearchView.render();
    FindBooksView.addHandlerBookmark(controlSearchResultBookmark);
  }

  SearchView.addHandlerSearch((query, category) =>
    controlSearchResults(path, query, category),
  );
};

// Bookmarks

const controlAddBookmark = function () {
  if (!model.state.book.bookmarked) model.addBookmark(model.state.book);
  else model.deleteBookmark(model.state.book.id);
  bookView.update(model.state.book);
};

const controlRemoveBookmark = function (bookId) {
  model.deleteBookmark(bookId);

  // Find a more optimal way to render the below part

  BookmarksView.render(model.state.bookmarks);
  BookmarksView.addHandlerRemoveBookmark(controlRemoveBookmark);
  BookmarksView.addHandlerLinks();
};

const setUpBookmarksView = function () {
  BookmarksView.render(model.state.bookmarks);
  BookmarksView.addHandlerRemoveBookmark(controlRemoveBookmark);
  BookmarksView.addHandlerLinks();
};

// Collections

const setUpCollectionsView = function () {
  CollectionsView.render(model.state.collections);
  CollectionsView.addHandlerViewCollection(controlCollectionView);
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

const controlCreateCollection = function (collectionName) {
  if (!collectionName) return;
  model.createCollection(collectionName);
  SearchView.updateSelectedBooks(model.state.selectedBooks);
  CreateCollectionsView.update(model.state.search.results);
};

// Individual Collection

const controlCollectionView = function (collectionId) {
  const collection = model.state.collections.find(
    collection => collection.id === Number(collectionId),
  );
  // IndividualCollectionView.render(collection, true, 'remove-collection-btn');
  constructIndividualCollectionShareUrl(collection);
};

const controlDeleteCollection = function (collectionId) {
  model.deleteCollection(collectionId);

  // Find a more optimal way to achieve the below functionality

  CollectionsView.render(model.state.collections);

  CollectionsView.addHandlerViewCollection(controlCollectionView);
  CollectionsView.addHandlerDeleteCollection(controlDeleteCollection);
  CollectionsView.addHandlerLinks();
};

const controlIndividualCollectionRemoveBook = function (bookId, collectionId) {
  model.deleteIndividualCollectionBook(bookId, collectionId);
  const collection = model.state.collections.find(
    collection => collection.id === Number(collectionId),
  );
  if (collection)
    constructIndividualCollectionShareUrl(
      model.state.collections.find(
        collection => collection.id === Number(collectionId),
      ),
    );
  else CollectionsView.render(model.state.collections);
};

const controlIndividualCollectionShare = function () {
  const keys = window.location.search;
  const urlParams = new URLSearchParams(keys);
  const data = urlParams.get('data');

  if (data) {
    const collectionData = JSON.parse(decodeURIComponent(data));
    IndividualCollectionView.render(
      collectionData,
      true,
      'remove-collection-btn',
    );
    IndividualCollectionView.addHandlerShare(
      constructIndividualCollectionShareUrl,
    );
    IndividualCollectionView.addHandlerRemoveBook(
      controlIndividualCollectionRemoveBook,
    );
  }
};

const constructIndividualCollectionShareUrl = function (collection, btn) {
  const encodedData = encodeURIComponent(JSON.stringify(collection));
  const shareableUrl = `${window.location.origin}?data=${encodedData}`;

  window.history.pushState(model.state, '', shareableUrl);
  if (!btn) {
    controlIndividualCollectionShare();
    return;
  }
  const copyToClipboard = async function () {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      IndividualCollectionView.renderAlter('Url copied to clipboard');
    } catch (err) {
      console.error(`Couldn't copy the URL. Error: ${err}`);
      IndividualCollectionView.renderAlter(`Couldn't copy the URL`, true);
    }
  };
  copyToClipboard();
};

const init = function () {
  setUpInitialView();
  controlRouter();
  BookView.addHandlerRender(controlBooks);
  BookView.addHandlerAddBookmark(controlAddBookmark);
  IndividualCollectionView.addHandlerRenderShare(
    controlIndividualCollectionShare,
  );
};

init();
