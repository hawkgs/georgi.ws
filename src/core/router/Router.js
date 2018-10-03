'use strict';

import { Component } from '../component';
import { RoutingService } from './RoutingService';
import { getInjector, ROUTING_SERVICE } from '../../di';

let instantiated = false;

export class Router extends Component {
  constructor() {
    super('<!--{children}-->');

    if (instantiated) {
      throw new Error('Router: The router already has an instance in the app.');
    }
    instantiated = true;

    this._routingService = new RoutingService(this._loadRoute.bind(this));
    getInjector().addInstanceOf(ROUTING_SERVICE, this._routingService);

    this._routes = [];

    [].slice.call(this.shadowRoot.children).forEach(r => {
      this._routes.push(r.data);
    });
    this.shadowRoot.innerHTML = '';

    this._render = document.createElement('div');
    this.shadowRoot.appendChild(this._render);
    this._listenForRouteChanges();
    this._loadRoute();
  }

  onComponentDetach() {
    this._routeListener();
  }

  _listenForRouteChanges() {
    this._routeListener = this._routingService.listen(() => {
      this._loadRoute();
    });
  }

  _loadRoute() {
    this._renderRoute(this._routingService.path);
  }

  _renderRoute(route) {
    const routeComponent = this._routes.find(r => r.url === route);

    if (routeComponent) {
      let name = routeComponent.component;
      this._render.innerHTML = '';

      const component = document.createElement(name);
      this._render.appendChild(component);
    }
  }
}

customElements.define('app-router', Router);
