'use strict';

import css from './AppComponent.css';
import html from './AppComponent.html';

export class AppComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = '<style>' + css + '</style>' + html;
  }
}

customElements.define('app-cmp', AppComponent);
