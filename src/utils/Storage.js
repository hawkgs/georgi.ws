'use strict';

export const DARK_THEME_KEY = 'dark-theme-key';

export const Storage = { // jshint ignore:line
  get: (key) => {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  },
  set: (key, value) => localStorage.setItem(key, value),
  clear: (key) => localStorage.clearItem(key),
  dump: () => localStorage.clear()
};
