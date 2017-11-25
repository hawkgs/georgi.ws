'use strict';

import { Component } from '../component';
import { getInjector, ROUTING_SERVICE } from '../../di';

export class Link extends Component {
  constructor() {
    super('<span class="link"><!--{children}--></span>', null);

    this._injector = getInjector();
    this._routingService = null;

    if (!this.attr.url) {
      console.error('Link: The URL is not specified');
    }
  }

  onComponentAttach() {
    const link = this.shadowRoot.children[0];

    link.addEventListener('click', () => {
      window.history.pushState({}, 'Title', `/#${this.attr.url}`);

      if (this._routingService) {
        // do
      }
    });

    this._injector.subscribe(ROUTING_SERVICE, this._diCb = (i) => {
      this._routingService = i;
    });
  }

  onComponentDetach() {
    this._injector.unsubscribe(this._diCb);
  }
}

customElements.define('app-link', Link);
