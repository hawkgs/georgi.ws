'use strict';

import { Component, DOMType } from '../../../core/component';
import css from './MarkdownReader.css';

import { MarkdownToHTML } from '../../../utils/MarkdownParser';

export class MarkdownReader extends Component {
  static get observedAttributes() {
    return ['md'];
  }

  constructor() {
    super('<div class="markdown"></div>', [css], null, DOMType.Standard);
  }

  onAttributeChange(newAttrs) {
    const { md } = newAttrs;
    if (md) {
      this._setBody();

      new Promise((res) => {
        setTimeout(() => res(MarkdownToHTML(md)));
      }).then((html) => {
        this._body.innerHTML = html;
      });

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
