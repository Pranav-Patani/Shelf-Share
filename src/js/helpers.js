import { MIXPANEL_TOKEN, TIMEOUT_SEC } from './config';
import mixpanel from 'mixpanel-browser';

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

export const helperShare = async function (url, name, collection = false) {
  const text = collection
    ? `Check out my collection ${name} on shelf share.`
    : `Check out the book ${name} on shelf share.`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: text,
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
      await navigator.clipboard.writeText(`${text}\n${url}`);
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

export const getUrlData = function () {
  const keys = decodeURIComponent(window.location.search);
  const urlParams = new URLSearchParams(keys);
  const data = {};
  urlParams.forEach((val, key) => (data[key] = val));
  return data;
};

export const setUrlData = function (path, data, set = true) {
  const urlObject = new URL(path, window.location.origin);
  Object.entries(data).forEach(([key, val]) => {
    urlObject.searchParams.set(
      key,
      Array.isArray(val) ? encodeURIComponent(JSON.stringify(val)) : val,
    );
  });

  let url = urlObject.pathname;
  const finalUrl = encodeURI(`${url}?${urlObject.searchParams}`);
  if (set) {
    window.history.pushState('', '', finalUrl);
  }
  return finalUrl;
};

export const mixPanelTrack = function (event, properties = '') {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.track(event, properties);
};

export const checkUtm = function () {
  const data = getUrlData();
  const utm = { utm_source: data.utm_source, utm_content: data.utm_content };
  if (!utm.utm_source) utm.utm_source = null;
  if (!utm.utm_content) utm.utm_content = null;
  return utm;
};
