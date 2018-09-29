'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import './RandomComponent';
import './shared/markdown-reader/MarkdownReader';
import '../core/router';

import test from './test.markdown';

export const AppComponentState = {
  Loaded: 'Loaded',
  Error: 'Error'
};

export class AppComponent extends Component {
  constructor() {
    super(html, css);

    setTimeout(() => {
      this.setState({
        type: AppComponentState.Loaded
      });
    }, 3000);
  }

  onStateUpdate(state) {
    console.log('State updated to', state);
  }

  onComponentAttach() {
    const random = this.shadowRoot.querySelector('random-cmp');
    setTimeout(() => {
      random.setAttribute('ivan', 'milko');
    }, 3000);

    // markdown
    const mdReader = this.shadowRoot.querySelector('markdown-reader');
    mdReader.setAttribute('md', test);
  }
}

customElements.define('app-cmp', AppComponent);
