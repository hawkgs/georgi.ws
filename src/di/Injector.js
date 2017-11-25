'use strict';

import { InitialDeps } from './Deps';

class Injector {
  constructor() {
    this._deps = InitialDeps;
    this._subscribers = [];
  }

  addDependency(name, instance) {
    this._deps[name] = instance;

    this._subscribers
      .filter(s => s.name === name)
      .forEach(s => s.cb(instance));
  }

  getDependency(name) {
    return this._deps[name];
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
