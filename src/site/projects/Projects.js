'use strict';

import { Component, DOMType } from '../../core/component';
import html from './Projects.html';
import css from './Projects.css';
import common from '../shared/common.css';

import './shared/project/Project';

export class Projects extends Component {
  constructor() {
    super(html, [css, common], null, DOMType.Standard);
  }
}

customElements.define('page-projects', Projects);
