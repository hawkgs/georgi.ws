'use strict';

import { Component } from '../../../../core/component/Component';
import html from './Technology.html';
import css from './Technology.html';

export class Technology extends Component {
  constructor() {
    super(html, [css]);
  }
}

customElements.define('tech-item', Technology);
