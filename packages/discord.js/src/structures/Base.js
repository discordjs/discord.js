'use strict';

const { flatten } = require('../util/Util.js');

/**
 * Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models).
 *
 * @abstract
 */
class Base {
  constructor(client) {
    /**
     * The client that instantiated this
     *
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
    return flatten(this, ...props);
  }

  valueOf() {
    return this.id;
  }
}

exports.Base = Base;
