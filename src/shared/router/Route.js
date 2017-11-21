'use strict';

import { Component } from '../component/Component';

export class Route extends Component {
  get data() {
    return {
      component: this.attr.component,
      url: this.attr.url
    };
  }
}

customElements.define('app-route', Route);
