'use strict';

import { Component } from './shared/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import './site/RandomComponent';
import './shared/router/index';

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
  }
}

customElements.define('app-cmp', AppComponent);
