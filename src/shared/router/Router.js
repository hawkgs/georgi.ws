'use strict';

import { Component } from '../component/Component';

export class Router extends Component {
  constructor() {
    super('<!--{children}-->');

    this._routes = [];
    [].slice.call(this.shadowRoot.children).forEach(r => {
      this._routes.push(r.data);
    });
    this.shadowRoot.innerHTML = '';

    this._render = document.createElement('div');
    this.shadowRoot.appendChild(this._render);

    const loc = window.location;
    const route = loc.href.replace(loc.origin + '/#', '');
    this._renderRoute(route);
  }

  _renderRoute(route) {
    const componentName = this._routes.find(r => r.url === route).component;

    if (componentName) {
      this._render.innerHTML = '';

      const component = document.createElement(componentName);
      this._render.appendChild(component);
    }
  }
}

customElements.define('app-router', Router);
