'use strict';

import { Component } from '../../../../core/component';
import html from './Scrollbar.html';
import css from './Scrollbar.css';

import { DOM } from '../../../../utils/DOM';
import { BufferedSingleListener } from '../../../../utils/BufferedSingleListener';

const perc = (part, total) => Math.round((part / total) * 100);

// Windows-Only. Doesn't handle window resize
export class Scrollbar extends Component {
  static get observedAttributes() {
    return ['top', 'bottom', 'showonhover'];
  }

  constructor() {
    super(html, [css]);

    this._wrapperPromise = new Promise((res) => this._wrapperResolver = res);
    this._scrollerPromise = new Promise((res) => this._scrollerResolver = res);
    this._attrsListener = new BufferedSingleListener();
  }

  onComponentAttach() {
    this._scrollbar = this.root.querySelector('.scrollbar');
    if (!/windows/.test(navigator.userAgent.toLocaleLowerCase())) {
      DOM.addClass(this._scrollbar, 'hide');
      return;
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
    this._attrsListener.update(newAttrs);
  }

  observeElement(el) {
    this._detachListeners();

    this._scrollerPromise.then((scroller) => {
      this._scrolling(el, scroller);
      this._showOnHover(el, scroller);
    });
  }

  _detachListeners() {
    document.removeEventListener('mousemove', this._docMouseMove);
    document.removeEventListener('mouseup', this._docMouseUp);
  }

  _scrolling(el, scroller) {
    const scrollerSize = perc(el.offsetHeight, el.scrollHeight);
    scroller.style.height = scrollerSize + '%';

    el.addEventListener('scroll', () => {
      const scroll = perc(el.scrollTop, el.scrollHeight);
      scroller.style.top = scroll + '%';
    });

    let startScroll = 0;
    let startY = 0;
    let lock = false;

    scroller.onmousedown = (e) => {
      startScroll = el.scrollTop;
      startY = e.pageY;
      lock = true;

      DOM.addClass(this._scrollbar, 'active');
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
      DOM.removeClass(this._scrollbar, 'active');
    };

    document.addEventListener('mousemove', this._docMouseMove);
    document.addEventListener('mouseup', this._docMouseUp);
  }

  _showOnHover(el, scroller) {
    this._attrsListener.subscribe((attrs) => {
      if (attrs.showonhover === 'true') {
        DOM.addClass(scroller, 'show-on-scroll');
        el.addEventListener('mouseenter', () => DOM.addClass(scroller, 'show'));
        el.addEventListener('mouseleave', () => DOM.removeClass(scroller, 'show'));
      }
    });
  }
}

customElements.define('scrollbar-cmp', Scrollbar);
