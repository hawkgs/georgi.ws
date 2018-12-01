'use strict';

const DARK_THEME_BG = '#222222';

export const LIGHT_THEME = {
  '--app-background': '#fafafa',
  '--text-color': '#343434',
  '--link-color': '#3687cc',
  '--app-red': '#ea5242',
  '--app-grey': '#8f8f8f',
  '--app-light-grey': '#f1f1f1'
};

export const DARK_THEME = {
  '--app-background': DARK_THEME_BG,
  '--text-color': '#fafafa',
  '--link-color': '#53abf6',
  '--app-red': '#ea5242',
  '--app-grey': '#8f8f8f',
  '--app-light-grey': '#2a2a2a'
};

let meta;

export const setTheme = (theme) => {
  Object.keys(theme).forEach((prop) => {
    const value = theme[prop];
    document.documentElement.style.setProperty(prop, value);
  });

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  if (theme['--app-background'] === DARK_THEME_BG) {
    meta.setAttribute('content', theme['--app-background']);
  } else {
    meta.setAttribute('content', 'white');
  }
};

window.switchToLightTheme = () => setTheme(LIGHT_THEME);
window.switchToDarkTheme = () => setTheme(DARK_THEME);
