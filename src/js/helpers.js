import { TIMEOUT_SEC } from './config';

const timeout = s =>
  new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });

export const getJSON = async url => {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const helperShare = async function (
  url,
  title = 'Checkout this book on bookwise!',
) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: 'Explore Books and Plan Your Reading Journey on Bookwise.',
        url: url,
      });
      return ``;
    } catch (err) {
      console.error(`Couldn't copy the URL via navigator.share, Error: ${err}`);
      try {
        await navigator.clipboard.writeText(url);
        return `Url copied to clipboard`;
      } catch (err) {
        console.error(
          `Couldn't copy the URL via navigator.clipboard, Error: ${err}`,
        );
        throw new Error(err);
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      return `Url copied to clipboard`;
    } catch (err) {
      console.error(`Couldn't copy the URL. Error: ${err}`);
      throw new Error(err);
    }
  }
};

export const debounce = (cb, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), delay);
  };
};

export const throttle = (cb, delay = 200) => {
  let shouldWait = false;
  let waitingArgs;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    cb(...args);
    shouldWait = true;

    setTimeout(timeoutFunc, delay);
  };
};

export const getUrlData = function (data) {
  const keys = window.location.search;
  const urlParams = new URLSearchParams(keys);
  const searchData = urlParams.get(data);
  if (!data) return;
  return JSON.parse(decodeURIComponent(searchData));
};

export const setUrlData = function (path, data, keyName) {
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const urlPath = `${path}?${keyName}=${encodedData}`;
  window.history.pushState('', '', urlPath);
  return urlPath;
};
