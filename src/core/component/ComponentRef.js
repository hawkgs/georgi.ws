'use strict';

export const ComponentRef = {
  _store: Map([]),
  get: (element) => {
    const id = element.attr['data-cid'];
    const ref = ComponentRef._store.get(id);

    if (!ref) {
      console.error(`ComponentRef: Couldn't find the component reference of the element.`);
    }
    return ref;
  },
  set: (ref) => {
    if (ComponentRef._store.has(ref.id)) {
      console.error('ComponentRef: ID collision.');
    }
    ComponentRef._store.set(ref.id, ref);
  },
  remove: (ref) => {
    ComponentRef._store.delete(ref.id);
  }
};
