'use strict';

import { Component } from '../component/Component';
import { RoutingService } from './RoutingService';

export class Router extends Component {
  constructor() {
    super('<!--{children}-->');

    this._routingService = new RoutingService();
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

  get routingService() {
    return this._routingService;
  }

  onComponentDetach() {
    window.removeEventListener('popstate', this._popStateCb);
  }

  _listenForRouteChanges() {
    window.addEventListener('popstate', this._popStateCb = () => {
      this._loadRoute();
    });
  }

  _loadRoute() {
    const loc = window.location;
    const route = loc.href.replace(loc.origin + '/#', '');
    this._renderRoute(route);
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
