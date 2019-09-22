'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import '../core/router';

import './shared/interactive-logo/InteractiveLogo';
import './projects/Projects';
import './stack/Stack';
import './articles/Articles';
import './timeline/Timeline';
import './about/About';

import { DOM } from '../utils/DOM';
import { getInjector, ROUTING_SERVICE } from '../di';
import { DARK_THEME, LIGHT_THEME, setTheme } from '../utils/Themes';
import { Storage, DARK_THEME_KEY } from '../utils/Storage';

const DEFAULT_TITLE = 'georgi.ws';
const RouteToTitleMap = {
  '/': `${DEFAULT_TITLE} / Georgi Serev`,
  '/p/projects': `${DEFAULT_TITLE} / Projects`,
  '/p/stack': `${DEFAULT_TITLE} / Stack`,
  '/p/timeline': `${DEFAULT_TITLE} / Timeline`,
  '/p/about': `${DEFAULT_TITLE} / About`
};

export default class AppComponent extends Component {
  constructor() {
    super(html, [css]);
  }

  onComponentAttach() {
    this._copyrightYear();
    this._manageThemes();
    this._mobileNavHandler();
    this._content = this.root.querySelector('.content');

    getInjector().subscribe(ROUTING_SERVICE, (routingService) => {
      this._updateHeaderUI(routingService);
      this._updateTitle(routingService);
      this._scrollToTop(routingService);
    });
  }

  _updateHeaderUI(routingService) {
    const links = [].slice.call(this.root.querySelectorAll('app-link'));

    const updateHeaderUI = (url) => {
      if (routingService.path === '/') {
        DOM.addClass(this._content, 'home');
      } else {
        DOM.removeClass(this._content, 'home');
      }

      links.forEach(l => {
        if (l.attr.url === url) {
          DOM.addClass(l, 'selected');
        } else {
          DOM.removeClass(l, 'selected');
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
      DOM.addClass(nav, 'visible');
      document.body.style.overflow = 'hidden';
    });

    document.addEventListener('click', () => {
      if (clickFlag) {
        clickFlag = false;
      } else {
        DOM.removeClass(nav, 'visible');
        document.body.style.overflow = 'auto';
      }
    });
  }

  _scrollToTop(routingService) {
    routingService.listen(() => window.scrollTo(0, 0));
  }

  _manageThemes() {
    const darkModeBtn = this.root.querySelector('.dark-mode');
    const osPreferredDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = Storage.get(DARK_THEME_KEY);
    let darkMode = storedTheme !== null ? storedTheme : osPreferredDarkMode || false;

    const setDarkTheme = () => {
      setTheme(DARK_THEME);
      DOM.addClass(darkModeBtn, 'activated');
      darkModeBtn.title = 'Light mode';
    };

    if (darkMode) {
      setDarkTheme();
    }

    darkModeBtn.addEventListener('click', () => {
      if (darkMode) {
        setTheme(LIGHT_THEME);
        DOM.removeClass(darkModeBtn, 'activated');
        darkModeBtn.title = 'Dark mode';
      } else {
        setDarkTheme();
      }
      darkMode = !darkMode;
      Storage.set(DARK_THEME_KEY, darkMode);
    });
  }
}

customElements.define('app-cmp', AppComponent);
