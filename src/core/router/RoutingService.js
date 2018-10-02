'use strict';

export class RoutingService {
  constructor(loadRoute) {
    this._loadRoute = loadRoute;
    this._listeners = [];
  }

  get path() {
    if (!this._route) {
      this._route = document.location.href.split('#')[1];
    }
    return this._route;
  }

  push(url, pageTitle) {
    const route = `/#${url}`;
    const fullUrl = `${window.location.protocol}//${window.location.host}${route}`;

    if (window.location.href === fullUrl) {
      return;
    }

    this._route = route;
    window.history.pushState({}, pageTitle, route);
    this._loadRoute();
    this._listeners.forEach(cb => cb(url));
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
    }
  }
}
