module.exports = function burst() {
  if (this.limited) return;
  this.execute(this.queue.shift()).then(time => {
    if (time || this.remaining <= 0) {
      this.client.setTimeout(() => {
        this.reset();
        this.handle();
      }, time || (this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset));
    } else {
      this.handle();
    }
  });
  this.remaining--;
  this.handle();
};
