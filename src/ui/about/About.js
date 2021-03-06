'use strict';

import { Component } from '../../core/component';
import css from './About.css';
import common from '../shared/common.css';
import md from './about.markdown';

import '../shared/markdown-reader/MarkdownReader';

export class About extends Component {
  constructor() {
    super(
      '<markdown-reader></markdown-reader>',
      [css, common]
    );
  }

  onComponentAttach() {
    const reader = this.root.querySelector('markdown-reader');
    reader.setAttribute('md', md);
  }
}

customElements.define('page-about', About);
