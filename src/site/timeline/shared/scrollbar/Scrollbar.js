'use strict';

import { Component } from '../../../../core/component';
import html from './Scrollbar.html';
import css from './Scrollbar.css';

const perc = (pos, height) => Math.round((pos / height) * 100);

export class Scrollbar extends Component {
  constructor() {
    super(html, [css]);

    this._scrollerPromise = new Promise((res) => this._scrollerResolver = res);
  }

  onComponentAttach() {
    const scroller = this.root.querySelector('.scroller');
    this._scrollerResolver(scroller);
  }

  onComponentDetach() {
    document.removeEventListener('mousemove', this._docMouseMove);
    document.removeEventListener('mouseup', this._docMouseUp);
    console.log('remove');
  }

  observeElement(el) {
    this._scrollerPromise.then((scroller) => {
      const scrollerSize = perc(el.offsetHeight, el.scrollHeight);
      scroller.style.height = scrollerSize + '%';

      el.addEventListener('scroll', () => {
        const scroll = perc(el.scrollTop, el.scrollHeight);
        scroller.style.top = scroll + '%';
      });

      let start = 0;
      let lock = false;

      scroller.addEventListener('mousedown', (e) => {
        start = e.pageY;
        lock = true;
      });

      document.addEventListener('mousemove', this._docMouseMove = (e) => {
        if (!lock) {
          return;
        }
        const offset = e.pageY - start;
        const ratio = offset / el.offsetHeight;

        el.scrollTop = el.scrollHeight * ratio;
      });

      document.addEventListener('mouseup', this._docMouseUp = () => {
        lock = false;
      });
    });
  }
}

customElements.define('scrollbar-cmp', Scrollbar);
