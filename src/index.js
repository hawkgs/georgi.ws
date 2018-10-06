'use strict';

import './favicon.png';

function init() {
  const element = document.createElement('div');
  element.id = 'root';

  if ('customElements' in window) {
    const AppComponent = require('./site/AppComponent').default;
    element.appendChild(new AppComponent());
  } else {
    element.innerHTML = require('./unsupported.html');
  }

  return element;
}

document.body.appendChild(init());
