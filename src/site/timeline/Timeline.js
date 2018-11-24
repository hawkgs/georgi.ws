'use strict';

import { Component, ComponentRef } from '../../core/component';
import html from './Timeline.html';
import css from './Timeline.css';
import common from '../shared/common.css';

import './shared/event/Event';
import './shared/scrollbar/Scrollbar';

export class Timeline extends Component {
  constructor() {
    super(html, [css, common]);
  }

  // onComponentAttach() {
  //   const scrollbar = this.root.querySelector('scrollbar-cmp');
  //   const content = this.root.querySelector('.content');
  //   ComponentRef.get(scrollbar).observeElement(content);
  // }
}

customElements.define('page-timeline', Timeline);
