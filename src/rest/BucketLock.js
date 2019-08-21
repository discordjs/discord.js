'use strict';

const { createPromiseObject } = require('../util/Util');

class BucketLock {
  constructor(hash) {
    this.hash = hash;

    this.limit = -1;
    this.remaining = -1;
    this.reset = -1;
    this.retryAfter = -1;

    this._locks = [];
  }

  acquireLock() {
    const lock = createPromiseObject();
    this._locks.push(lock);
    lock.promise.finally(() => {
      this._locks.splice(this._locks.indexOf(lock), 1);
    });

    return lock.resolve;
  }

  waitLock() {
    return Promise.all(this._locks.map(lock => lock.promise));
  }

  _patch(limit, remaining, reset, retryAfter) {
    this.limit = limit;
    this.remaining = remaining;
    this.reset = reset;
    this.retryAfter = retryAfter;
  }
}

module.exports = BucketLock;
