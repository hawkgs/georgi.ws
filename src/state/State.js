'use strict';

class StateManager {
  constructor() {
    this._state = {};
    this._subscriptions = {};
  }

  get state() {
    return this._state;
  }

  setInitialState(componentName, component) {
    this._state[componentName] = null;

    const onStateUpdate = component.onStateUpdate;

    if (onStateUpdate) {
      this._subscriptions[componentName] = onStateUpdate;
    }
  }

  updateState(componentName, newState) {
    const state = this._state[componentName];

    if (state === undefined) {
      console.error(`${componentName}: No such component`);
      return;
    }

    this._state[componentName] = newState;
    const subFunc = this._subscriptions[componentName];

    if (subFunc) {
      subFunc(newState);
    } else {
      console.warn(`${componentName}: Doesn't have onStateUpdate method`);
    }
  }
}

let currentState;

export const getStateManager = () => {
  if (!currentState) {
    currentState = new StateManager();
  }
  return currentState;
};
