'use strict';

export class Stack {
  constructor() {
    this._arr = [];
  }

  push(value) {
    this._arr.push(value);
  }

  pop() {
    return this._arr.pop();
  }
}
