const RequestHandler = require('./RequestHandler');

class BurstRequestHandler extends RequestHandler {
  constructor(restManager, endpoint) {
    super(restManager, endpoint);
    this.requestRemaining = 1;
    this.first = true;
  }

  push(request) {
    super.push(request);
    this.handle();
  }

  handleNext(time) {
    if (this.waiting) return;
    this.waiting = true;
    this.restManager.client.setTimeout(() => {
      this.requestRemaining = this.requestLimit;
      this.waiting = false;
      this.handle();
    }, time);
  }

  execute(item) {
    item.request.gen().end((err, res) => {
      if (res && res.headers) {
        this.requestLimit = res.headers['x-ratelimit-limit'];
        this.requestResetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
        this.requestRemaining = Number(res.headers['x-ratelimit-remaining']);
        this.timeDifference = Date.now() - new Date(res.headers.date).getTime();
        this.handleNext((this.requestResetTime - Date.now()) + this.timeDifference + 1000);
      }
      if (err) {
        if (err.status === 429) {
          this.requestRemaining = 0;
          this.queue.unshift(item);
          this.restManager.client.setTimeout(() => {
            this.globalLimit = false;
            this.handle();
          }, Number(res.headers['retry-after']) + 500);
          if (res.headers['x-ratelimit-global']) {
            this.globalLimit = true;
          }
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
    if (this.requestRemaining < 1 || this.queue.length === 0 || this.globalLimit) return;
    while (this.queue.length > 0 && this.requestRemaining > 0) {
      this.execute(this.queue.shift());
      this.requestRemaining--;
    }
  }
}

module.exports = BurstRequestHandler;
