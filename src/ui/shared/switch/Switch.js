'use strict';

import { Component } from '../../../core/component';
import css from './Switch.css';

export class Switch extends Component {
  constructor() {
    super('<div class="switch"></div>', [css]);
    this._on = false;
  }

  onComponentAttach() {
    const switchCont = this.root.querySelector('.switch');

    switchCont.addEventListener('click', () => {
      this._on = !this._on;
      switchCont.classList.toggle('on');

      const event = new CustomEvent('change', {
        detail: { on: this._on }
      });
      this.dispatchEvent(event);
    });
  }
}

customElements.define('switch-cmp', Switch);
