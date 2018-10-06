'use strict';

import { Component } from '../../../core/component';
import html from './InteractiveLogo.html';
import css from './InteractiveLogo.css';

const SwitchInitialsAfter = 10 * 1000;
const State = {
  InitialG: 'InitialG',
  InitialH: 'InitialH'
};

export class InteractiveLogo extends Component {
  constructor() {
    super(html, [css], State.InitialG);
  }

  onComponentAttach() {
    const switchInitial = () => {
      const next = this.state === State.InitialG ? State.InitialH : State.InitialG;
      this.setState({ type: next });
    };
    this._interval = setInterval(switchInitial, SwitchInitialsAfter);
  }

  onComponentDetach() {
    clearInterval(this._interval);
  }
}

customElements.define('interactive-logo', InteractiveLogo);
