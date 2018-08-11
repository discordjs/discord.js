const RequestHandler = require('./RequestHandler');
const DiscordAPIError = require('../DiscordAPIError');
const { Events: { RATE_LIMIT } } = require('../../../util/Constants');

/**
 * Handles API Requests sequentially, i.e. we wait until the current request is finished before moving onto
 * the next. This plays a _lot_ nicer in terms of avoiding 429's when there is more than one session of the account,
 * but it can be slower.
 * @extends {RequestHandler}
 * @private
 */
class SequentialRequestHandler extends RequestHandler {
  /**
   * @param {RESTManager} restManager The REST manager to use
   * @param {string} endpoint The endpoint to handle
   */
  constructor(restManager, endpoint) {
    super(restManager, endpoint);

    /**
     * The client that instantiated this handler
     * @type {Client}
     */
    this.client = restManager.client;

    /**
     * The endpoint that this handler is handling
     * @type {string}
     */
    this.endpoint = endpoint;

    /**
     * The time difference between Discord's Dates and the local computer's Dates. A positive number means the local
     * computer's time is ahead of Discord's
     * @type {number}
     */
    this.timeDifference = 0;

    /**
     * Whether the queue is being processed or not
     * @type {boolean}
     */
    this.busy = false;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  /**
   * Performs a request then resolves a promise to indicate its readiness for a new request.
   * @param {APIRequest} item The item to execute
   * @returns {Promise<?Object|Error>}
   */
  execute(item) {
    this.busy = true;
    return new Promise(resolve => {
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          this.requestLimit = Number(res.headers['x-ratelimit-limit']);
          this.requestResetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.requestRemaining = Number(res.headers['x-ratelimit-remaining']);
          this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
        }
        if (err) {
          if (err.status === 429) {
            this.queue.unshift(item);
            this.restManager.client.setTimeout(() => {
              this.globalLimit = false;
              resolve();
            }, Number(res.headers['retry-after']) + this.restManager.client.options.restTimeOffset);
            if (res.headers['x-ratelimit-global']) this.globalLimit = true;
          } else if (err.status >= 500 && err.status < 600) {
            this.queue.unshift(item);
            this.restManager.client.setTimeout(resolve, 1e3 + this.restManager.client.options.restTimeOffset);
          } else {
            item.reject(err.status >= 400 && err.status < 500 ?
              new DiscordAPIError(res.request.path, res.body, res.request.method) : err);
            resolve(err);
          }
        } else {
          this.globalLimit = false;
          const data = res && res.body ? res.body : {};
          item.resolve(data);
          if (this.requestRemaining === 0) {
            if (this.client.listenerCount(RATE_LIMIT)) {
              /**
               * Emitted when the client hits a rate limit while making a request
               * @event Client#rateLimit
               * @param {Object} rateLimitInfo Object containing the rate limit info
               * @param {number} rateLimitInfo.requestLimit Number of requests that can be made to this endpoint
               * @param {number} rateLimitInfo.timeDifference Delta-T in ms between your system and Discord servers
               * @param {string} rateLimitInfo.method HTTP method used for request that triggered this event
               * @param {string} rateLimitInfo.path Path used for request that triggered this event
               */
              this.client.emit(RATE_LIMIT, {
                limit: this.requestLimit,
                timeDifference: this.timeDifference,
                path: item.request.path,
                method: item.request.method,
              });
            }
            this.restManager.client.setTimeout(
              () => resolve(data),
              this.requestResetTime - Date.now() + this.timeDifference + this.restManager.client.options.restTimeOffset
            );
          } else {
            resolve(data);
          }
        }
      });
    });
  }

  handle() {
    super.handle();
    if (this.busy || this.remaining === 0 || this.queue.length === 0 || this.globalLimit) return;
    this.execute(this.queue.shift()).then(() => {
      this.busy = false;
      this.handle();
    });
  }
}

module.exports = SequentialRequestHandler;
