'use strict';

import { Component } from '../shared/component';
import html from './RandomComponent.html';

const RandomComponentState = {
  Default: 'Default',
  Loading: 'Loading'
};

export class RandomComponent extends Component {
  static get observedAttributes() {
    return ['ivan'];
  }

  constructor() {
    super(html, null, RandomComponentState.Default);

    setTimeout(() => {
      this.setState({ type: RandomComponentState.Loading });
    }, 2000);

    setTimeout(() => {
      this.setState({ type: RandomComponentState.Default });
    }, 6000);

    console.log(this.attr);
  }

  onAttributeChange(newAttrs) {
    console.log(newAttrs);
  }
}

customElements.define('random-cmp', RandomComponent);
