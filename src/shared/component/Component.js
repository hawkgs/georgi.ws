'use strict';

import { getStateManager } from '../../state/State';

export class Component extends HTMLElement {
  constructor(html, css) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    html = html.replace(/{{\s*children\s*}}/, this.innerHTML);
    template.innerHTML = `<style>${css}</style>${html}`;
    shadow.appendChild(template.content.cloneNode(true));
    this.innerHTML = '';

    // Not sure if this is a good idea
    this._attr = {};
    this._name = this.constructor.name;
    this._stateManager = getStateManager();
    this._stateManager.setInitialState(this._name);
    this._loadAttributeValues();
  }

  get state() {
    return this._stateManager.state[this._name];
  }

  get attr() {
    return this._attr;
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

  attributeChangedCallback(attr, oldValue, newValue) {
    const newAttrs = JSON.parse(JSON.stringify(this._attr));
    newAttrs[attr] = newValue;

    if (this.onAttributeChange) {
      this.onAttributeChange(newAttrs);
    }
    this._attr = newAttrs;
  }

  connectedCallback() {
    this._stateManager.subscribe(this._name, this.onStateUpdate);

    if (this.onComponentAttach) {
      this.onComponentAttach();
    }
  }

  disconnectedCallback() {
    this._stateManager.unsubscribe(this._name);

    if (this.onComponentDetach) {
      this.onComponentDetach();
    }
  }

  _loadAttributeValues() {
    [].slice.call(this.attributes).map((a) => {
      this._attr[a.name] = a.value;
    });
  }
}
