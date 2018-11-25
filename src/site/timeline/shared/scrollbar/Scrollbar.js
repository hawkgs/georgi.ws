'use strict';

import { Component } from '../../../../core/component';
import html from './Scrollbar.html';
import css from './Scrollbar.css';

import { DOM } from '../../../../utils/DOM';

const perc = (part, total) => Math.round((part / total) * 100);

// Windows-Only
export class Scrollbar extends Component {
  static get observedAttributes() {
    return ['top', 'bottom'];
  }

  constructor() {
    super(html, [css]);

    this._wrapperPromise = new Promise((res) => this._wrapperResolver = res);
    this._scrollerPromise = new Promise((res) => this._scrollerResolver = res);
  }

  onComponentAttach() {
    this._scrollbar = this.root.querySelector('.scrollbar');
    if (!/windows/.test(navigator.userAgent.toLocaleLowerCase())) {
      DOM.addClasses(this._scrollbar, 'hide');
    }

    const wrapper = this.root.querySelector('.wrapper');
    this._wrapperResolver(wrapper);

    const scroller = this.root.querySelector('.scroller');
    this._scrollerResolver(scroller);
  }

  onComponentDetach() {
    this._detachListeners();
  }

  onAttributeChange(newAttrs) {
    this._wrapperPromise.then((wrapper) => {
      const { top, bottom } = newAttrs;
      if (top) {
        wrapper.style.top = top + 'px';
      }
      if (bottom) {
        wrapper.style.bottom = bottom + 'px';
      }
    });
  }

  observeElement(el) {
    this._detachListeners();

    this._scrollerPromise.then((scroller) => {
      const scrollerSize = perc(el.offsetHeight, el.scrollHeight);
      scroller.style.height = scrollerSize + '%';

      el.onscroll = () => {
        const scroll = perc(el.scrollTop, el.scrollHeight);
        scroller.style.top = scroll + '%';
      };

      let startScroll = 0;
      let startY = 0;
      let lock = false;

      scroller.onmousedown = (e) => {
        startScroll = el.scrollTop;
        startY = e.pageY;
        lock = true;

        DOM.addClasses(this._scrollbar, 'active');
      };

      this._docMouseMove = (e) => {
        if (!lock) {
          return;
        }
        const offset = e.pageY - startY;
        const ratio = offset / el.offsetHeight;

        el.scrollTop = startScroll + el.scrollHeight * ratio;
      };

      this._docMouseUp = () => {
        lock = false;
        DOM.removeClasses(this._scrollbar, 'active');
      };

      document.addEventListener('mousemove', this._docMouseMove);
      document.addEventListener('mouseup', this._docMouseUp);
    });
  }

  _detachListeners() {
    document.removeEventListener('mousemove', this._docMouseMove);
    document.removeEventListener('mouseup', this._docMouseUp);
  }
}

customElements.define('scrollbar-cmp', Scrollbar);
