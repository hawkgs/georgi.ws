'use strict';

import { AbstractReader } from '../index';

export class H1Reader extends AbstractReader {}
export class H2Reader extends AbstractReader {}
export class H3Reader extends AbstractReader {}
export class H4Reader extends AbstractReader {}
export class H5Reader extends AbstractReader {}
export class H6Reader extends AbstractReader {}

export class BoldReader extends AbstractReader {
  constructor() {
    this._prev = null;
    this._cache = [];
  }

  read(token) {}
}
