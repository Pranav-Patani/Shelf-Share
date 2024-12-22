import { getJSON } from './helpers';
import { API_URL, API_KEY } from './config';

export const state = {
  book: {},
  search: {
    query: '',
    results: [],
  },
  bookmarks: [],
  collections: [], //array of objects
  selectedBooks: [],
};

// Individual Book

export const loadBook = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);
    state.book = {
      id: data.id,
      title: data.volumeInfo?.title || 'title not available',
      authors: data.volumeInfo?.authors || ['author not available'],
      publisher: data.volumeInfo?.publisher || 'not available',
      publishedDate: data.volumeInfo?.publishedDate || 'not available',
      description: data.volumeInfo?.description || 'description not available',
      isbn: data.volumeInfo?.industryIdentifiers
        ? data.volumeInfo?.industryIdentifiers[1].identifier
        : 'not available',
      pageCount: data.volumeInfo?.pageCount || 'not available',
      categories: data.volumeInfo?.categories || ['others'],
      rating: data.volumeInfo?.averageRating || 'not available',
      image: data.volumeInfo?.imageLinks.thumbnail || 'image not available',
      language: data.volumeInfo?.language || 'not available',
      previewLink: data.volumeInfo?.previewLink || 'not available',
      embeddable: data.accessInfo?.embeddable,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.book.bookmarked = true;
    else state.book.bookmarked = false;
  } catch (err) {
    console.error(err);
  }
};

// Search Results

export const loadSearchResults = async function (query, subject) {
  try {
    state.search.query = query;
    const data = await getJSON(
      `${API_URL}?q=${query && !subject ? query : !query && subject ? `''+subject:${subject}` : query && subject ? `${query}+subject:${subject}` : ``}&maxResults=40&key=${API_KEY}`,
    );
    state.search.results = data.items.map(cur => ({
      id: cur.id,
      rating: cur.volumeInfo?.averageRating || 0,
      image: cur.volumeInfo?.imageLinks?.thumbnail,
      title: cur.volumeInfo?.title || 'title not available',
      authors: cur.volumeInfo?.authors || ['author not available'],
      bookmarked: state.bookmarks.some(bookmark => bookmark.id === cur.id),
      selected: state.selectedBooks.some(book => book.id === cur.id),
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Bookmarks

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = book => {
  state.bookmarks.push(book);

  if (book.id === state.book.id) state.book.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = id => {
  const index = state.bookmarks.findIndex(book => book.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.book.id) state.book.bookmarked = false;

  persistBookmarks();
};

// Collections

export const addSelectedBook = book => {
  if (!state.selectedBooks.some(selectedBook => selectedBook.id === book.id)) {
    state.selectedBooks.push(book);
    book.selected = true;
  }
};

export const removeSelectedBook = bookId => {
  state.selectedBooks = state.selectedBooks.filter(book => book.id !== bookId);
  const book = state.search.results.find(book => book.id === bookId);
  if (book) {
    book.selected = false;
  }
};

export const createCollection = collectionName => {
  const newCollection = {
    id: Date.now(),
    name: collectionName,
    books: [...state.selectedBooks],
  };
  state.collections.push(newCollection);
  state.selectedBooks.forEach(book => {
    book.selected = false;
  });
  state.selectedBooks = [];
  persistCollections();
};

export const deleteCollection = collectionId => {
  const index = state.collections.findIndex(
    collection => collection.id === Number(collectionId),
  );
  if (index === -1) return;
  state.collections.splice(index, 1);
  persistCollections();
};

export const deleteIndividualCollectionBook = (bookId, collectionId) => {
  state.collections.map(collection => {
    console.log('Collection id from model ', collectionId);
    console.log('Book id from model ', bookId);
    if (collection.id === Number(collectionId)) {
      const bookIndex = collection.books.findIndex(book => book.id === bookId);
      console.log('book index: ', bookIndex);
      if (bookIndex === -1) return;
      collection.books.splice(bookIndex, 1);
      console.log(collection.books.length);
      if (collection.books.length === 0) {
        deleteCollection(collectionId);
      }
    }
  });
  persistCollections();
  console.log('From deleteCollectionBook: ', state.collections);
};

const persistCollections = function () {
  localStorage.setItem('collections', JSON.stringify(state.collections));
};

// Initialize

const init = function () {
  const storageBookmarks = localStorage.getItem('bookmarks');
  const storageCollections = localStorage.getItem('collections');
  if (storageBookmarks) state.bookmarks = JSON.parse(storageBookmarks);
  if (storageCollections) state.collections = JSON.parse(storageCollections);
};

init();

// const clearBookmarks = function () {
//   localStorage.clear("bookmarks");
// };

// clearBookmarks();
