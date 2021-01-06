'use strict';

const Snowflake = require('../util/Snowflake');
const Util = require('../util/Util');

/**
 * Represents a data model that is identifiable by a Snowflake (i.e. Discord API data models).
 * @abstract
 */
class Base {
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

  /**
   * Tells whether a given string may be used as an ID for an instance of this class.
   * @param {string} value String to test
   * @returns {boolean} Returns true if the string may be used as an ID
   */
  static isValidID(value) {
    return Snowflake.maybeSnowflake(value);
  }
}

module.exports = Base;
