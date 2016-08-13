class Bucket {
  constructor(rest, limit, remainingRequests = 1, resetTime) {
    this.rest = rest;
    this.limit = limit;
    this.remainingRequests = remainingRequests;
    this.resetTime = resetTime;
    this.locked = false;
    this.queue = [];
    this.nextCheck = null;
  }

  setCheck(time) {
    clearTimeout(this.nextCheck);
    console.log('going to iterate in', time, 'remaining:', this.queue.length);
    this.nextCheck = setTimeout(() => {
      this.remainingRequests = this.limit - 1;
      this.locked = false;
      this.process();
    }, time);
  }

  process() {
    if (this.locked) {
      return;
    }

    this.locked = true;

    if (this.queue.length === 0) {
      return;
    }

    if (this.remainingRequests === 0) {
      return;
    }
    console.log('bucket is going to iterate', Math.min(this.remainingRequests, this.queue.length), 'items with max', this.limit, 'and remaining', this.remainingRequests);
    while (Math.min(this.remainingRequests, this.queue.length) > 0) {
      const item = this.queue.shift();
      item.request.gen().end((err, res) => {
        if (res && res.headers) {
          this.limit = res.headers['x-ratelimit-limit'];
          this.resetTime = Number(res.headers['x-ratelimit-reset']) * 1000;
          this.setCheck((Math.max(500, this.resetTime - Date.now())) + 1000);
        }
        if (err) {
          console.log(err.status, this.remainingRequests);
          item.reject(err);
        } else {
          item.resolve(res && res.body ? res.body : {});
        }
      });
      this.remainingRequests--;
    }
  }

  add(method) {
    this.queue.push(method);
    this.process();
  }
}

module.exports = Bucket;
