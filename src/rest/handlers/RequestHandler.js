const DiscordAPIError = require('../DiscordAPIError');
const { Events: { RATELIMITED } } = require('../../util/Constants');

class RequestHandler {
  constructor(manager, handler) {
    this.manager = manager;
    this.client = this.manager.client;
    this.handle = handler.bind(this);
    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;
    this.timeDifference = 0;

    this.queue = [];
  }

  get limited() {
    return this.manager.globallyRateLimited || this.remaining <= 0;
  }

  set globallyLimited(limited) {
    this.manager.globallyRateLimited = limited;
  }

  push(request) {
    this.queue.push(request);
    this.handle();
  }

  execute(item) {
    return new Promise((resolve, reject) => {
      const finish = timeout => {
        if (timeout || this.limited) {
          if (!timeout) {
            timeout = this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset;
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ timeout });
          if (this.client.listenerCount(RATELIMITED)) {
            this.client.emit(RATELIMITED, {
              timeout,
              limit: this.limit,
              timeDifference: this.timeDifference,
              method: item.request.method,
              path: item.request.path,
              route: item.request.route,
            });
          }
        } else {
          resolve();
        }
      };
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          if (res.headers['x-ratelimit-global']) this.globallyLimited = true;
          this.limit = Number(res.headers['x-ratelimit-limit']);
          this.resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.remaining = Number(res.headers['x-ratelimit-remaining']);
          this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
        }
        if (err) {
          if (err.status === 429) {
            this.queue.unshift(item);
            finish(Number(res.headers['retry-after']) + this.client.options.restTimeOffset);
          } else if (err.status >= 500 && err.status < 600) {
            this.queue.unshift(item);
            finish(1e3 + this.client.options.restTimeOffset);
          } else {
            item.reject(err.status >= 400 && err.status < 500 ? new DiscordAPIError(res.request.path, res.body) : err);
            finish();
          }
        } else {
          const data = res && res.body ? res.body : {};
          item.resolve(data);
          finish();
        }
      });
    });
  }

  reset() {
    this.globallyLimited = false;
    this.remaining = 1;
  }
}

module.exports = RequestHandler;
