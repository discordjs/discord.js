module.exports = function sequential() {
  if (this.busy || this.limited) return;
  this.busy = true;
  this.execute(this.queue.shift()).then(time => {
    if (time || this.remaining <= 0) {
      this.client.setTimeout(() => {
        this.reset();
        this.busy = false;
        this.handle();
      }, time || (this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset));
    } else {
      this.busy = false;
      this.handle();
    }
  });
};
