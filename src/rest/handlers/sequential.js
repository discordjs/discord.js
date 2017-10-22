module.exports = function sequential() {
  if (this.busy || this.limited || this.queue.length === 0) return;
  this.busy = true;
  this.execute(this.queue.shift())
    .then(() => {
      this.busy = false;
      this.handle();
    })
    .catch(({ timeout }) => {
      this.client.setTimeout(() => {
        this.reset();
        this.busy = false;
        this.handle();
      }, timeout || (this.resetTime - Date.now() + this.timeDifference + this.client.options.restTimeOffset));
    });
};
