'use stricts';

import { Tree } from './Tree';
import { Stack } from './Stack';

export class AbstractParser {
  get readers() {
    throw new Error('The readers getter is not implemented.');
  }

  parser(tree) {
    throw new Error('The parser method is not implemented.');
  }

  parse(string) {
    const tree = new Tree();
    const stack = new Stack();

    for (let i = 0; i < string.length; i += 1) {
      this._executeReaders(string[i], stack);
    }

    return this.parser(tree);
  }

  _executeReaders(char, stack) {
    this.readers.forEach((r) => r.read(char, stack));
  }
}
