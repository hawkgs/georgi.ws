'use strict';

import { Component } from '../../core/component';
import html from './Stack.html';
import css from './Stack.css';

import './shared/technology/Technology';

export class Stack extends Component {
  constructor() {
    super(html, css);
  }
}

customElements.define('page-stack', Stack);
