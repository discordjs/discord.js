"use strict";

/**
* Handle ratelimiting something
* @prop {Number} tokens How many tokens the bucket has consumed in this interval
* @prop {Number} lastReset Timestamp of last token clearing
* @prop {Number} lastSend Timestamp of last token consumption
* @prop {Number} tokenLimit The max number tokens the bucket can consume per interval
* @prop {Number} interval How long (in ms) to wait between clearing used tokens
*/
class Bucket {
    /**
    * Construct a Bucket
    * @arg {Number} tokenLimit The max number of tokens the bucket can consume per interval
    * @arg {Number} interval How long (in ms) to wait between clearing used tokens
    * @arg {Object} [latencyRef] An object
    * @arg {Number} latencyRef.latency Interval between consuming tokens
    */
    constructor(tokenLimit, interval, latencyRef) {
        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.latencyRef = latencyRef || {
            latency: 0
        };
        this.lastReset = this.tokens = this.lastSend = 0;
        this._queue = [];
    }

    /**
    * Queue something in the Bucket
    * @arg {Function} func A callback to call when a token can be consumed
    */
    queue(func) {
        this._queue.push(func);
        this.check();
    }

    check() {
        if(this.timeout || this._queue.length === 0) {
            return;
        }
        if(this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency < Date.now()) {
            this.lastReset = Date.now();
            this.tokens = Math.max(0, this.tokens - this.tokenLimit);
        }

        var val;
        while(this._queue.length > 0 && this.tokens < this.tokenLimit) {
            this.tokens++;
            let item = this._queue.shift();
            val = this.latencyRef.latency - Date.now() + this.lastSend;
            if(this.latencyRef.latency === 0 || val <= 0) {
                item();
                this.lastSend = Date.now();
            } else {
                setTimeout(() => {
                    item();
                }, val);
                this.lastSend = Date.now() + val;
            }
        }

        if(this._queue.length > 0 && !this.timeout) {
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.check();
            }, this.tokens < this.tokenLimit ? this.latencyRef.latency : Math.max(0, this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency - Date.now()));
        }
    }
}

module.exports = Bucket;
