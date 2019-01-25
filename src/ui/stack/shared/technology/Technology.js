'use strict';

import { Component } from '../../../../core/component/Component';
import html from './Technology.html';
import css from './Technology.css';

export class Technology extends Component {
  static get observedAttributes() {
    return ['name'];
  }

  constructor() {
    super(html, [css]);
  }

  onComponentAttach() {
    this.root.querySelector('.tooltip').innerHTML = this.attr.name || 'N/A';
  }
}

customElements.define('technology-cmp', Technology);
