'use strict';

import './AppComponent.css';
const template = require('./AppComponent.html');

export class AppComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = template;
  }
}

customElements.define('app-cmp', AppComponent);
