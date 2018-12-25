'use strict';

import { Component } from '../../../../core/component';
import html from './Project.html';
import css from './Project.css';

export class Project extends Component {
  static get observedAttributes() {
    return ['name', 'description'];
  }

  constructor() {
    super(html, [css]);
  }

  onComponentAttach() {
    this.root.querySelector('.project').href = this.attr.url || '/';
    this.root.querySelector('.name').innerHTML = this.attr.name || 'N/A';
    this.root.querySelector('.descr').innerHTML = this.attr.description || 'N/A';
  }
}

customElements.define('project-cmp', Project);
