'use strict';

import { Component } from '../../../../core/component';
import html from './Project.html';
import css from './Project.css';

export class Project extends Component {
  constructor() {
    super(html, [css]);
  }
}

customElements.define('project-cmp', Project);
