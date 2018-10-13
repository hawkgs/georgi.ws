'use strict';

const LIGHT_THEME = {
  '--app-background': '#fafafa',
  '--text-color': '#343434',
  '--link-color': '#3687cc',
  '--app-red': '#ea5242',
  '--app-grey': '#8f8f8f',
  '--app-light-grey': '#f1f1f1'
};

const DARK_THEME = {
  '--app-background': '#343434',
  '--text-color': '#fafafa',
  '--link-color': '#53abf6',
  '--app-red': '#ea5242',
  '--app-grey': '#8f8f8f',
  '--app-light-grey': '#3a3a3a'
};

const setTheme = (theme) => {
  Object.keys(theme).forEach((prop) => {
    const value = theme[prop];
    document.documentElement.style.setProperty(prop, value);
  });
};

window.switchToLightTheme = () => setTheme(LIGHT_THEME);
window.switchToDarkTheme = () => setTheme(DARK_THEME);
