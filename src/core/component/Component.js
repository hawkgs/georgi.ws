'use strict';

import { getStateManager } from '../../state/State';
import { uuid } from '../../utils/Helpers';

export class Component extends HTMLElement {
  constructor(html, css, initialState) {
    super();

    this._name = this.constructor.name;
    this._stateManager = getStateManager();
    this._stateManager.setInitialState(this._name, initialState);

    this._templateUuids = {};
    this._stateTemplates = {};

    const shadow = this.attachShadow({ mode: 'open' });
    this._template = this._createTemplate(html, css);
    shadow.appendChild(this._template.content.cloneNode(true));
    this._gatherStateTemplates();
    this._renderTemplate(this.state);
    this.content = this.innerHTML;
    this.innerHTML = '';

    this._attr = {};
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
    this._stateManager.subscribe(this._name, this._onStateUpdateInternal, this);

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

  _createTemplate(html, css) {
    const template = document.createElement('template');

    html = html || '';
    if (html) {
      html = html.replace(/<!--\s*{\s*children\s*}\s*-->/, this.innerHTML);
      html = this._processTemplate(html);
    }

    let styles = '';
    if (css) {
      styles += `<style>${css}</style>`;
    }

    template.innerHTML = styles + html;

    return template;
  }

  _processTemplate(html) {
    let parsedHtml = html;

    const regex = /<!--\s*{\s*if state\s*==\s*([A-Za-z]+)\s*}\s*-->((.|\n|\r\n)*?)<!--\s*{\s*endif\s*}\s*-->/g;
    let matches;

    while ((matches = regex.exec(html)) !== null) {
      const markup = matches[0];
      const state = matches[1];
      let content = matches[2];

      if (!/<[a-z]+>(.|\n|\r\n)*?<\/[a-z]+>/.test(content)) {
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
        const element = this.shadowRoot.querySelector(`[data-eid="${uuid}"]`);

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
