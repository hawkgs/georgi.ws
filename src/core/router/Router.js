'use strict';

import { Component } from '../component';
import { Route } from './Route';
import { RoutingService } from './RoutingService';
import { getInjector, ROUTING_SERVICE } from '../../di';

import animations from './animations/animations.css';
import { animateFadeIn } from './animations/Animate';

let instantiated = false;

export class Router extends Component {
  constructor() {
    super('<!--{children}-->');

    this._handleInstance();

    this._routingService = new RoutingService(this._loadRoute.bind(this));
    getInjector().addInstanceOf(ROUTING_SERVICE, this._routingService);

    this._getRoutes();
    this._prepareTemplate();
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
      this._animate(component);
      this._render.appendChild(component);
    }
  }

  _animate(component) {
    animateFadeIn(component);
  }

  _getRoutes() {
    this._routes = [];

    [].slice.call(this.shadowRoot.children).forEach(r => {
      if (r instanceof Route) {
        this._routes.push(r.data);
      }
    });
  }

  _prepareTemplate() {
    this.shadowRoot.innerHTML = '';

    const animationStyles = document.createElement('style');
    animationStyles.innerHTML = animations;
    this.shadowRoot.appendChild(animationStyles);

    this._render = document.createElement('div');
    this.shadowRoot.appendChild(this._render);
  }

  _handleInstance() {
    if (instantiated) {
      throw new Error('Router: The router already has an instance in the app.');
    }
    instantiated = true;
  }
}

customElements.define('app-router', Router);
