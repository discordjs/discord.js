"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Bucket {
    // Adapted from Eris
    constructor(tokenLimit, interval) {
        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.extraTime = 500;
        this.lastReset = this.tokens = this.lastSend = 0;
        this._queue = [];
    }

    queue(func) {
        this._queue.push(func);
        this.check();
    }

    check() {
        if (this.timeout || this._queue.length === 0) {
            return;
        }
        if (this.lastReset + this.interval + this.extraTime < Date.now()) {
            this.lastReset = Date.now();
            this.tokens = Math.max(0, this.tokens - this.tokenLimit);
        }

        var val;
        while (this._queue.length > 0 && this.tokens < this.tokenLimit) {
            this.tokens++;
            this._queue.shift()();
            this.lastSend = Date.now();
        }

        if (this._queue.length > 0 && !this.timeout) {
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.check();
            }, this.tokens < this.tokenLimit ? 1 : Math.max(0, this.lastReset + this.interval + this.extraTime - Date.now()));
        }
    }
}
exports.default = Bucket;
//# sourceMappingURL=Bucket.js.map
