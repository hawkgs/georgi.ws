'use strict';

import './favicon.png';
import { AppComponent } from './site/AppComponent';

function init() {
  const element = document.createElement('div');
  element.id = 'root';
  element.appendChild(new AppComponent());

  return element;
}

document.body.appendChild(init());
