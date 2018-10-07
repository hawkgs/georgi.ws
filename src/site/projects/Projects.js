'use strict';

import { Component, DOMType } from '../../core/component';
import html from './Projects.html';
import css from './Projects.css';


export class Projects extends Component {
  constructor() {
    super(html, [css], null, DOMType.Standard);
  }
}

customElements.define('page-projects', Projects);
