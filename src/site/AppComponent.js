'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import '../core/router';

import './projects/Projects';
import './stack/Stack';
import './timeline/Timeline';
import './about/About';

import { DOM } from '../utils/DOM';
import { getInjector, ROUTING_SERVICE } from '../di';

export class AppComponent extends Component {
  constructor() {
    super(html, css);
  }

  onComponentAttach() {
    this._updateSelectedLink();
  }

  _updateSelectedLink() {
    getInjector().subscribe(ROUTING_SERVICE, (routingService) => {
      const links = [].slice.call(this.shadowRoot.querySelectorAll('app-link'));

      const updateLinks = (url) => {
        links.forEach(l => {
          if (l.attr.url === url) {
            DOM.addClasses(l, 'selected');
          } else {
            DOM.removeClasses(l, 'selected');
          }
        });
      };

      routingService.listen(updateLinks);
      updateLinks(routingService.path);
    });
  }
}

customElements.define('app-cmp', AppComponent);
