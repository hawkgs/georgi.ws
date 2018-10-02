'use strict';

import { Component } from '../core/component';
import html from './AppComponent.html';
import css from './AppComponent.css';

import '../core/router';

import './shared/projects/Projects';
import './shared/timeline/Timeline';
import './shared/about/About';

export class AppComponent extends Component {
  constructor() {
    super(html, css);
  }
}

customElements.define('app-cmp', AppComponent);
