'use strict';

class StateManager {
  constructor() {
    this._state = {};
    this._subscriptions = {};
  }

  get state() {
    return this._state;
  }

  setInitialState(componentName) {
    this._state[componentName] = null;
  }

  subscribe(componentName, onStateUpdate, thisCmp) {
    this._subscriptions[componentName] = onStateUpdate.bind(thisCmp);
  }

  unsubscribe(componentName) {
    this._state[componentName] = undefined;
    this._subscriptions[componentName] = null;
  }

  updateState(componentName, newState) {
    const state = this._state[componentName];

    if (state === undefined) {
      console.error(`${componentName}: No such component`);
      return;
    }

    this._state[componentName] = newState;
    const notify = this._subscriptions[componentName];
    notify(newState);
  }
}

let currentState;

export const getStateManager = () => {
  if (!currentState) {
    currentState = new StateManager();
  }
  return currentState;
};
