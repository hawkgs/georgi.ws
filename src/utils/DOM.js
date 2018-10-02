'use strict';

export const DOM = {
  addClasses: (element, classes) => {
    if (!DOM.hasClass(element, classes)) {
      element.className += ` ${classes}`;
    }
  },
  removeClasses: (element, classes) => {
    if (DOM.hasClass(element, classes)) {
      element.className = element.className.replace(classes, '').trim();
    }
  },
  hasClass: (element, className) => {
    return element.className.indexOf(className) > -1;
  }
};
