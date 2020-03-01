'use strict';

import { Component, ComponentRef } from '../../../core/component';
import html from './InteractiveLogo.html';
import css from './InteractiveLogo.css';

import './shared/auto-typer/AutoTyper';
import { getInjector, ROUTING_SERVICE } from '../../../di';
import { forwardEnterPressToClick } from '../../../utils/DOM';

const SWITCH_INITIALS_AFTER = 8 * 1000;
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
      const next = this.state === State.InitialG ? State.InitialH : State.InitialG;
      this.setState(next);

      autoTyperRef.typeNext()
        .then(() => {
          if (this._timeout) {
            clearTimeout();
          }
          this._timeout = setTimeout(switchInitial, SWITCH_INITIALS_AFTER);
        });
    };
    this._timeout = setTimeout(switchInitial, SWITCH_INITIALS_AFTER);

    getInjector().subscribe(ROUTING_SERVICE, (routingService) => {
      this._clickHandler(routingService);
    });
  }

  onComponentDetach() {
    clearTimeout(this._timeout);
  }

  _clickHandler(routingService) {
    const container = this.root.querySelector('.interactive-logo');
    container.addEventListener('click', (e) => {
      routingService.push('/');
      e.target.blur();
    });
    forwardEnterPressToClick(container);
  }
}

customElements.define('interactive-logo', InteractiveLogo);
