import * as model from './model';
import BookView from './views/bookView';
import SearchView from './views/searchView';
import FindBooksView from './views/findBooksView';
import CreateCollectionsView from './views/createCollectionsView';
import CollectionView from './views/individualCollectionView';
import BookmarksView from './views/bookmarksView';
import CollectionsView from './views/collectionsView';
import Router from './router';
import HomeView from './views/homeView';
import NavigationView from './views/navigationView';
import FooterView from './views/footerView';
import bookView from './views/bookView';

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
  //Later pass routes to one function and from there pass to all other for better readability
};

// Initial View

const setUpInitialView = function () {
  NavigationView.render();
  NavigationView.addHandlerActiveLink();
  FooterView.render();
};

const setUpHomeView = function () {
  HomeView.render();
};

// Individual Book View

const controlBooks = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    await model.loadBook(id);
    BookView.render(model.state.book);
  } catch (err) {
    console.log(err);
  }
};

// Search Results View

const controlSearchResults = async function (path) {
  try {
    const query = SearchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
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
  if (path === 'createCollections')
    SearchView.render('', true, 'collection-btn');
  else SearchView.render();
  SearchView.addHandlerSearch(() => controlSearchResults(path));
  if (path === 'findBooks')
    FindBooksView.addHandlerBookmark(controlSearchResultBookmark);
  if (path === 'createCollections') {
    CreateCollectionsView.addHandlerAddBook(controlAddToCollection);
    SearchView.addHandlerCreateCollection(controlCreateCollection);
  }
};

// Bookmarks

const controlAddBookmark = function () {
  if (!model.state.book.bookmarked) model.addBookmark(model.state.book);
  else model.deleteBookmark(model.state.book.id);
  bookView.update(model.state.book);
};

const controlRemoveBookmark = function (bookId) {
  try {
    model.deleteBookmark(bookId);
    BookmarksView.render(model.state.bookmarks);
  } catch (err) {
    console.error(`Error in controlRemoveBookmark: ${err.message}`);
  }
};

const setUpBookmarksView = function () {
  BookmarksView.render(model.state.bookmarks);
  BookmarksView.addHandlerRemoveBookmark(controlRemoveBookmark);
  BookmarksView.addHandlerLinks();
  BookmarksView.addHandlerTabs();
};

// Collections

const setUpCollectionsView = function () {
  CollectionsView.render(model.state.collections);
  CollectionsView.addHandlerViewCollection(controlCollectionView);
  CollectionsView.addHandlerDeleteCollection(controlDeleteCollection);
  CollectionsView.addHandlerLinks();
  CollectionsView.addHandlerTabs();
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

const controlCreateCollection = function () {
  const collectionName = prompt('Enter a name for your collection:');
  if (collectionName) {
    model.createCollection(collectionName);
    alert('Collection created successfully!');
    SearchView.updateSelectedBooks(model.state.selectedBooks);
    CreateCollectionsView.update(model.state.search.results);
  }
};

const controlCollectionView = function (collectionId) {
  const collection = model.state.collections.find(
    collection => collection.id === Number(collectionId),
  );
  CollectionView.render(collection, true, 'remove-collection-btn');
  CollectionView.addHandlerGoBack(controlCollectionBackBtn);
  CollectionView.addHandlerShare(controlCollectionShareUrl);
};

const controlDeleteCollection = function (collectionId) {
  if (confirm('Are you sure you want to delete this collection?')) {
    model.deleteCollection(collectionId);
    BookmarksView.render({
      bookmarks: model.state.bookmarks,
      collections: model.state.collections,
    });
  }
};

const controlCollectionBackBtn = function () {
  setUpBookmarksView();
};

const controlCollectionShare = function () {
  const keys = window.location.search;
  const urlParams = new URLSearchParams(keys);
  const data = urlParams.get('data');

  if (data) {
    const collectionData = JSON.parse(decodeURIComponent(data));
    CollectionView.render(collectionData, true, 'shared-view');
  } else {
    console.log('No data params found.');
  }
};

const controlCollectionShareUrl = function (collection) {
  const encodedData = encodeURIComponent(JSON.stringify(collection));
  const shareableUrl = `${window.location.origin}?data=${encodedData}`;
  console.log(shareableUrl);
  const copyToClipboard = async function () {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      alert('Url copied to clipboard');
    } catch (err) {
      console.error("Couldn't copy the URL. Error: ", err);
      alert("Couldn't copy the Url");
    }
  };
  copyToClipboard();
};

const init = function () {
  setUpInitialView();
  controlRouter();
  BookView.addHandlerRender(controlBooks);
  BookView.addHandlerAddBookmark(controlAddBookmark);
  CollectionView.addHandlerRenderShare(controlCollectionShare);
};

init();
