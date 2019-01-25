'use strict';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

function init() {
  const element = document.createElement('div');
  element.id = 'root';

  if ('customElements' in window) {
    const AppComponent = require('./ui/AppComponent').default;
    element.appendChild(new AppComponent());
  } else {
    element.innerHTML = require('./unsupported.html');
  }

  return element;
}

document.body.appendChild(init());
