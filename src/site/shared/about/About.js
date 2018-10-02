'use strict';

import { Component } from '../../../core/component';
import css from './About.css';
import md from './about.markdown';

import '../markdown-reader/MarkdownReader';

export class About extends Component {
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

customElements.define('page-about', About);
