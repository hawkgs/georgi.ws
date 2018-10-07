'use strict';

import { uuid } from '../../utils/Helpers';

export class TemplateProcessor {
  constructor(component) {
    this._cmp = component;
  }

  processTemplate(html) {
    let parsedHtml = html;

    const regex = /<!--\s*{\s*if state\s*==\s*([A-Za-z]+)\s*}\s*-->((.|\n|\r\n)*?)<!--\s*{\s*endif\s*}\s*-->/g;
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

        if (!this._cmp._stateTemplates[s]) {
          this._cmp._stateTemplates[s] = [];
        }
        this._cmp._stateTemplates[s].push({ element });
      });
    });
  }

  renderTemplate(state) {
    const templateForStateExist = !!this._cmp._stateTemplates[state];

    Object.keys(this._cmp._stateTemplates).forEach(s => {
      const elements = this._cmp._stateTemplates[s];

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