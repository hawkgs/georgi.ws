'use strict';

export class SingleObserver {
  constructor() {
    this._buffer = [];
  }

  subscribe(cb) {
    this._cb = cb;

    if (this._buffer.length) {
      while (this._buffer.length) {
        this._cb(this._buffer.shift());
      }
    }
  }

  update(data) {
    if (this._cb) {
      this._cb(data);
    } else {
      this._buffer.push(data);
    }
  }
}
