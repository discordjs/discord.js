const RequestHandler = require('./RequestHandler');

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
     * Whether this rate limiter is waiting for a response from a request
     * @type {boolean}
     */
    this.waiting = false;

    /**
     * The endpoint that this handler is handling
     * @type {string}
     */
    this.endpoint = endpoint;

    /**
     * The time difference between Discord's Dates and the local computer's Dates. A positive number means the local
     * computer's time is ahead of Discord's.
     * @type {number}
     */
    this.timeDifference = 0;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  /**
   * Performs a request then resolves a promise to indicate its readiness for a new request
   * @param {APIRequest} item The item to execute
   * @returns {Promise<?Object|Error>}
   */
  execute(item) {
    return new Promise(resolve => {
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          this.requestLimit = res.headers['x-ratelimit-limit'];
          this.requestResetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.requestRemaining = Number(res.headers['x-ratelimit-remaining']);
          this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
        }
        if (err) {
          if (err.status === 429) {
            this.restManager.client.setTimeout(() => {
              this.waiting = false;
              this.globalLimit = false;
              resolve();
            }, Number(res.headers['retry-after']) + this.restManager.client.options.restTimeOffset);
            if (res.headers['x-ratelimit-global']) this.globalLimit = true;
          } else {
            this.queue.shift();
            this.waiting = false;
            item.reject(err);
            resolve(err);
          }
        } else {
          this.queue.shift();
          this.globalLimit = false;
          const data = res && res.body ? res.body : {};
          item.resolve(data);
          if (this.requestRemaining === 0) {
            this.restManager.client.setTimeout(
              () => {
                this.waiting = false;
                resolve(data);
              },
              this.requestResetTime - Date.now() + this.timeDifference + this.restManager.client.options.restTimeOffset
            );
          } else {
            this.waiting = false;
            resolve(data);
          }
        }
      });
    });
  }

  handle() {
    super.handle();

    if (this.waiting || this.queue.length === 0 || this.globalLimit) return;
    this.waiting = true;

    const item = this.queue[0];
    this.execute(item).then(() => this.handle());
  }
}

module.exports = SequentialRequestHandler;
