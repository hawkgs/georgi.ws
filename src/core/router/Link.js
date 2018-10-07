'use strict';

import { Component, DOMType } from '../component';
import { getInjector, ROUTING_SERVICE } from '../../di';

export class Link extends Component {
  constructor() {
    super('<span class="link"><!--{children}--></span>', null, null, DOMType.Standard);

    this._injector = getInjector();
    this._routingService = null;
  }

  onComponentAttach() {
    if (!this.attr.url) {
      console.error('Link: The URL is not specified');
    }

    const link = this.root.children[0];

    link.addEventListener('click', () => {
      if (this._routingService) {
        this._routingService.push(this.attr.url);
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
