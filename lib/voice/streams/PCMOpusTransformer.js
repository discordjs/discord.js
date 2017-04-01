"use strict";

const BaseTransformer = require("./BaseTransformer");

class PCMOpusTransformer extends BaseTransformer {
    constructor(options) {
        options = options || {};
        if(!options.opus) {
            throw new Error("Supported opus encoder not found");
        }
        super(options);

        this.opus = options.opus;
        this.frameSize = options.frameSize || 2880;
        this.pcmSize = options.pcmSize || 11520;

        this._remainder = null;
    }

    _transform(chunk, enc, cb) {
        if(this._remainder) {
            chunk = Buffer.concat([this._remainder, chunk]);
            this._remainder = null;
        }

        if(chunk.length < this.pcmSize) {
            this._remainder = chunk;
            return cb();
        }

        chunk._index = 0;

        while(chunk._index + this.pcmSize < chunk.length) {
            chunk._index += this.pcmSize;
            this.push(this.opus.encode(chunk.slice(chunk._index - this.pcmSize, chunk._index), this.frameSize));
        }

        if(chunk._index < chunk.length) {
            this._remainder = chunk.slice(chunk._index);
        }

        this.setTransformCB(cb);
    }

    _flush(cb) {
        if(this._remainder) {
            var buf = new Buffer(this.pcmSize);
            this._remainder.copy(buf);
            buf.fill(0, this._remainder.length);
            this.push(this.opus.encode(buf, this.frameSize));
            this._remainder = null;
        }
        cb();
    }
}

module.exports = PCMOpusTransformer;
