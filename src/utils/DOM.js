'use strict';

export const DOM = {
  addClass: (element, className) => {
    element.classList.add(className);
  },
  removeClass: (element, className) => {
    element.classList.remove(className);
  },
  hasClass: (element, className) => {
    return element.classList.contains(className);
  },
  toggleClass: (element, className) => {
    element.classList.toggle(className);
  }
};
