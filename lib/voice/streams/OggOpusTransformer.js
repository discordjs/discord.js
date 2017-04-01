"use strict";

const BaseTransformer = require("./BaseTransformer");

class OggOpusTransformer extends BaseTransformer {
    constructor(options) {
        options = options || {};
        super(options);

        this._remainder = null;
    }

    process(buffer) {
        if(buffer.length - buffer._index <= 26) {
            return true;
        }

        if(buffer.toString("utf8", buffer._index, buffer._index + 4) !== "OggS") {
            return new Error("Invalid OGG magic string: " + buffer.toString("utf8", buffer._index, buffer._index + 4));
        }

        var typeFlag = buffer.readUInt8(buffer._index + 5);
        if(typeFlag === 1) {
            return new Error("OGG continued page not supported");
        }

        buffer._index += 26;

        var segmentCount = buffer.readUInt8(buffer._index);
        if(buffer.length - buffer._index - 1 < segmentCount) {
            return true;
        }

        var segments = [];
        var size = 0;
        var byte = 0;
        var total = 0;
        var i = 0;
        for(; i < segmentCount; i++) {
            byte = buffer.readUInt8(++buffer._index);
            if(byte < 255) {
                segments.push(size + byte);
                size = 0;
            } else {
                size += byte;
            }
            total += byte;
        }

        ++buffer._index;

        if(buffer.length - buffer._index < total) {
            return true;
        }

        for(var segment of segments) {
            buffer._index += segment;
            byte = (segment = buffer.slice(buffer._index - segment, buffer._index)).toString("utf8", 0, 8);
            if(this.head) {
                if(byte === "OpusTags") {
                    this.emit("debug", segment.toString());
                } else {
                    this.push(segment);
                }
            } else if(byte === "OpusHead") {
                this.emit("debug", (this.head = segment.toString()));
            } else {
                this.emit("error", new Error("Invalid codec: " + byte));
            }
        }
    }

    _transform(chunk, enc, cb) {
        if(this._remainder)  {
            chunk = Buffer.concat([this._remainder, chunk]);
            this._remainder = null;
        }

        chunk._index = 0;

        while(chunk._index < chunk.length) {
            var offset = chunk._index;
            var ret = this.process(chunk);
            if(ret) {
                this._remainder = chunk.slice(offset);
                if(ret instanceof Error) {
                    this.emit("error", ret);
                }
                cb();
                return;
            }
        }

        this.setTransformCB(cb);
    }
}

module.exports = OggOpusTransformer;
