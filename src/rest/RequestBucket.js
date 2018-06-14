const queue = require('async/queue');
const DiscordAPIError = require('./DiscordAPIError');
const { Events: { RATE_LIMIT } } = require('../util/Constants');

/**
 * A request bucket
 * @private
 */
class RequestBucket {
  constructor(manager, route) {
    /**
     * @type {RESTManager}
     */
    this.manager = manager;

    /**
     * The route that this bucket is controlling
     * @type {string}
     */
    this.route = route;

    /**
     * @type {Client}
     */
    this.client = this.manager.client;

    /**
     * How many requests are allowed in this bucket
     * @type {number}
     */
    this.limit = Infinity;

    /**
     * The number of requests remaining in this bucket
     * @type {number}
     */
    this.remaining = -1;

    /**
     * The async queue
     * @type {QueueObject}
     */
    this.queue = queue(this.handle.bind(this), this.client.options.restConcurrency || 1);

    /**
     * How long to wait before sending next request.
     * @type {number}
     */
    this.timeout = 0;

    /**
     * The current ratelimiting resume timer
     * @type {?Timer}
     * @private
     */
    this._timer = null;

    /**
     * Time at which this bucket resets
     * @type {number}
     * @private
     */
    this._resetTime = 0;

    /**
     * Current request sequence
     * @type {number}
     * @private
     */
    this._seq = 0;

    /**
     * The seq of the most recent request, negative if unknown
     * @type {number}
     * @private
     */
    this._latest = 0;
  }

  /**
   * Whether this bucket is currently ratelimited
   * @type {boolean}
   * @readonly
   */
  get limited() {
    return this.manager.globallyRateLimited ||
      (this.remaining - this.queue.running()) <= 0 ||
      this.resetTime > Date.now();
  }

  /**
   * The timestamp at which this bucket's ratelimiting will reset
   * @type {number}
   */
  get resetTime() {
    return this._reset;
  }

  set resetTime(time) {
    if (time > this._reset) this._reset = time;
  }

  /**
   * Make a request in this bucket
   * @param {APIRequest} request The request to make
   * @returns {Promise<*>}
   */
  enqueue(request) {
    return new Promise((resolve, reject) => {
      if (request.seq === undefined) request.seq = this._seq++;

      this.queue.push(request, (err, res) => {
        if (err) return reject(err);

        if (res.ok) return res.json().then(resolve, reject);
        return res.json().then(data => {
          reject(res.status >= 400 && res.status < 500 ?
            new DiscordAPIError(request.path, data, request.method) : res);
        }, reject);
      });
    });
  }

  /* eslint-disable callback-return */
  /**
   * Handle a request item
   * @param {APIRequest} request The item to execute
   * @param {Function} cb A callback to indicate when this item is processed
   */
  handle(request, cb) {
    if (this.limited && !this.queue.paused) this.queue.pause();

    request.make().then(res => {
      // Response handling
      let timeout = 0;
      if (res.status === 429) {
        this.queue.unshift(request, cb);
        this.client.emit('debug', `Exceeded ratelimit for bucket "${this.route}" (${request.method} ${res.url})`);
        timeout = Number(res.headers.get('retry-after'));
      } else if (res.status >= 500 && res.status < 600) {
        if (request.retried) {
          cb(res);
        } else {
          request.retried = true;
          this.queue.unshift(request, cb);
          timeout = 1e3;
        }
      } else {
        cb(null, res);
      }

      // Header parsing
      const date = new Date(res.headers.get('date')).valueOf();
      this.manager.globallyRateLimited = Boolean(res.headers.get('x-ratelimit-global'));
      this.limit = Number(res.headers.get('x-ratelimit-limit') || Infinity);
      this.timeout = (Number(res.headers.get('x-ratelimit-reset')) * 1e3 || date) - date;
      this.resetTime = Date.now() + this.timeout;

      const remaining = Number(res.headers.get('x-ratelimit-remaining'));
      if (remaining < this.remaining || this.remaining < 0) this.remaining = remaining;

      // If this is the newest response, control queue flow based on ratelimiting
      if (request.seq >= this._latest) {
        if (this.limited && !this.queue.paused) this.queue.pause();
        else if (!this.limited && this.queue.paused) this.queue.resume();
        this._latest = request.seq;
      }

      // Ratelimit handling
      if (this.limited) {
        if (!timeout) timeout = this.timeout;
        timeout += this.client.options.restTimeOffset;

        /**
         * Emitted when the client hits a rate limit while making a request
         * @event Client#rateLimit
         * @param {Object} rateLimitInfo Object containing the rate limit info
         * @param {number} rateLimitInfo.timeout Timeout in ms
         * @param {number} rateLimitInfo.limit Number of requests that can be made to this endpoint
         * @param {string} rateLimitInfo.method HTTP method used for request that triggered this event
         * @param {string} rateLimitInfo.path Path used for request that triggered this event
         * @param {string} rateLimitInfo.route Route used for request that triggered this event
         */
        this.client.emit(RATE_LIMIT, {
          timeout,
          limit: this.limit,
          method: request.method,
          path: request.path,
          route: request.route,
        });

        // NOTE: Use Timer#refresh (if the timeout is the same) when targeting Node 10
        if (this._timer) clearTimeout(this._timer);
        this._timer = this.client.setTimeout(() => {
          this._timer = null;
          this.reset();
          this.queue.resume();
        }, timeout);
      }
    }, cb);
  }
  /* eslint-enable callback-return */

  reset() {
    this.manager.globallyRateLimited = false;
    this.remaining = this.limit;
  }
}

module.exports = RequestBucket;
