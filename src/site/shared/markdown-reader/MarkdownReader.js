'use strict';

import { Component } from '../../../core/component';
import html from './MarkdownReader.html';
import css from './MarkdownReader.css';

import { MarkdownToHTML } from '../../../utils/MarkdownParser';

export class MarkdownReader extends Component {
  static get observedAttributes() {
    return ['md'];
  }

  constructor() {
    super(html, [css]);
  }

  onAttributeChange(newAttrs) {
    const { md } = newAttrs;
    if (md) {
      this._setBody();
      this._body.innerHTML = MarkdownToHTML(md);
      // Clean attribute
      setTimeout(() => this.setAttribute('md', ''));
    }
  }

  _setBody() {
    if (!this._body) {
      this._body = this.root.querySelector('.markdown');
    }
  }
}

customElements.define('markdown-reader', MarkdownReader);
