'use strict';

import { Component } from '../shared/component';
import html from './RandomComponent.html';

export class RandomComponent extends Component {
  static get observedAttributes() {
    return ['ivan'];
  }

  constructor() {
    super(html, null);
    console.log(this.attr);
  }

  onAttributeChange(newAttrs) {
    console.log(newAttrs);
  }
}

customElements.define('random-cmp', RandomComponent);
