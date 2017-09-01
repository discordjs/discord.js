const RequestHandler = require('./RequestHandler');
const DiscordAPIError = require('../DiscordAPIError');

class BurstRequestHandler extends RequestHandler {
  constructor(restManager, endpoint) {
    super(restManager, endpoint);

    this.client = restManager.client;

    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;
    this.timeDifference = 0;

    this.resetTimeout = null;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  execute(item) {
    if (!item) return;
    item.request.gen().end((err, res) => {
      if (res && res.headers) {
        this.limit = Number(res.headers['x-ratelimit-limit']);
        this.resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
        this.remaining = Number(res.headers['x-ratelimit-remaining']);
        this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
      }
      if (err) {
        if (err.status === 429) {
          this.queue.unshift(item);
          if (res.headers['x-ratelimit-global']) this.globalLimit = true;
          if (this.resetTimeout) return;
          this.resetTimeout = this.client.setTimeout(() => {
            this.remaining = this.limit;
            this.globalLimit = false;
            this.handle();
            this.resetTimeout = null;
          }, Number(res.headers['retry-after']) + this.client.options.restTimeOffset);
        } else if (err.status >= 500 && err.status < 600) {
          this.queue.unshift(item);
          this.resetTimeout = this.client.setTimeout(() => {
            this.handle();
            this.resetTimeout = null;
          }, 1e3 + this.client.options.restTimeOffset);
        } else {
          item.reject(err.status >= 400 && err.status < 500 ? new DiscordAPIError(res.request.path, res.body) : err);
          this.handle();
        }
      } else {
        this.globalLimit = false;
        const data = res && res.body ? res.body : {};
        item.resolve(data);
        this.handle();
      }
    });
  }

  handle() {
    super.handle();
    if (this.remaining <= 0 || this.queue.length === 0 || this.globalLimit) return;
    this.execute(this.queue.shift());
    this.remaining--;
    this.handle();
  }
}

module.exports = BurstRequestHandler;
