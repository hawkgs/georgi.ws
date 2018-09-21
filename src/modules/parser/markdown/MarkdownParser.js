'use strict';

import { AbstractParser } from '../index';
import { markdownLexer } from './Lexer';
import {
  BoldReader,
  H1Reader,
  H2Reader,
  H3Reader,
  H4Reader,
  H5Reader,
  H6Reader
} from './Readers';

class MarkdownParser extends AbstractParser {
  get readers() {
    return [
      new BoldReader(),
      new H1Reader(),
      new H2Reader(),
      new H3Reader(),
      new H4Reader(),
      new H5Reader(),
      new H6Reader()
    ];
  }

  parser(tree) {
    // return
  }
}

export const markdownParser = new MarkdownParser(markdownLexer);
