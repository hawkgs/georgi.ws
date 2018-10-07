'use strict';

import { Deps } from './Deps';

class Injector {
  constructor() {
    this._instances = {};
    this._subscribers = [];
  }

  createInstanceOf(name, args) {
    args = args || [];
    return new Deps[name](...args);
  }

  addInstanceOf(name, instance) {
    if (!(instance instanceof Deps[name])) {
      console.error('Not an instance of ' + Deps[name]);
      return;
    }

    this._instances[name] = instance;

    this._subscribers
      .filter(s => s.name === name)
      .forEach(s => s.cb(instance));
  }

  subscribe(name, cb) {
    const instance = this._instances[name];
    if (instance) {
      cb(instance);
    }
    this._subscribers.push({ name, cb });
  }

  unsubscribe(cb) {
    this._subscribers = this._subscribers
      .filter(s => s.cb !== cb);
  }
}

let injector;

export const getInjector = () => {
  if (!injector) {
    injector = new Injector();
  }
  return injector;
};
