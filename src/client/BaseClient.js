const EventEmitter = require('events');
const RESTManager = require('../rest/RESTManager');
const Util = require('../util/Util');
const { DefaultOptions } = require('../util/Constants');

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
    this.options = Util.mergeDefault(DefaultOptions, options);

    /**
     * The REST manager of the client
     * @type {RESTManager}
     * @private
     */
    this.rest = new RESTManager(this, options._tokenType);

    /**
     * Timeouts set by {@link BaseClient#setTimeout} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._timeouts = new Set();

    /**
     * Intervals set by {@link BaseClient#setInterval} that are still active
     * @type {Set<Timeout>}
     * @private
     */
    this._intervals = new Set();
  }

  /**
   * Whether the client is in a browser environment
   * @type {boolean}
   * @readonly
   */
  get browser() {
    return typeof window !== 'undefined';
  }

  /**
   * API shortcut
   * @type {Object}
   * @private
   */
  get api() {
    return this.rest.api;
  }

  /**
   * Destroys all assets used by the base client.
   */
  destroy() {
    for (const t of this._timeouts) clearTimeout(t);
    for (const i of this._intervals) clearInterval(i);
    this._timeouts.clear();
    this._intervals.clear();
  }

  /**
   * Sets a timeout that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait before executing (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setTimeout(fn, delay, ...args) {
    const timeout = setTimeout(() => {
      fn(...args);
      this._timeouts.delete(timeout);
    }, delay);
    this._timeouts.add(timeout);
    return timeout;
  }

  /**
   * Clears a timeout.
   * @param {Timeout} timeout Timeout to cancel
   */
  clearTimeout(timeout) {
    clearTimeout(timeout);
    this._timeouts.delete(timeout);
  }

  /**
   * Sets an interval that will be automatically cancelled if the client is destroyed.
   * @param {Function} fn Function to execute
   * @param {number} delay Time to wait between executions (in milliseconds)
   * @param {...*} args Arguments for the function
   * @returns {Timeout}
   */
  setInterval(fn, delay, ...args) {
    const interval = setInterval(fn, delay, ...args);
    this._intervals.add(interval);
    return interval;
  }

  /**
   * Clears an interval.
   * @param {Timeout} interval Interval to cancel
   */
  clearInterval(interval) {
    clearInterval(interval);
    this._intervals.delete(interval);
  }
}

module.exports = BaseClient;
