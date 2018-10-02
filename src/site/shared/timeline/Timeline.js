'use strict';

import { Component } from '../../../core/component';
import css from './Timeline.css';
import md from './timeline.markdown';

import '../markdown-reader/MarkdownReader';

export class Timeline extends Component {
  constructor() {
    super(
      '<markdown-reader></markdown-reader>',
      css
    );
  }

  onComponentAttach() {
    const reader = this.shadowRoot.querySelector('markdown-reader');
    reader.setAttribute('md', md);
  }
}

customElements.define('page-timeline', Timeline);
