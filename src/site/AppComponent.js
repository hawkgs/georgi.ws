'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import '../core/router';
import '../utils/Themes';

import './shared/interactive-logo/InteractiveLogo';
import './projects/Projects';
import './stack/Stack';
import './timeline/Timeline';
import './about/About';

import { DOM } from '../utils/DOM';
import { getInjector, ROUTING_SERVICE } from '../di';

const DEFAULT_TITLE = 'georgi.ws';
const RouteToTitleMap = {
  '/': DEFAULT_TITLE,
  '/projects': `${DEFAULT_TITLE} / Projects`,
  '/stack': `${DEFAULT_TITLE} / Stack`,
  '/timeline': `${DEFAULT_TITLE} / Timeline`,
  '/about': `${DEFAULT_TITLE} / About`
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
      this._mobileNavHandler();
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
      const title = RouteToTitleMap[url] || DEFAULT_TITLE;
      document.title = title;
    };

    routingService.listen(updateTitle);
    updateTitle(routingService.path);
  }

  _copyrightYear() {
    this.root.querySelector('.copy').innerHTML = new Date().getFullYear();
  }

  _mobileNavHandler() {
    const nav = this.root.querySelector('nav');
    let clickFlag = false;

    this.root.querySelector('.mobile-nav-btn').addEventListener('click', () => {
      if (!DOM.hasClass(nav, 'visible')) {
        clickFlag = true;
      }
      DOM.addClasses(nav, 'visible');
      document.body.style.overflow = 'hidden';
    });

    document.addEventListener('click', () => {
      if (clickFlag) {
        clickFlag = false;
      } else {
        DOM.removeClasses(nav, 'visible');
        document.body.style.overflow = 'auto';
      }
    });
  }
}

customElements.define('app-cmp', AppComponent);
