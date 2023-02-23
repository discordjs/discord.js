'use strict';

const EventEmitter = require('node:events');
const { setTimeout, clearTimeout } = require('node:timers');
const { Collection } = require('@discordjs/collection');
const { DiscordjsTypeError, ErrorCodes } = require('../../errors');
const { flatten } = require('../../util/Util');

/**
 * Filter to be applied to the collector.
 * @typedef {Function} CollectorFilter
 * @param {...*} args Any arguments received by the listener
 * @param {Collection} collection The items collected by this collector
 * @returns {boolean|Promise<boolean>}
 */

/**
 * Options to be applied to the collector.
 * @typedef {Object} CollectorOptions
 * @property {CollectorFilter} [filter] The filter applied to this collector
 * @property {number} [time] How long to run the collector for in milliseconds
 * @property {number} [idle] How long to stop the collector after inactivity in milliseconds
 * @property {boolean} [dispose=false] Whether to dispose data when it's deleted
 */

/**
 * Abstract class for defining a new Collector.
 * @extends {EventEmitter}
 * @abstract
 */
class Collector extends EventEmitter {
  constructor(client, options = {}) {
    super();

    /**
     * The client that instantiated this Collector
     * @name Collector#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The filter applied to this collector
     * @type {CollectorFilter}
     * @returns {boolean|Promise<boolean>}
     */
    this.filter = options.filter ?? (() => true);

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
     * The reason the collector ended
     * @type {string|null}
     * @private
     */
    this._endReason = null;

    if (typeof this.filter !== 'function') {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'options.filter', 'function');
    }

    this.handleCollect = this.handleCollect.bind(this);
    this.handleDispose = this.handleDispose.bind(this);

