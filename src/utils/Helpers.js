'use strict';

export const uuid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return `${s4()}${s4()}${s4()}${s4()}`;
};

export const random = (min, max) => Math.random() * (max - min) + min;
