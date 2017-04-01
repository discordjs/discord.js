"use strict";

/**
* Ratelimit requests and release in sequence
* @prop {Number} limit How many tokens the bucket can consume in the current interval
* @prop {Number} remaining How many tokens the bucket has left in the current interval
* @prop {Number} reset Timestamp of next reset
* @prop {Boolean} processing Whether the queue is being processed
*/
class SequentialBucket {
    /**
    * Construct a SequentialBucket
    * @arg {Number} tokenLimit The max number of tokens the bucket can consume per interval
    * @arg {Object} [latencyRef] An object
    * @arg {Number} latencyRef.latency Interval between consuming tokens
    */
    constructor(limit, latencyRef) {
        this.limit = this.remaining = limit;
        this.resetInterval = 0;
        this.reset = 0;
        this.processing = false;
        this.latencyRef = latencyRef || {
            latency: 0
        };
        this._queue = [];
    }

    /**
    * Queue something in the SequentialBucket
    * @arg {Function} func A function to call when a token can be consumed. The function will be passed a callback argument, which must be called to allow the bucket to continue to work
    */
    queue(func, short) {
        if(short) {
            this._queue.unshift(func);
        } else {
            this._queue.push(func);
        }
        this.check();
    }

    check(override) {
        if((this.processing && !override) || this._queue.length === 0) {
            return;
        }
        this.processing = true;
        if(this.reset && this.reset < Date.now() - this.latencyRef.latency) {
            this.reset = this.resetInterval ? Date.now() - this.latencyRef.latency + this.resetInterval : 0;
            this.remaining = this.limit;
        }
        this.last = Date.now();
        if(this.remaining <= 0) {
            return setTimeout(() => {
                this.check(true);
            }, Math.max(0, this.reset || 0 - Date.now()) + this.latencyRef.latency);
        }
        --this.remaining;
        this._queue.shift()(() => {
            if(this._queue.length > 0) {
                this.check(true);
            } else {
                this.processing = false;
            }
        });
    }
}

module.exports = SequentialBucket;
