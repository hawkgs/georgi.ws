'use strict';

import { Component } from '../component';

export class NotFoundRedirect extends Component {
  get data() {
    return {
      url: this.attr.url
    };
  }
}

customElements.define('app-not-found-redirect', NotFoundRedirect);
