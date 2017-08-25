const Collection = require('../../util/Collection');
const EventEmitter = require('events');

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
 * @property {boolean} [dispose=false] Whether to dispose data when it's deleted
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

    this.handleCollect = this.handleCollect.bind(this);
    this.handleDispose = this.handleDispose.bind(this);

    if (options.time) this._timeout = this.client.setTimeout(() => this.stop('time'), options.time);
  }

  /**
   * Call this to handle an event as a collectable element. Accepts any event data as parameters.
   * @param {...*} args The arguments emitted by the listener
   * @emits Collector#collect
   */
  handleCollect(...args) {
    const collect = this.collect(...args);
    if (!collect || !this.filter(...args, this.collected)) return;

    this.collected.set(collect.key, collect.value);

    /**
     * Emitted whenever an element is collected.
     * @event Collector#collect
     * @param {*} element The element that got collected
     * @param {...*} args The arguments emitted by the listener
     */
    this.emit('collect', collect.value, ...args);
    this.checkEnd();
  }

  /**
   * Call this to remove an element from the collection. Accepts any event data as parameters.
   * @param {...*} args The arguments emitted by the listener
   * @emits Collector#dispose
   */
  handleDispose(...args) {
    if (!this.options.dispose) return;

    const dispose = this.dispose(...args);
    if (!dispose || !this.filter(...args) || !this.collected.has(dispose)) return;

    const value = this.collected.get(dispose);
    this.collected.delete(dispose);

    /**
     * Emitted whenever an element has been disposed.
     * @event Collector#dispose
     * @param {*} element The element that was disposed
     * @param {...*} args The arguments emitted by the listener
     */
    this.emit('dispose', value, ...args);
    this.checkEnd();
  }

  /**
   * Return a promise that resolves with the next collected element;
   * rejects with collected elements if the collector finishes without receving a next element
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

    if (this._timeout) this.client.clearTimeout(this._timeout);
    this.ended = true;

    /**
     * Emitted when the collector is finished collecting.
     * @event Collector#end
     * @param {Collection} collected The elements collected by the collector
     * @param {string} reason The reason the collector ended
     */
    this.emit('end', this.collected, reason);
  }

  /**
   * Check whether the collector should end, and if so, end it.
   */
  checkEnd() {
    const reason = this.endReason();
    if (reason) this.stop(reason);
  }

  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * Handles incoming events from the `handleCollect` function. Returns null if the event should not
   * be collected, or returns an object describing the data that should be stored.
   * @see Collector#handleCollect
   * @param {...*} args Any args the event listener emits
   * @returns {?{key, value}} Data to insert into collection, if any
   * @abstract
   */
  collect() {}

  /**
   * Handles incoming events from the `handleDispose`. Returns null if the event should not
   * be disposed, or returns the key that should be removed.
   * @see Collector#handleDispose
   * @param {...*} args Any args the event listener emits
   * @returns {?*} Key to remove from the collection, if any
   * @abstract
   */
  dispose() {}

  /**
   * The reason this collector has ended or will end with.
   * @returns {?string} Reason to end the collector, if any
   * @abstract
   */
  endReason() {}
  /* eslint-enable no-empty-function, valid-jsdoc */
}

module.exports = Collector;
