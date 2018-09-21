'use strict';

export class Construct {
  constructor(type) {
    this._type = type;
    this._closed = false;
  }

  get type() {
    return this._type;
  }

  close() {
    this._closed = true;
  }

  isClosed() {
    return this._closed;
  }
}
