'use strict';

import { Component } from '../../../core/component/Component';
import html from './InteractiveLogo.html';
import css from './InteractiveLogo.css';

export class InteractiveLogo extends Component {
  constructor() {
    super(html, css);
  }
}

customElements.define('interactive-logo', InteractiveLogo);
