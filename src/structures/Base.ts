'use strict';

import type { FIXME } from '../types';

const Util = require('../util/Util');

/**
 * Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models).
 */
class Base {
  private _id: FIXME;

  constructor(client) {
    /**
     * The client that instantiated this
     * @name Base#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
  }

  _clone() {
    return Object.assign(Object.create(this), this);
  }

  _patch(data) {
    return data;
  }

  _update(data) {
    const clone = this._clone();
    this._patch(data);
    return clone;
  }

  toJSON(...props) {
    return Util.flatten(this, ...props);
  }

  valueOf() {
    return this.id;
  }

  public get id(): any {
    return this._id;
  }
  public set id(value: any) {
    this._id = value;
  }
}

export default Base;
