'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import '../core/router';

import './shared/interactive-logo/InteractiveLogo';
import './projects/Projects';
import './stack/Stack';
import './timeline/Timeline';
import './about/About';

import { DOM } from '../utils/DOM';
import { getInjector, ROUTING_SERVICE } from '../di';

const DefaultTitle = 'georgi.ws';
const RouteToTitleMap = {
  '/': DefaultTitle,
  '/projects': `${DefaultTitle} // Projects`,
  '/stack': `${DefaultTitle} // Stack`,
  '/timeline': `${DefaultTitle} // Timeline`,
  '/about': `${DefaultTitle} // About`
};

export class AppComponent extends Component {
  constructor() {
    super(html, css);
  }

  onComponentAttach() {
    getInjector().subscribe(ROUTING_SERVICE, (routingService) => {
      this._updateSelectedLink(routingService);
      this._updateTitle(routingService);
    });
  }

  _updateSelectedLink(routingService) {
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
  }

  _updateTitle(routingService) {
    const updateTitle = (url) => {
      const title = RouteToTitleMap[url] || DefaultTitle;
      document.title = title;
    };

    routingService.listen(updateTitle);
    updateTitle(routingService.path);
  }
}

customElements.define('app-cmp', AppComponent);
