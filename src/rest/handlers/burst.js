module.exports = function burst() {
  if (this.limited || this.queue.length === 0) return;
  this.execute(this.queue.shift())
    .then(this.handle.bind(this))
    .catch(({ timeout }) => {
      this.client.setTimeout(() => {
        this.reset();
        this.handle();
      }, timeout || (this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset));
    });
  this.remaining--;
  this.handle();
};
