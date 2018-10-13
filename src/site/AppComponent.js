'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import '../core/router';
import '../utils/ThemeService';

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

export default class AppComponent extends Component {
  constructor() {
    super(html, [css]);
  }

  onComponentAttach() {
    this._copyrightYear();
    this._content = this.root.querySelector('.content');

    getInjector().subscribe(ROUTING_SERVICE, (routingService) => {
      this._updateHeaderUI(routingService);
      this._updateTitle(routingService);
    });
  }

  _updateHeaderUI(routingService) {
    const links = [].slice.call(this.root.querySelectorAll('app-link'));

    const updateHeaderUI = (url) => {
      if (routingService.path === '/') {
        DOM.addClasses(this._content, 'home');
      } else {
        DOM.removeClasses(this._content, 'home');
      }

      links.forEach(l => {
        if (l.attr.url === url) {
          DOM.addClasses(l, 'selected');
        } else {
          DOM.removeClasses(l, 'selected');
        }
      });
    };

    routingService.listen(updateHeaderUI);
    updateHeaderUI(routingService.path);
  }

  _updateTitle(routingService) {
    const updateTitle = (url) => {
      const title = RouteToTitleMap[url] || DefaultTitle;
      document.title = title;
    };

    routingService.listen(updateTitle);
    updateTitle(routingService.path);
  }

  _copyrightYear() {
    this.root.querySelector('.copy').innerHTML = new Date().getFullYear();
  }
}

customElements.define('app-cmp', AppComponent);
