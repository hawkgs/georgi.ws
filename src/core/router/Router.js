'use strict';

import { Component } from '../component';
import { Route } from './Route';
import { NotFoundRedirect } from './NotFoundRedirect';
import { getInjector, ROUTING_SERVICE } from '../../di';
import { Routing } from './Routing';

import animations from './animations/animations.css';
import { animateFadeIn } from './animations/Animate';

let instantiated = false;

export class Router extends Component {
  constructor() {
    super('<!--{children}-->');

    this._handleInstance();

    const injector = getInjector();
    this._routingService = injector.createInstanceOf(ROUTING_SERVICE, [this._loadRoute.bind(this)]);
    injector.addInstanceOf(ROUTING_SERVICE, this._routingService);
  }

  onComponentAttach() {
    this._getRoutes();
    this._prepareTemplate();
    this._listenForRouteChanges();
    this._loadRoute();
  }

  onComponentDetach() {
    this._routeListener();
  }

  _listenForRouteChanges() {
    this._routeListener = this._routingService.listen((_, routing) => {
      if (routing === Routing.PopState) {
        this._loadRoute();
      }
    });
  }

  _loadRoute() {
    const route = this._routingService.path;

    if (this._routes.get(route)) {
      this._renderRoute(route);
    } else {
      this._render.innerHTML = '';
      this._routingService.push(this._notFoundRedirectUrl);
    }
  }

  _renderRoute(route) {
    const routeComponent = this._routes.get(route);
    this._render.innerHTML = '';

    if (routeComponent) {
      const component = document.createElement(routeComponent);

      this._animate(component);
      this._render.appendChild(component);
    }
  }

  _animate(component) {
    animateFadeIn(component);
  }

  _getRoutes() {
    this._routes = new Map();

    [].slice.call(this.root.children).forEach(r => {
      if (r instanceof Route) {
        this._routes.set(r.data.url, r.data.component);
      }
      if (r instanceof NotFoundRedirect) {
        this._notFoundRedirectUrl = r.data.url;
      }
    });
  }

  _prepareTemplate() {
    this.root.innerHTML = '';

    const animationStyles = document.createElement('style');
    animationStyles.innerHTML = animations;
    this.root.appendChild(animationStyles);

    this._render = document.createElement('div');
    this.root.appendChild(this._render);
  }

  _handleInstance() {
    if (instantiated) {
      throw new Error('Router: The router already has an instance in the app.');
    }
    instantiated = true;
  }
}

customElements.define('app-router', Router);
