"use strict";

const BaseTransformer = require("./BaseTransformer");

class VolumeTransformer extends BaseTransformer {
    constructor(options) {
        options = options || {};
        super(options);

        this._remainder = null;
        this.setVolume(1.0);
    }

    setVolume(volume) {
        if(isNaN(volume) || (volume = +volume) < 0) {
            throw new Error("Invalid volume level: " + volume);
        }
        this.volume = volume;
        this.db = 10 * Math.log(1 + this.volume) / 6.931471805599453;
    }

    _transform(chunk, enc, cb) {
        if(this._remainder)  {
            chunk = Buffer.concat([this._remainder, chunk]);
            this._remainder = null;
        }

        if(chunk.length < 2) {
            return cb();
        }

        var buf;
        if(chunk.length & 1) {
            this._remainder = chunk.slice(chunk.length - 1);
            buf = new Buffer(chunk.length - 1);
        } else {
            buf = new Buffer(chunk.length);
        }

        for(var i = 0, num; i < buf.length - 1; i += 2) {
            // Bind transformed chunk to to 16 bit
            num = ~~(this.db * chunk.readInt16LE(i));
            buf.writeInt16LE(num >= 32767 ? 32767 : num <= -32767 ? -32767 : num, i);
        }

        this.push(buf);
        this.setTransformCB(cb);
    }
}

module.exports = VolumeTransformer;