    if (options.time) this._timeout = setTimeout(() => this.stop('time'), options.time).unref();
    if (options.idle) this._idletimeout = setTimeout(() => this.stop('idle'), options.idle).unref();
  }

  /**
   * Call this to handle an event as a collectable element. Accepts any event data as parameters.
   * @param {...*} args The arguments emitted by the listener
   * @returns {Promise<void>}
   * @emits Collector#collect
   */
  async handleCollect(...args) {
    const collectedId = await this.collect(...args);

    if (collectedId) {
      const filterResult = await this.filter(...args, this.collected);
      if (filterResult) {
        this.collected.set(collectedId, args[0]);

        /**
         * Emitted whenever an element is collected.
         * @event Collector#collect
         * @param {...*} args The arguments emitted by the listener
         */
        this.emit('collect', ...args);

        if (this._idletimeout) {
          clearTimeout(this._idletimeout);
          this._idletimeout = setTimeout(() => this.stop('idle'), this.options.idle).unref();
        }
      } else {
        /**
         * Emitted whenever an element is not collected by the collector.
         * @event Collector#ignore
         * @param {...*} args The arguments emitted by the listener
         */
        this.emit('ignore', ...args);
      }
    }
    this.checkEnd();
  }

  /**
   * Call this to remove an element from the collection. Accepts any event data as parameters.
   * @param {...*} args The arguments emitted by the listener
   * @returns {Promise<void>}
   * @emits Collector#dispose
   */
  async handleDispose(...args) {
    if (!this.options.dispose) return;

    const dispose = this.dispose(...args);
    if (!dispose || !(await this.filter(...args)) || !this.collected.has(dispose)) return;
    this.collected.delete(dispose);

    /**
     * Emitted whenever an element is disposed of.
     * @event Collector#dispose
     * @param {...*} args The arguments emitted by the listener
     */
    this.emit('dispose', ...args);
    this.checkEnd();
  }

  /**
   * Returns a promise that resolves with the next collected, disposed, or ignored elements;
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
        this.removeListener('dispose', onDispose);
        this.removeListener('ignore', onIgnore);
        this.removeListener('end', onEnd);
      };

      const onCollect = (...items) => {
        cleanup();
        resolve(['collecting', ...items]);
      };

      const onDispose = (...items) => {
        cleanup();
        resolve(['disposing', ...items]);
      };

      const onIgnore = (...items) => {
        cleanup();
        resolve(['ignoring', ...items]);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected);
      };

      this.on('collect', onCollect);
      this.on('dispose', onDispose);
      this.on('ignore', onIgnore);
      this.on('end', onEnd);
    });
  }

  /**
   * Returns a promise that resolves with the next collected elements;
   * rejects with collected elements if the collector finishes without receiving a next element
   * @type {Promise}
   * @readonly
   */
  get nextCollecting() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('collect', onCollect);
        this.removeListener('end', onEnd);
      };

      const onCollect = (...items) => {
        cleanup();
        resolve(items);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected);
      };

      this.on('collect', onCollect);
      this.on('end', onEnd);
    });
  }

  /**
   * Returns a promise that resolves with the next disposed elements;
   * rejects with collected elements if the collector finishes without receiving a next element
   * @type {Promise}
   * @readonly
   */
  get nextDisposing() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('dispose', onDispose);
        this.removeListener('end', onEnd);
      };

      const onDispose = (...items) => {
        cleanup();
        resolve(items);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected);
      };

      this.on('dispose', onDispose);
      this.on('end', onEnd);
    });
  }

  /**
   * Returns a promise that resolves with the next ignored elements;
   * rejects with collected elements if the collector finishes without receiving a next element
   * @type {Promise}
   * @readonly
   */
  get nextIgnoring() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('ignore', onIgnore);
        this.removeListener('end', onEnd);
      };

      const onIgnore = (...items) => {
        cleanup();
        resolve(items);
      };

      const onEnd = () => {
        cleanup();
        reject(this.collected);
      };

      this.on('ignore', onIgnore);
      this.on('end', onEnd);
    });
  }

  /**
   * Stops this collector and emits the `end` event.
   * @param {string} [reason='user'] The reason this collector is ending
   * @emits Collector#end
   */
  stop(reason = 'user') {
    if (this.ended) return;

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout);
      this._idletimeout = null;
    }

    this._endReason = reason;
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
   * Options used to reset the timeout and idle timer of a {@link Collector}.
   * @typedef {Object} CollectorResetTimerOptions
   * @property {number} [time] How long to run the collector for (in milliseconds)
   * @property {number} [idle] How long to wait to stop the collector after inactivity (in milliseconds)
   */

  /**
   * Resets the collector's timeout and idle timer.
   * @param {CollectorResetTimerOptions} [options] Options for resetting
   */
  resetTimer({ time, idle } = {}) {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => this.stop('time'), time ?? this.options.time).unref();
    }
    if (this._idletimeout) {
      clearTimeout(this._idletimeout);
      this._idletimeout = setTimeout(() => this.stop('idle'), idle ?? this.options.idle).unref();
    }
  }

  /**
   * Checks whether the collector should end, and if so, ends it.
   * @returns {boolean} Whether the collector ended or not
   */
  checkEnd() {
    const reason = this.endReason;
    if (reason) this.stop(reason);
    return Boolean(reason);
  }

  /**
   * Allows collectors to be consumed with for-await-of loop for collected, disposed, and ignored elements
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of}
   */
  async *[Symbol.asyncIterator]() {
    const queue = [];
    const onCollect = (...items) => queue.push(['collecting', ...items]);
    const onDispose = (...items) => queue.push(['disposing', ...items]);
    const onIgnore = (...items) => queue.push(['ignoring', ...items]);
    this.on('collect', onCollect);
    this.on('dispose', onDispose);
    this.on('ignore', onIgnore);

    try {
      while (queue.length || !this.ended) {
        if (queue.length) {
          yield queue.shift();
        } else {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => {
            const tick = () => {
              this.removeListener('collect', tick);
              this.removeListener('dispose', tick);
              this.removeListener('end', tick);
              return resolve();
            };
            this.on('collect', tick);
            this.on('dispose', tick);
            this.on('ignore', tick);
            this.on('end', tick);
          });
        }
      }
    } finally {
      this.removeListener('collect', onCollect);
      this.removeListener('dispose', onDispose);
      this.removeListener('ignore', onIgnore);
    }
  }

  /**
   * Allows collectors to be consumed with for-await-of loop for collected elements
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of}
   */
  async *collectings() {
    const queue = [];
    const onCollect = (...items) => queue.push(items);
    this.on('collect', onCollect);

    try {
      while (queue.length || !this.ended) {
        if (queue.length) {
          yield queue.shift();
        } else {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => {
            const tick = () => {
              this.removeListener('collect', tick);
              this.removeListener('end', tick);
              return resolve();
            };
            this.on('collect', tick);
            this.on('end', tick);
          });
        }
      }
    } finally {
      this.removeListener('collect', onCollect);
    }
  }

  /**
   * Allows collectors to be consumed with for-await-of loop for disposed elements
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of}
   */
  async *disposings() {
    const queue = [];
    const onDispose = (...items) => queue.push(items);
    this.on('dispose', onDispose);

    try {
      while (queue.length || !this.ended) {
        if (queue.length) {
          yield queue.shift();
        } else {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => {
            const tick = () => {
              this.removeListener('dispose', tick);
              this.removeListener('end', tick);
              return resolve();
            };
            this.on('dispose', tick);
            this.on('end', tick);
          });
        }
      }
    } finally {
      this.removeListener('dispose', onDispose);
    }
  }

  /**
   * Allows collectors to be consumed with for-await-of loop for ignored elements
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of}
   */
  async *ignorings() {
    const queue = [];
    const onIgnore = (...items) => queue.push(items);
    this.on('ignore', onIgnore);

    try {
      while (queue.length || !this.ended) {
        if (queue.length) {
          yield queue.shift();
        } else {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => {
            const tick = () => {
              this.removeListener('ignore', tick);
              this.removeListener('end', tick);
              return resolve();
            };
            this.on('ignore', tick);
            this.on('end', tick);
          });
        }
      }
    } finally {
      this.removeListener('ignore', onIgnore);
    }
  }

  toJSON() {
    return flatten(this);
  }

  /* eslint-disable no-empty-function */
  /**
   * The reason this collector has ended with, or null if it hasn't ended yet
   * @type {?string}
   * @readonly
   */
  get endReason() {
    return this._endReason;
  }

  /**
   * Handles incoming events from the `handleCollect` function. Returns null if the event should not
   * be collected, or returns an object describing the data that should be stored.
   * @see Collector#handleCollect
   * @param {...*} args Any args the event listener emits
   * @returns {?(*|Promise<?*>)} Data to insert into collection, if any
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
  /* eslint-enable no-empty-function */
}

module.exports = Collector;
