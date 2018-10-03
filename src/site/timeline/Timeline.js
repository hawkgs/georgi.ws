'use strict';

import { Component } from '../../core/component';
import html from './Timeline.html';
import css from './Timeline.css';

export class Timeline extends Component {
  constructor() {
    super(html, css);
  }
}

customElements.define('page-timeline', Timeline);
