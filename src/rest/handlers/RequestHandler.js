const DiscordAPIError = require('../DiscordAPIError');
const { Events: { RATE_LIMIT }, browser } = require('../../util/Constants');

function parseResponse(res) {
  if (res.headers.get('content-type').startsWith('application/json')) return res.json();
  if (browser) return res.blob();
  return res.buffer();
}

class RequestHandler {
  constructor(manager, handler) {
    this.manager = manager;
    this.client = this.manager.client;
    this.handle = handler.bind(this);
    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;
    this.busy = false;
    this.queue = [];
  }

  get limited() {
    return (this.manager.globallyRateLimited || this.remaining <= 0) && Date.now() < this.resetTime;
  }

  push(request) {
    this.queue.push(request);
    this.handle();
  }

  get _inactive() {
    return this.queue.length === 0 && !this.limited && this.busy !== true;
  }

  /* eslint-disable prefer-promise-reject-errors */
  execute(item) {
    return new Promise((resolve, reject) => {
      const finish = timeout => {
        if (timeout || this.limited) {
          if (!timeout) {
            timeout = this.resetTime - Date.now() + this.client.options.restTimeOffset;
          }
          if (!this.manager.globalTimeout && this.manager.globallyRateLimited) {
            this.manager.globalTimeout = setTimeout(() => {
              this.manager.globalTimeout = undefined;
              this.manager.globallyRateLimited = false;
              this.busy = false;
              this.handle();
            }, timeout);
            reject({ });
          } else {
            reject({ timeout });
          }
          if (this.client.listenerCount(RATE_LIMIT)) {
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
              method: item.request.method,
              path: item.request.path,
              route: item.request.route,
            });
          }
        } else {
          resolve();
        }
      };
      item.request.make().then(res => {
        if (res && res.headers) {
          if (res.headers.get('x-ratelimit-global')) this.manager.globallyRateLimited = true;
          this.limit = Number(res.headers.get('x-ratelimit-limit') || Infinity);
          const reset = res.headers.get('x-ratelimit-reset');
          this.resetTime = reset !== null ?
            (Number(reset) * 1e3) - new Date(res.headers.get('date') || Date.now()).getTime() + Date.now() :
            Date.now();
          const remaining = res.headers.get('x-ratelimit-remaining');
          this.remaining = remaining !== null ? Number(remaining) : 1;
        }

        if (res.ok) {
          parseResponse(res).then(item.resolve, item.reject);
          finish();
          return;
        }

        if (res.status === 429) {
          this.queue.unshift(item);
          finish(Number(res.headers.get('retry-after')) + this.client.options.restTimeOffset);
        } else if (res.status >= 500 && res.status < 600) {
          if (item.retried) {
            item.reject(res);
            finish();
          } else {
            item.retried = true;
            this.queue.unshift(item);
            finish(1e3 + this.client.options.restTimeOffset);
          }
        } else {
          parseResponse(res).then(data => {
            item.reject(res.status >= 400 && res.status < 500 ?
              new DiscordAPIError(item.request.route, data, item.request.method) : res);
          }, item.reject);
          finish();
        }
      });
    });
  }

  reset() {
    this.manager.globallyRateLimited = false;
    this.remaining = 1;
  }
}

module.exports = RequestHandler;
