const Collection = require('../../util/Collection');
const EventEmitter = require('events').EventEmitter;

/**
 * Filter to be applied to the collector.
 * @typedef {Function} CollectorFilter
 * @param {...*} args Any arguments received by the listener.
 * @returns {boolean} To collect or not collect.
 */

/**
 * Options to be applied to the collector.
 * @typedef {Object} CollectorOptions
 * @property {number} [time] How long to run the collector for.
 */

/**
 * Interface for defining a new Collector.
 * @fires Collector#collect
 * @fires Collector#end
 * @interface
 */
class Collector extends EventEmitter {
  constructor(client, filter, options = {}) {
    super();

    /**
     * @type {Client} client The client.
     */
    this.client = client;

    /**
     * @type {CollectorFilter} filter The filter applied to this collector.
     */
    this.filter = filter;

    /**
     * @type {CollectorOptions} options The options of this collector.
     */
    this.options = options;

    /**
     * @type {Collection} collected The items collected by this collector.
     */
    this.collected = new Collection();

    /**
     * @type {boolean} ended Whether this collector has finished collecting.
     */
    this.ended = false;

    /**
     * @type {?number} _timeout Timeout ID for cleanup.
     * @private
     */
    this._timeout = null;

    /**
     * @type {Function} listener Call this to handle an event as a collectable element.
     * Accepts any event data as parameters.
     * @private
     */
    this.listener = this._handle.bind(this);
    if (options.time) this._timeout = this.client.setTimeout(() => this.stop('time'), options.time);
  }

  /**
   * @param {...*} args The arguments emitted by the listener.
   * @private
   */
  _handle(...args) {
    const collect = this.handle(...args);
    if (!collect || !this.filter(...args)) return;

    this.collected.set(collect.key, collect.value);

    /**
     * Emitted whenever an element is collected.
     * @event Collector#collect
     * @param {*} element The element that got collected.
     * @param {Collector} collector The message collector.
     */
    this.emit('collect', collect.value, this);

    const post = this.postCheck(...args);
    if (post) this.stop(post);
  }

  /**
   * Return a promise that resolves with the next collected element;
   * rejects with collected elements if the collector finishes without receving a next element.
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
   * @param {string} [reason='user'] The reason this collector is ending.
   */
  stop(reason = 'user') {
    if (this.ended) return;

    if (this._timeout) this.client.clearTimeout(this._timeout);
    this.ended = true;
    this.cleanup();

    /**
     * Emitted when the collector is finished collecting.
     * @event Collector#end
     * @param {Collection} collected The elements collected by the collector.
     * @param {string} reason The reason the collector ended.
     */
    this.emit('end', this.collected, reason);
  }

  /* eslint-disable no-empty-function, valid-jsdoc */
  /**
   * @param {...*} args Any args the event listener emits.
   * @returns {?{key: string, value}} Data to insert into collection, if any.
   * @abstract
   * @private
   */
  handle() {}

  /**
   * @param {...*} args Any args the event listener emits.
   * @returns {?string} Reason to end the collector, if any.
   * @abstract
   * @private
   */
  postCheck() {}

  /**
   * Called when the collector is ending.
   * @abstract
   * @private
   */
  cleanup() {}
  /* eslint-enable no-empty-function, valid-jsdoc */
}

module.exports = Collector;
