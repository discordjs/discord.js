"use strict";

const BaseTransformer = require("./BaseTransformer");

// EBML VInt max value is (2 ^ 56 - 2), but JS only supports 2^53
// 45 = 53 - 8 - check before last 8 bytes
const MAX_SHIFTED_VINT = Math.pow(2, 45);

const STATE_CONTENT = 0;
const STATE_TAG = 1;

const TAG_TYPE_END = 0;
const TAG_TYPE_START = 1;
const TAG_TYPE_TAG = 2;

const TRACKTYPE_AUDIO = 2; // EBML spec: https://www.matroska.org/technical/specs/index.html#TrackType

class WebmOpusTransformer extends BaseTransformer {
    constructor(options) {
        options = options || {};
        super(options);

        this._tag_stack = [];
        this._state = STATE_TAG;
        this._total = 0;
    }

    process(type, info) {
        if(type === TAG_TYPE_TAG) {
            if(info.name === "SimpleBlock" && (info.data.readUInt8(0) & 0xF) === this.firstAudioTrack.TrackNumber) {
                this.push(info.data.slice(4));
                return;
            }
            if(info.name === "CodecPrivate") {
                var head = info.data.toString("utf8", 0, 8);
                if(head !== "OpusHead") {
                    this.emit("error", new Error("Invalid codec: " + head));
                    return;
                }

                this.codecData = {
                    version: info.data.readUInt8(8),
                    channelCount: info.data.readUInt8(9),
                    preSkip: info.data.readUInt16LE(10),
                    inputSampleRate: info.data.readUInt32LE(12),
                    outputGain: info.data.readUInt16LE(16),
                    mappingFamily: info.data.readUInt8(18)
                };
                return;
            }
        }

        if(!this.firstAudioTrack) {
            if(info.name === "TrackEntry") {
                if(type === TAG_TYPE_START) {
                    this.parsingTrack = {};
                } else if(type === TAG_TYPE_END) {
                    if(this.parsingTrack.TrackNumber && this.parsingTrack.TrackType === TRACKTYPE_AUDIO) {
                        this.firstAudioTrack = this.parsingTrack;
                    }
                    delete this.parsingTrack;
                }
                return;
            }
            if(this.parsingTrack) {
                if(info.name === "TrackNumber") {
                    this.parsingTrack.TrackNumber = info.data[0];
                    return;
                }
                if(info.name === "TrackType") {
                    this.parsingTrack.TrackType = info.data[0];
                    return;
                }
            }
            if(type === TAG_TYPE_END && info.name === "Tracks") {
                this.emit("error", new Error("No audio track"));
                return;
            }
            return;
        }
    }

    getVIntLength(buffer, index) {
        for(var length = 1; length <= 8; ++length) {
            if(buffer[index] & (1 << (8 - length))) {
                break;
            }
        }
        if(length > 8) {
            this.emit("debug", new Error(`VInt length ${length} | ${buffer.toString("hex", index, index + length)}`));
            return null;
        }
        if(index + length > buffer.length) {
            return null;
        }
        return length;
    }

    readTag(buffer) {
        var tagSize = this.getVIntLength(buffer, buffer._index);
        if(tagSize === null) {
            return false;
        }

        var size = this.getVIntLength(buffer, buffer._index + tagSize);
        if(size === null) {
            return false;
        }

        var tagStr = buffer.toString("hex", buffer._index, buffer._index + tagSize);

        var tagObj = {
            type: "unknown",
            name: "unknown",
            end: this._total + tagSize
        };
        if(schema[tagStr]) {
            tagObj.type = schema[tagStr].type;
            tagObj.name = schema[tagStr].name;
        }

        buffer._index += tagSize;

        var value = buffer[buffer._index] & (1 << (8 - size)) - 1;
        for(var i = 1; i < size; ++i) {
            if(i === 7 && value >= MAX_SHIFTED_VINT && buffer[buffer._index + 7] > 0) {
                tagObj.end = -1; // Special livestreaming int 0x1FFFFFFFFFFFFFF
                break;
            }
            value = (value << 8) + buffer[buffer._index + i];
        }
        if(tagObj.end !== -1) {
            tagObj.end += value + size;
        }
        tagObj.size = value;

        buffer._index += size;
        this._total += tagSize + size;
        this._state = STATE_CONTENT;

        this._tag_stack.push(tagObj);

        return true;
    }

    readContent(buffer) {
        var tagObj = this._tag_stack[this._tag_stack.length - 1];

        if(tagObj.type === "m") {
            this.process(TAG_TYPE_START, tagObj);
            this._state = STATE_TAG;
            return true;
        }

        if(buffer.length < buffer._index + tagObj.size) {
            return false;
        }

        tagObj.data = buffer.slice(buffer._index, buffer._index + tagObj.size);
        buffer._index += tagObj.size;
        this._total += tagObj.size;
        this._state = STATE_TAG;

        this._tag_stack.pop();

        this.process(TAG_TYPE_TAG, tagObj);

        while(this._tag_stack.length > 0) {
            if(this._total < this._tag_stack[this._tag_stack.length - 1].end) {
                break;
            }
            this.process(TAG_TYPE_END, this._tag_stack.pop());
        }

        return true;
    }

    _transform(chunk, enc, cb) {
        if(this._remainder)  {
            chunk = Buffer.concat([this._remainder, chunk]);
            this._remainder = null;
        }

        chunk._index = 0;

        while(chunk._index < chunk.length) {
            if(this._state === STATE_TAG && !this.readTag(chunk)) {
                break;
            }
            if(this._state === STATE_CONTENT && !this.readContent(chunk)) {
                break;
            }
        }

        if(chunk._index < chunk.length) {
            this._remainder = chunk.slice(chunk._index);
        }

        this.setTransformCB(cb);
    }
}

module.exports = WebmOpusTransformer;

const schema = {
    ae: {
        name: "TrackEntry",
        type: "m"
    },
    d7: {
        name: "TrackNumber",
        type: "u"
    },
    "86": {
        name: "CodecID",
        type: "s"
    },
    "83": {
        name: "TrackType",
        type: "u"
    },
    "1654ae6b": {
        name: "Tracks",
        type: "m"
    },
    "63a2": {
        name: "CodecPrivate",
        type: "b"
    },
    a3: {
        name: "SimpleBlock",
        type: "b"
    },
    "1a45dfa3": {
        name: "EBML",
        type: "m"
    },
    "18538067": {
        name: "Segment",
        type: "m"
    },
    "114d9b74": {
        name: "SeekHead",
        type: "m"
    },
    "1549a966": {
        name: "Info",
        type: "m"
    },
    e1: {
        name: "Audio",
        type: "m"
    },
    "1f43b675": {
        name: "Cluster",
        type: "m"
    }
};
