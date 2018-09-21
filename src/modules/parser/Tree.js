'use strict';

export class TreeNode {
  constructor(parent, value) {
    this._parent = parent
    this._value = value;
    this._children = [];
  }

  get value() {
    return this._value;
  }

  get parent() {
    return this._parent;
  }

  get children() {
    return this._children;
  }

  addChild(child) {
    this._children.push(child);
  }
}

export class Tree {
  constructor() {
    this._root = null;
  }

  set root(node) {
    this._root = node;
  }

  clean() {
    this._root = null;
  }
}
