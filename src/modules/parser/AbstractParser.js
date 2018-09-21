'use stricts';

import { Tree } from './Tree';
import { Stack } from './Stack';

export class AbstractParser {
  constructor(lexer) {
    this._lexer = lexer;
  }

  get readers() {
    throw new Error('The readers getter is not implemented.');
  }

  parser(tree) {
    throw new Error('The parser method is not implemented.');
  }

  parse(string) {
    const tokens = this._lexer(string);
    const tree = new Tree();
    const stack = new Stack();

    tokens.forEach((t) => this._executeReaders(t, stack));

    return this.parser(tree);
  }

  _executeReaders(token, stack) {
    this.readers.forEach((r) => r.read(token, stack));
  }
}
