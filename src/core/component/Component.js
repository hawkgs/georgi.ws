'use strict';

import { getStateManager } from '../../state/State';
import { uuid } from '../../utils/Helpers';
import { ComponentRef } from './ComponentRef';

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
    this._stateManager.setInitialState(this._smEntryName, initialState);
    this._connectedPromise = new Promise(r => this._connectedResolver = r);

    ComponentRef.set(this);

    this._html = html;
    this._styles = styles;
    this._domType = dom;

    this._templateUuids = {};
    this._stateTemplates = {};
    this._attr = {};

    this._createDom(dom, html, styles)
      .then(() => {
        this._gatherStateTemplates();
        this._renderTemplate(this.state);
        this._loadAttributeValues();
      })
      .then(this._connectedPromise)
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
      default:
      case DOMType.Shadow:
        return this.shadowRoot;
      case DOMType.Standard:
        return this;
    }
  }

  setState(state) {
    if (!state || JSON.stringify(state) === '{}') {
      console.warn(`${this._name}: Empty state`);
      return;
    }

    if (state && state.type) {
      this._stateManager.updateState(this._smEntryName, state.type);
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
    this._stateManager.subscribe(this._smEntryName, this._onStateUpdateInternal, this);

    if (this._domType === DOMType.Standard) {
      this.innerHTML = this._generateHtml(this._html, this._styles);
      this._domReadyResolver();
    }
    this._connectedResolver();
  }

  disconnectedCallback() {
    this._stateManager.unsubscribe(this._smEntryName);
    ComponentRef.remove(this);

    if (this.onComponentDetach) {
      this.onComponentDetach();
    }
  }

  _onStateUpdateInternal(state) {
    this._renderTemplate(state);

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
        default:
        case DOMType.Shadow:
          const template = this._createTemplate(html, styles);
          const shadow = this.attachShadow({ mode: 'open' });
          shadow.appendChild(template.content.cloneNode(true));
          this.innerHTML = '';
          res();
          break;
        case DOMType.Standard:
          this._domReadyResolver = res;
          break;
      }
    });
  }

  _generateHtml(html, styles) {
    html = html || '';
    if (html) {
      html = html.replace(/<!--\s*{\s*children\s*}\s*-->/, this.innerHTML);
      html = this._processTemplate(html);
    }

    let css = '';
    if (styles && styles instanceof Array) {
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

  _processTemplate(html) {
    let parsedHtml = html;

    const regex = /<!--\s*{\s*if state\s*==\s*([A-Za-z]+)\s*}\s*-->((.|\n|\r\n)*?)<!--\s*{\s*endif\s*}\s*-->/g;
    let matches;

    while ((matches = regex.exec(html))) {
      const markup = matches[0];
      const state = matches[1];
      let content = matches[2];

      if (!/<[a-z=" ]+>(.|\n|\r\n)*?<\/[a-z]+>/.test(content)) {
        console.error(markup);
        throw new Error(`${this._name}: The state template should be wrapped in HTML element`);
      }

      const id = uuid();
      content = content.replace('>', ` data-eid="${id}">`);
      parsedHtml = parsedHtml.replace(markup, content);

      if (!this._templateUuids[state]) {
        this._templateUuids[state] = [];
      }
      this._templateUuids[state].push(id);
    }

    return parsedHtml;
  }

  _gatherStateTemplates() {
    Object.keys(this._templateUuids).forEach(s => {
      this._templateUuids[s].forEach(uuid => {
        const element = this.root.querySelector(`[data-eid="${uuid}"]`);

        if (!this._stateTemplates[s]) {
          this._stateTemplates[s] = [];
        }
        this._stateTemplates[s].push({ element });
      });
    });
  }

  _renderTemplate(state) {
    const templateForStateExist = !!this._stateTemplates[state];

    Object.keys(this._stateTemplates).forEach(s => {
      const elements = this._stateTemplates[s];

      if (templateForStateExist && state === s) {
        elements.forEach(elObj => {
          if (elObj.html) {
            elObj.element.innerHTML = elObj.html;
          }
        });
      } else {
        elements.forEach(elObj => {
          elObj.html = elObj.element.innerHTML;
          elObj.element.innerHTML = '';
        });
      }
    });
  }
}
