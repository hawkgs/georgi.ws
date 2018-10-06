'use strict';

import { Component } from '../../core/component';
import html from './Projects.html';
import css from './Projects.css';


export class Projects extends Component {
  constructor() {
    super(html, [css]);
  }
}

customElements.define('page-projects', Projects);
