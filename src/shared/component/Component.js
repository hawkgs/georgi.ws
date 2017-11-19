'use strict';

import { getStateManager } from '../../state/State';

export class Component extends HTMLElement {
  constructor(html, css) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${css}</style>${html}`;

    // Not sure if this is a good idea
    this._name = this.constructor.name;
    this._stateManager = getStateManager();
    this._stateManager.setInitialState(this._name, this);
  }

  get state() {
    return this._stateManager.state[this._name];
  }

  setState(state) {
    if (!state || JSON.stringify(state) === '{}') {
      console.warn(`${this._name}: Empty state`);
      return;
    }

    const component = state.component;
    let cmpName = this._name;

    if (component && typeof component === 'string') {
      cmpName = component;
    } else if (component) {
      cmpName = component.constructor.name;
    }

    if (state && cmpName && state.type) {
      this._stateManager.updateState(cmpName, state.type);
    }
  }
}
