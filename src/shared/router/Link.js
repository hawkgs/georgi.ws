'use strict';

import { Component } from '../component/index';

export class Link extends Component {
  constructor() {
    super('<span class="link"><!--{children}--></span>', null);

    if (!this.attr.url) {
      console.error('Link: The URL is not specified');
    }
  }

  onComponentAttach() {
    const link = this.shadowRoot.children[0];

    link.addEventListener('click', () => {
      window.history.pushState({}, 'Title', `/#${this.attr.url}`);
    });
  }
}

customElements.define('app-link', Link);
