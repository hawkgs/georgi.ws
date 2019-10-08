'use strict';

import { Component } from '../../../core/component';
import css from './Switch.css';

const ON_CLASS = 'on';

export class Switch extends Component {
  static get observedAttributes() {
    return ['on'];
  }

  constructor() {
    super('<div class="switch"></div>', [css]);
    this._on = false;
  }

  onComponentAttach() {
    this._on = this.attr.on === 'true';
    const switchCont = this.root.querySelector('.switch');

    if (this._on) {
      switchCont.classList.add(ON_CLASS);
    }

    switchCont.addEventListener('click', () => {
      this._on = !this._on;

      switchCont.classList.toggle(ON_CLASS);
      this.setAttribute('on', this._on);
      this._emitEvent(this._on);
    });
  }

  _emitEvent(on) {
    const event = new CustomEvent('change', {
      detail: { on }
    });
    this.dispatchEvent(event);
  }
}

customElements.define('switch-cmp', Switch);
