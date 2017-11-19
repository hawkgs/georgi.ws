'use strict';

import { AppComponent } from './AppComponent';

function init() {
  const element = document.createElement('div');
  element.id = 'root';
  element.appendChild(new AppComponent());

  return element;
}

document.body.appendChild(init());
