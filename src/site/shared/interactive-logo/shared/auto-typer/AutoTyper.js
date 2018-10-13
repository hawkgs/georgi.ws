'use strict';

import { Component, DOMType } from '../../../../../core/component';
import html from './AutoTyper.html';
import css from './AutoTyper.css';

import { random } from '../../../../../utils/Helpers';

const DELAY_BETWEEN_INPUTS = 250;
const TYPE_SPEED = { from: 50, to: 200 };
const DELETE_SPEED = 50;

const State = {
  NoCaret: 'NoCaret',
  Caret: 'Caret'
};

function* makeTextGenerator(text) {
  for (let i = 0; i < text.length; i += 1) {
    yield text[i];
  }
}

export class AutoTyper extends Component {
  constructor() {
    super(html, [css], State.NoCaret, DOMType.Standard);
  }

  onComponentAttach() {
    if (!this.attr.text) {
      console.error('AutoTyper: Missing text attribute.');
      return;
    }

    this._content = this.root.querySelector('.content');
    this._text = this.attr.text.split(';');
    this._next = 0;
    this.typeNext();
  }

  typeNext() {
    const text = this._text[this._next];

    if (this._next < this._text.length - 1) {
      this._next += 1;
    } else {
      this._next = 0;
    }

    return this._type(text);
  }

  _type(text) {
    this.setState(State.Caret);

    return this._delete()
      .then(() => {
        if (this._timeout) {
          clearTimeout(this._timeout);
        }
        this._content.innerHTML = '';
        const generator = makeTextGenerator(text);

        return new Promise((res) => {
          const printLetter = () => {
            const next = generator.next();

            if (!next.done) {
              this._content.innerHTML += next.value;
              this._timeout = setTimeout(printLetter, random(TYPE_SPEED.from, TYPE_SPEED.to));
            } else {
              this.setState(State.NoCaret);
              res();
            }
          };
          printLetter();
        });
      });
  }

  _delete() {
    return new Promise((res) => {
      if (!this._content.innerHTML) {
        return res();
      }
      const deleteLetter = () => {
        const txt = this._content.innerHTML;
        if (txt) {
          this._content.innerHTML = txt.substring(0, txt.length - 1);
          setTimeout(deleteLetter, DELETE_SPEED);
        } else {
          setTimeout(res, DELAY_BETWEEN_INPUTS);
        }
      };
      deleteLetter();
    });
  }
}

customElements.define('auto-typer', AutoTyper);
