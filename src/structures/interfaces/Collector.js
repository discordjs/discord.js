const Collection = require('../../util/Collection');
const EventEmitter = require('events').EventEmitter;

class Collector extends EventEmitter {
  constructor(client, filter, options = {}) {
    super();
    this.client = client;
    this.filter = filter;
    this.options = options;
    this.collected = new Collection();
    this.ended = false;
    this.timeout = null;

    this.listener = this._handle.bind(this);
    if (options.time) this.timeout = this.client.setTimeout(() => this.stop('time'), options.time);

    this.initialize();
  }

  _handle(...args) {
    const collect = this.handle(...args);
    if (!collect || !this.filter(...args)) return;

    this.collected.set(...collect);
    this.emit('collect', ...args, this);

    const post = this.postCheck(...args);
    if (post) this.stop(post);
  }

  get next() {
    return new Promise((resolve, reject) => {
      if (this.ended) {
        reject(this.collected);
        return;
      }

      const cleanup = () => {
        this.removeListener('collect', onCollect);
        this.removeListener('end', onEnd);
      };

      const onCollect = item => {
        cleanup();
        resolve(item);
      };

      const onEnd = item => {
        cleanup();
        reject(item); // eslint-disable-line prefer-promise-reject-errors
      };

      this.on('collect', onCollect);
      this.on('end', onEnd);
    });
  }

  stop(reason = 'user') {
    if (this.ended) return;
    if (this.timeout) this.client.clearTimeout(this.timeout);

    this.ended = true;
    this.cleanup();
    this.emit('end', this.collected, reason);
  }

  /* eslint-disable no-empty-function */
  handle() {}
  postCheck() {}
  initialize() {}
  cleanup() {}
  /* eslint-enable no-empty-function */
}

module.exports = Collector;
