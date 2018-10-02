'use strict';

import { Component } from '../../../core/component';
import css from './Projects.css';
import md from './projects.markdown';

import '../markdown-reader/MarkdownReader';

export class Projects extends Component {
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

customElements.define('page-projects', Projects);
