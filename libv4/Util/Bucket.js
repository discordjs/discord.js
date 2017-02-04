"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bucket = function () {
    // Adapted from Eris
    function Bucket(tokenLimit, interval) {
        _classCallCheck(this, Bucket);

        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.extraTime = 500;
        this.lastReset = this.tokens = this.lastSend = 0;
        this._queue = [];
    }

    _createClass(Bucket, [{
        key: "queue",
        value: function queue(func) {
            this._queue.push(func);
            this.check();
        }
    }, {
        key: "check",
        value: function check() {
            var _this = this;

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
                this.timeout = setTimeout(function () {
                    _this.timeout = null;
                    _this.check();
                }, this.tokens < this.tokenLimit ? 1 : Math.max(0, this.lastReset + this.interval + this.extraTime - Date.now()));
            }
        }
    }]);

    return Bucket;
}();

exports.default = Bucket;
//# sourceMappingURL=Bucket.js.map
