'use strict';

import { Component } from '../../../core/component';
import html from './InteractiveLogo.html';
import css from './InteractiveLogo.css';

const State = {
  InitialG: 'InitialG',
  InitialH: 'InitialH'
};

export class InteractiveLogo extends Component {
  constructor() {
    super(html, css, State.InitialG);
  }

  onComponentAttach() {
    const switchInitial = () => {
      const next = this.state === State.InitialG ? State.InitialH : State.InitialG;
      this.setState({ type: next });
      setTimeout(switchInitial, 10000);
    };
    setTimeout(switchInitial, 10000);
  }
}

customElements.define('interactive-logo', InteractiveLogo);
