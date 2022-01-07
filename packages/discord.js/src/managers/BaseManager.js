'use strict';

/**
 * Manages the API methods of a data model.
 * @abstract
 */
class BaseManager {
  constructor(client) {
    /**
     * The client that instantiated this Manager
     * @name BaseManager#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
  }
}

module.exports = BaseManager;
