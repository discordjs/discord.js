"use strict";

const BaseTransformer = require("./BaseTransformer");

class DCAOpusTransformer extends BaseTransformer {
    constructor(options) {
        options = options || {};
        super(options);

        this._remainder = null;
    }

    process(buffer) {
        if(buffer.length - buffer._index < 2) {
            return true;
        }

        var opusLen = buffer.readUInt16LE(buffer._index);
        buffer._index += 2;

        if(buffer.length - buffer._index < opusLen) {
            return false;
        }

        buffer._index += opusLen;
        this.push(buffer.slice(buffer._index - opusLen, buffer._index));
    }

    _transform(chunk, enc, cb) {
        if(this._remainder)  {
            chunk = Buffer.concat([this._remainder, chunk]);
            this._remainder = null;
        }

        if(!this.head) {
            if(chunk.length < 4) {
                this._remainder = chunk;
                return cb();
            } else {
                var dcaVersion = chunk.slice(0, 4);
                if(dcaVersion[0] !== 68 || dcaVersion[1] !== 67 || dcaVersion[2] !== 65) { // DCA0 or invalid
                    this.emit("error", new Error("Not a DCA file"));
                } else if(dcaVersion[3] === 49) { // DCA1
                    if(chunk.length < 8) {
                        this._remainder = chunk;
                        return cb();
                    }
                    var jsonLength = chunk.slice(4, 8).readInt32LE(0);
                    if(chunk.length < 8 + jsonLength) {
                        this._remainder = chunk;
                        return cb();
                    }
                    var jsonMetadata = chunk.slice(8, 8 + jsonLength);
                    this.emit("debug", jsonMetadata);
                    chunk = chunk.slice(8 + jsonLength);
                } else {
                    this.emit("error", new Error("Unsupported DCA version: " + dcaVersion.toString()));
                }
            }
        }

        chunk._index = 0;

        while(chunk._index < chunk.length) {
            var offset = chunk._index;
            var ret = this.process(chunk);
            if(ret) {
                this._remainder = chunk.slice(offset);
                cb();
                return;
            }
        }

        this.setTransformCB(cb);
    }
}

module.exports = DCAOpusTransformer;
