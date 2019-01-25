'use strict';

import { Component, DOMType } from '../../../../core/component';
import html from './Event.html';
import css from './Event.css';

export class Event extends Component {
  static get observedAttributes() {
    return ['name', 'time', 'description'];
  }

  constructor() {
    super(html, [css], null, DOMType.Standard);
  }

  onComponentAttach() {
    this.root.querySelector('.name').innerHTML = this.attr.name || 'N/A';
    this.root.querySelector('.time').innerHTML = this.attr.time || new Date().getFullYear();
    this.root.querySelector('.description').innerHTML = this.attr.description || '';
  }
}

customElements.define('event-cmp', Event);
