'use strict';

import { Component } from '../../core/component';
import html from './Timeline.html';
import css from './Timeline.css';
import common from '../shared/common.css';

import './shared/event/Event';

export class Timeline extends Component {
  constructor() {
    super(html, [css, common]);
  }
}

customElements.define('page-timeline', Timeline);
