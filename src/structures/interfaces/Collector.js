const Collection = require('../../util/Collection');
const EventEmitter = require('events').EventEmitter;

/**
 * Filter to be applied to the collector.
 * @typedef {Function} CollectorFilter
 * @param {...*} args Any arguments received by the listener
 * @param {Collection} collection The items collected by this collector
 * @returns {boolean}
 */

/**
 * Options to be applied to the collector.
 * @typedef {Object} CollectorOptions
 * @property {number} [time] How long to run the collector for
 * @property {number} [idle] How long to stop the collector after inactivity in milliseconds
 */

/**
 * Abstract class for defining a new Collector.
 * @abstract
 */
class Collector extends EventEmitter {
  constructor(client, filter, options = {}) {
    super();

    /**
     * The client
     * @name Collector#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The filter applied to this collector
     * @type {CollectorFilter}
     */
    this.filter = filter;

    /**
     * The options of this collector
     * @type {CollectorOptions}
     */
    this.options = options;

    /**
     * The items collected by this collector
     * @type {Collection}
     */
    this.collected = new Collection();

    /**
     * Whether this collector has finished collecting
     * @type {boolean}
     */
    this.ended = false;

    /**
     * Timeout for cleanup
     * @type {?Timeout}
     * @private
     */
    this._timeout = null;

    /**
     * Timeout for cleanup due to inactivity
     * @type {?Timeout}
     * @private
     */
    this._idletimeout = null;

    /**
     * Call this to handle an event as a collectable element
     * Accepts any event data as parameters
     * @type {Function}
     * @private
     */
    this.listener = this._handle.bind(this);
    if (options.time) this._timeout = this.client.setTimeout(() => this.stop('time'), options.time);
    if (options.idle) this._idletimeout = this.client.setTimeout(() => this.stop('idle'), options.idle);
  }

  /**
   * @param {...*} args The arguments emitted by the listener
   * @emits Collector#collect
   * @private
   */
  _handle(...args) {
    const collect = this.handle(...args);
    if (collect && this.filter(...args, this.collected)) {
      this.collected.set(collect.key, collect.value);

      /**
       * Emitted whenever an element is collected.
       * @event Collector#collect
       * @param {*} element The element that got collected
       * @param {Collector} collector The collector
       */
      this.emit('collect', collect.value, this);

      if (this._idletimeout) {
        this.client.clearTimeout(this._idletimeout);
        this._idletimeout = this.client.setTimeout(() => this.stop('idle'), this.options.idle);
      }
    }

    const post = this.postCheck(...args);
    if (post) this.stop(post);
  }

  /**
   * Return a promise that resolves with the next collected element;
   * rejects with collected elements if the collector finishes without receiving a next element
   * @type {Promise}
   * @readonly
   */
  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('collect', onCollect);
        this.removeListener('end', onEnd);
      };

      const onCollect = item => {
        cleanup();
        resolve(item);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected); // eslint-disable-line prefer-promise-reject-errors
      };

      this.on('collect', onCollect);
      this.on('end', onEnd);
    });
  }

  /**
   * Stop this collector and emit the `end` event.
   * @param {string} [reason='user'] The reason this collector is ending
   * @emits Collector#end
   */
  stop(reason = 'user') {
    if (this.ended) return;

    if (this._timeout) {
      this.client.clearTimeout(this._timeout);
      this._timeout = null;
    }
    if (this._idletimeout) {
      this.client.clearTimeout(this._idletimeout);
      this._idletimeout = null;
    }
    this.ended = true;
    this.cleanup();

    /**
     * Emitted when the collector is finished collecting.
     * @event Collector#end
     * @param {Collection} collected The elements collected by the collector
     * @param {string} reason The reason the collector ended
     */
    this.emit('end', this.collected, reason);
  }

  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * Handles incoming events from the `listener` function. Returns null if the event should not be collected,
   * or returns an object describing the data that should be stored.
   * @see Collector#listener
   * @param {...*} args Any args the event listener emits
   * @returns {?{key: string, value}} Data to insert into collection, if any
   * @abstract
   */
  handle() {}

  /**
   * This method runs after collection to see if the collector should finish.
   * @param {...*} args Any args the event listener emits
   * @returns {?string} Reason to end the collector, if any
   * @abstract
   */
  postCheck() {}

  /**
   * Called when the collector is ending.
   * @abstract
   */
  cleanup() {}
  /* eslint-enable no-empty-function, valid-jsdoc */
}

module.exports = Collector;
