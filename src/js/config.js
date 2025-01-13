import 'dotenv/config';

export const API_URL = 'https://www.googleapis.com/books/v1/volumes';
/* eslint-disable-next-line no-undef */
export const API_KEY = process.env.API_KEY;
/* eslint-disable-next-line no-undef */
export const MIXPANEL_TOKEN = process.env.MIXPANEL_TOKEN
  ? /* eslint-disable-next-line no-undef */
    process.env.MIXPANEL_TOKEN
  : '';
/* eslint-disable-next-line no-undef */
export const SUPABASE_TOKEN = process.env.SUPABASE_TOKEN;
/* eslint-disable-next-line no-undef */
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const TIMEOUT_SEC = 10;
export const MIXPANEL_EVENTS = {
  CLICKED_SHARE: 'Clicked Share',
  CLICKED_SEARCH: 'Clicked Search',
  CLICKED_BOOKMARK: 'Clicked Bookmark',
  CLICKED_SEARCH_FILTER: 'Clicked Search Filter',
  CREATED_COLLECTION: 'Created Collection',
  VIEWED_HOME_PAGE: 'Viewed Home Page',
  VIEWED_FIND_BOOKS_PAGE: 'Viewed Find Books Page',
  VIEWED_CREATE_COLLECTIONS_PAGE: 'Viewed Create Collections Page',
  VIEWED_SHELF: 'Viewed Shelf',
  VIEWED_COLLECTION: 'Viewed Collection',
  VIEWED_BOOK: 'Viewed Book',
};
