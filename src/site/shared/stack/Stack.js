'use strict';

import { Component } from '../../../core/component';
import html from './Stack.html';
import css from './Stack.css';

export class Stack extends Component {
  constructor() {
    super(html, css);
  }
}

customElements.define('page-stack', Stack);
