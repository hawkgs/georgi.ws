'use strict';

import { getStateManager } from '../../state/State';
import { uuid } from '../../utils/Helpers';
import { ComponentRef } from './ComponentRef';
import { TemplateProcessor } from './TemplateProcessor';

let loadedStandardStyles = new Set();

export const DOMType = {
  Standard: 'Standard',
  Shadow: 'Shadow'
};

export class Component extends HTMLElement {
  constructor(html, styles, initialState, dom) {
    super();

    this._name = this.constructor.name;
    this._id = uuid();
    this._smEntryName = this._name + '-' + this._id;
    this._stateManager = getStateManager();
    this._stateManager.setInitialState(this._smEntryName, initialState || null);
    this._connectedPromise = new Promise(r => this._connectedResolver = r);
    this._processor = new TemplateProcessor(this);

    this._innerHtml = this.innerHTML;
    this._cleanRawChildren();

    this._html = html;
    this._styles = styles;
    this._domType = dom || DOMType.Shadow;

    this._templateUuids = {};
    this._stateTemplates = {};
    this._attr = {};

    this._createDom(this._domType, html, styles)
      .then(() => {
        this._processor.gatherStateTemplates();
        this._processor.renderTemplate(this.state);
        this._loadAttributeValues();
      })
      .then(() => this._connectedPromise)
      .then(() => {
        if (this.onComponentAttach) {
          this.onComponentAttach();
        }
      });
  }

  get id() {
    return this._id;
  }

  get state() {
    return this._stateManager.state[this._smEntryName];
  }

  get attr() {
    return this._attr;
  }

  get root() {
    switch (this._domType) {
      case DOMType.Shadow:
        return this.shadowRoot;
      case DOMType.Standard:
        return this;
    }
  }

  setState(state) {
    if (!state) {
      console.warn(`${this._name}: Empty state`);
    } else {
      this._stateManager.updateState(this._smEntryName, state);
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
    ComponentRef.set(this);
    this.setAttribute('data-cid', this._id);
    this._stateManager.subscribe(this._smEntryName, this._onStateUpdateInternal, this);

    if (this._domType === DOMType.Standard) {
      const styles = !loadedStandardStyles.has(this._name) ? this._styles : null;
      this.innerHTML = this._generateHtml(this._html, styles);
      loadedStandardStyles.add(this._name);

      this._domReadyResolver();
    }
    this._connectedResolver();
  }

  disconnectedCallback() {
    this._stateManager.unsubscribe(this._smEntryName);
    ComponentRef.remove(this);
    loadedStandardStyles.delete(this._name);

    if (this.onComponentDetach) {
      this.onComponentDetach();
    }
  }

  _onStateUpdateInternal(state) {
    this._processor.renderTemplate(state);

    if (this.onStateUpdate) {
      this.onStateUpdate(state);
    }
  }

  _loadAttributeValues() {
    [].slice.call(this.attributes).map((a) => {
      this._attr[a.name] = a.value;
    });
  }

  _createDom(dom, html, styles) {
    return new Promise((res) => {
      switch (dom) {
        case DOMType.Shadow:
          const template = this._createTemplate(html, styles);
          const shadow = this.attachShadow({ mode: 'open' });
          shadow.appendChild(template.content.cloneNode(true));
          res();
          break;
        case DOMType.Standard:
          this._domReadyResolver = res;
          break;
        default:
          throw new Error('Component: Undefined DOM type.');
      }
    });
  }

  _generateHtml(html, styles) {
    html = html || '';
    if (html) {
      html = html.replace(/<CHILDREN>/, this._innerHtml);
      html = this._processor.processTemplate(html);
    }

    let css = '';
    if (styles && styles instanceof Array && styles.length) {
      styles = styles.reduce((p, c) => p + c, '');
      css += `<style>${styles}</style>`;
    }

    return css + html;
  }

  _createTemplate(html, styles) {
    const template = document.createElement('template');
    template.innerHTML = this._generateHtml(html, styles);

    return template;
  }

  _cleanRawChildren() {
    let child;
    while ((child = this.firstChild)) {
      this.removeChild(child);
    }
  }
}
