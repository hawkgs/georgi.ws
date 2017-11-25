'use strict';

import { Deps } from './Deps';

class Injector {
  constructor() {
    this._instances = {};
    this._subscribers = [];
  }

  getIntanceOf(name, args) {
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
