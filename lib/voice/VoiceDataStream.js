"use strict";

var EventEmitter;
try {
    EventEmitter = require("eventemitter3");
} catch(err) {
    EventEmitter = require("events").EventEmitter;
}

/**
* Represents a voice data stream
* @extends EventEmitter
* @prop {String} type The targeted voice data type for the stream, either "opus" or "pcm"
*/
class VoiceDataStream extends EventEmitter {
    constructor(type) {
        super();
        this.type = type;
    }
}

module.exports = VoiceDataStream;
