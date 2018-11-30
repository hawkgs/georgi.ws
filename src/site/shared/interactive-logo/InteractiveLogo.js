'use strict';

import { Component, ComponentRef } from '../../../core/component';
import html from './InteractiveLogo.html';
import css from './InteractiveLogo.css';

import './shared/auto-typer/AutoTyper';
import { getInjector, ROUTING_SERVICE } from '../../../di';

const SWITCH_INITIAL_STATE_AFTER = 10 * 1000;
const State = {
  InitialG: 'InitialG',
  InitialH: 'InitialH'
};

export class InteractiveLogo extends Component {
  constructor() {
    super(html, [css], State.InitialG);
  }

  onComponentAttach() {
    const autoTyperRef = ComponentRef.get(this.root.querySelector('auto-typer'));
    const switchInitial = () => {
      autoTyperRef.typeNext();

      const next = this.state === State.InitialG ? State.InitialH : State.InitialG;
      this.setState(next);
    };
    this._interval = setInterval(switchInitial, SWITCH_INITIAL_STATE_AFTER);

    getInjector().subscribe(ROUTING_SERVICE, (routingService) => {
      this._clickHandler(routingService);
    });
  }

  onComponentDetach() {
    clearInterval(this._interval);
  }

  _clickHandler(routingService) {
    this.root.addEventListener('click', () => {
      routingService.push('/');
    });
  }
}

customElements.define('interactive-logo', InteractiveLogo);
