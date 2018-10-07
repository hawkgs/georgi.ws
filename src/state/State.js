'use strict';

class StateManager {
  constructor() {
    this._state = {};
    this._subscriptions = {};
  }

  get state() {
    return this._state;
  }

  setInitialState(componentId, initialState) {
    initialState = initialState || null;
    this._state[componentId] = initialState;
  }

  subscribe(componentId, onStateUpdate, thisCmp) {
    this._subscriptions[componentId] = onStateUpdate.bind(thisCmp);
  }

  unsubscribe(componentId) {
    this._state[componentId] = undefined;
    this._subscriptions[componentId] = null;
  }

  updateState(componentId, newState) {
    const state = this._state[componentId];

    if (state === undefined) {
      console.error(`${componentId}: No such component`);
      return;
    }

    this._state[componentId] = newState;
    const notify = this._subscriptions[componentId];
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
