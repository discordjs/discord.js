'use strict';

const EventEmitter = require('node:events');
const RESTManager = require('../rest/RESTManager');
const Options = require('../util/Options');
const Util = require('../util/Util');

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class BaseClient extends EventEmitter {
  constructor(options = {}) {
    super();

    /**
     * The options the client was instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(Options.createDefault(), options);

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this);
  }

  /**
   * API shortcut
   * @type {Object}
   * @readonly
   * @private
   */
  get api() {
    return this.rest.api;
  }

  /**
   * Destroys all assets used by the base client.
   * @returns {void}
   */
  destroy() {
    if (this.rest.sweepInterval) clearInterval(this.rest.sweepInterval);
  }

  /**
   * Increments max listeners by one, if they are not zero.
   * @private
   */
  incrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners + 1);
    }
  }

  /**
   * Decrements max listeners by one, if they are not zero.
   * @private
   */
  decrementMaxListeners() {
    const maxListeners = this.getMaxListeners();
    if (maxListeners !== 0) {
      this.setMaxListeners(maxListeners - 1);
    }
  }

  toJSON(...props) {
    return Util.flatten(this, { domain: false }, ...props);
  }
}

module.exports = BaseClient;

/**
 * Emitted for general debugging information.
 * @event BaseClient#debug
 * @param {string} info The debug information
 */
