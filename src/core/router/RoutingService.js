'use strict';

import { Routing, RoutingStrategyType } from './common';

export class RoutingService {
  constructor(loadRoute, routingStrategy) {
    this._loadRoute = loadRoute;
    this._listeners = [];
    this._routingStrategy = routingStrategy !== undefined ? routingStrategy : RoutingStrategyType.HashBased;
    this._popStateListener();
  }

  get path() {
    if (this._routingStrategy === RoutingStrategyType.HashBased) {
      return document.location.href.split('#')[1] || '/';
    }
    return document.location.pathname;
  }

  push(url, pageTitle) {
    const route = `${this._routingStrategy}${url}`;
    const fullUrl = `${window.location.protocol}//${window.location.host}${route}`;

    if (window.location.href === fullUrl) {
      return;
    }

    this._route = route;
    window.history.pushState({}, pageTitle, route);
    this._loadRoute();
    this._listeners.forEach(cb => cb(this.path, Routing.Push));
  }

  back() {
    window.history.back();
    this._loadRoute();
  }

  forward() {
    window.history.forward();
    this._loadRoute();
  }

  listen(cb) {
    this._listeners.push(cb);

    return () => {
      const idx = this._listeners.indexOf(cb);
      if (idx > -1) {
        this._listeners.splice(idx, 1);
      } else {
        console.error('RoutingService: Could not remove listener.');
      }
    };
  }

  _popStateListener() {
    window.onpopstate = () => {
      this._listeners.forEach(cb => cb(this.path, Routing.PopState));
    };
  }
}
