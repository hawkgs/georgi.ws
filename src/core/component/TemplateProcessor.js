'use strict';

import { uuid } from '../../utils/Helpers';

export class TemplateProcessor {
  constructor(component) {
    this._cmp = component;
  }

  processTemplate(html) {
    let parsedHtml = html;

    const regex = /<IF state="([A-Za-z]+)">((.|\n|\r\n)*?)<ENDIF>/g;
    let matches;

    while ((matches = regex.exec(html))) {
      const markup = matches[0];
      const state = matches[1];
      let content = matches[2];

      if (!/<[a-z=" ]+>(.|\n|\r\n)*?<\/[a-z]+>/.test(content)) {
        console.error(markup);
        throw new Error(`${this._cmp._name}: The state template should be wrapped in HTML element`);
      }

      const id = uuid();
      content = content.replace('>', ` data-eid="${id}">`);
      parsedHtml = parsedHtml.replace(markup, content);

      if (!this._cmp._templateUuids[state]) {
        this._cmp._templateUuids[state] = [];
      }
      this._cmp._templateUuids[state].push(id);
    }

    return parsedHtml;
  }

  gatherStateTemplates() {
    Object.keys(this._cmp._templateUuids).forEach(s => {
      this._cmp._templateUuids[s].forEach(uuid => {
        const element = this._cmp.root.querySelector(`[data-eid="${uuid}"]`);
        const nodes = element.childNodes;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < nodes.length; i += 1) {
          fragment.appendChild(nodes[i].cloneNode(true));
        }
        this._cleanChildren(element);
        if (!this._cmp._stateTemplates[s]) {
          this._cmp._stateTemplates[s] = [];
        }
        this._cmp._stateTemplates[s].push({ element, fragment });
      });
    });
  }

  renderTemplate(state) {
    const templateForStateExist = !!this._cmp._stateTemplates[state];

    Object.keys(this._cmp._stateTemplates).forEach(s => {
      const elements = this._cmp._stateTemplates[s];

      if (templateForStateExist && state === s) {
        elements.forEach(elObj => {
          this._cleanChildren(elObj.element);
          elObj.element.appendChild(elObj.fragment.cloneNode(true));
        });
      } else {
        elements.forEach(elObj => this._cleanChildren(elObj.element));
      }
    });
  }

  _cleanChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
