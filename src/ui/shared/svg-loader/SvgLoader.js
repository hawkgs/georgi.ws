'use strict';

import { Component } from '../../../core/component';

export class SvgLoader extends Component {
  static get observedAttributes() {
    return ['path'];
  }

  constructor() {
    super('', []);
  }

  onAttributeChange(newAttrs) {
    const { path } = newAttrs;
    if (path) { // jshint ignore:line
      // jshint ignore:start
      import(/* webpackMode: "lazy-once", webpackChunkName: "svgs" */`../../${path}.svg`)
        .then((m) => {
          this.root.innerHTML = m.default;
        });
      // jshint ignore:end
    }
  }
}

customElements.define('svg-loader', SvgLoader);
