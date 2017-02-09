const RequestHandler = require('./RequestHandler');

class BurstRequestHandler extends RequestHandler {
  constructor(restManager, endpoint) {
    super(restManager, endpoint);

    this.client = restManager.client;

    this.limit = Infinity;
    this.resetTime = null;
    this.remaining = 1;
    this.timeDifference = 0;

    this.first = true;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  execute(item) {
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
          this.client.setTimeout(() => {
            this.globalLimit = false;
            this.remaining = this.limit;
            this.handle();
          }, Number(res.headers['retry-after']) + this.client.options.restTimeOffset);
        } else {
          item.reject(err);
        }
      } else {
        this.globalLimit = false;
        const data = res && res.body ? res.body : {};
        item.resolve(data);
        if (this.first) {
          this.first = false;
          this.handle();
        }
      }
    });
  }

  handle() {
    super.handle();
    if (this.remaining <= 0 || this.queue.length === 0 || this.globalLimit) return;
    this.execute(this.queue.shift());
  }
}

module.exports = BurstRequestHandler;
