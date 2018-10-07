'use strict';

import { Component } from '../../../../../core/component';
import html from './AutoTyper.html';
import css from './AutoTyper.css';

const DelayBetweenText = 250;
const TypeSpeed = { from: 50, to: 200 };
const DeleteSpeed = 50;

const random = (min, max) => Math.random() * (max - min) + min;

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
    super(html, [css], State.NoCaret);
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
              this._timeout = setTimeout(printLetter, random(TypeSpeed.from, TypeSpeed.to));
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
          setTimeout(deleteLetter, DeleteSpeed);
        } else {
          setTimeout(res, DelayBetweenText);
        }
      };
      deleteLetter();
    });
  }
}

customElements.define('auto-typer', AutoTyper);
