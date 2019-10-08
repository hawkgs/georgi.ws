'use strict';

import { Component } from '../../../core/component';
import css from './Switch.css';

export class Switch extends Component {
  constructor() {
    super('<div class="switch"></div>', [css]);
  }

  onComponentAttach() {
    const switchCont = this.root.querySelector('.switch');

    switchCont.addEventListener('click', () => {
      switchCont.classList.toggle('on');
    });
  }
}

customElements.define('switch-cmp', Switch);
