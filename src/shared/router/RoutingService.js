'use strict';

export class RoutingService {
  constructor(loadRoute) {
    this._loadRoute = loadRoute;
  }

  push(url, pageTitle) {
    const route = `/#${url}`;
    const fullUrl = `${window.location.protocol}//${window.location.host}${route}`;

    if (window.location.href === fullUrl) {
      return;
    }

    window.history.pushState({}, pageTitle, route);
    this._loadRoute();
  }

  back() {
    window.history.back();
    this._loadRoute();
  }

  forward() {
    window.history.forward();
    this._loadRoute();
  }
}
