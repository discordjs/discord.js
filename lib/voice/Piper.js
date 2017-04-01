"use strict";

const DCAOpusTransformer = require("./streams/DCAOpusTransformer");
const FFmpegOggTransformer = require("./streams/FFmpegOggTransformer");
const FFmpegPCMTransformer = require("./streams/FFmpegPCMTransformer");
const FS = require("fs");
const HTTP = require("http");
const HTTPS = require("https");
const OggOpusTransformer = require("./streams/OggOpusTransformer");
const PassThroughStream = require("stream").PassThrough;
const PCMOpusTransformer = require("./streams/PCMOpusTransformer");
const Stream = require("stream").Stream;
const VolumeTransformer = require("./streams/VolumeTransformer");
const WebmOpusTransformer = require("./streams/WebmOpusTransformer");

var EventEmitter;
try {
    EventEmitter = require("eventemitter3");
} catch(err) {
    EventEmitter = require("events").EventEmitter;
}

class Piper extends EventEmitter {
    constructor(converterCommand, opus) {
        super();

        this.reset();

        this.converterCommand = converterCommand;
        this._dataPackets = [];
        this._dataPacketMax = 30;
        this._dataPacketMin = 15;
        this.encoding = false;
        this.libopus = true;
        this.opus = opus;
        this.volumeLevel = 1;

        this._retransformer = [];

        // setInterval(() => console.log(this._dataPackets.length), 500);
    }

    encode(source, options) {
        if(this.encoding || this.streams.length) {
            this.emit("error", new Error("Already encoding"));
            return false;
        }

        if(typeof source === "string") {
            if(options.format === "dca" || options.format === "ogg" || options.format === "webm" || options.format === "pcm") {
                if(source.startsWith("http://") || source.startsWith("https://")) {
                    var passThrough = new PassThroughStream();
                    if(source.startsWith("http://")) {
                        HTTP.get(source, (res) => res.pipe(passThrough)).once("error", (e) => this.stop(e));
                    } else {
                        HTTPS.get(source, (res) => res.pipe(passThrough)).once("error", (e) => this.stop(e));
                    }
                    source = passThrough;
                } else {
                    try {
                        FS.statSync(source);
                    } catch(err) {
                        if(err.code === "ENOENT") {
                            this.emit("error", new Error("That file does not exist."));
                        } else {
                            this.emit("error", new Error("An error occured trying to access that file."));
                        }
                        return false;
                    }
                    source = FS.createReadStream(source);
                }
            }
        } else if(!(source instanceof Stream) || !source.pipe) {
            this.emit("error", new Error("Invalid source type"));
            return false;
        }

        if(typeof source !== "string") {
            this.streams.push(source.once("error", (e) => this.stop(e)));
        }

        this._dataPacketMax = 30;
        this._dataPacketMin = 15;

        if(options.format === "dca") {
            this.streams.push(source.pipe(new DCAOpusTransformer()).once("error", (e) => this.stop(e)));
        } else if(options.format === "ogg") {
            this.streams.push(source.pipe(new OggOpusTransformer()).once("error", (e) => this.stop(e)));
        } else if(options.format === "webm") {
            this.streams.push(source.pipe(new WebmOpusTransformer()).once("error", (e) => this.stop(e)));
        } else if(!options.format || options.format === "pcm") {
            if(options.inlineVolume) {
                if(!options.format) {
                    if(!this.converterCommand) {
                        this.emit("error", new Error("FFmpeg/avconv was not found on this system. Playback of this audio format is impossible"));
                        return false;
                    }
                    if(typeof source === "string") {
                        this.streams.push(source = new FFmpegPCMTransformer({
                            command: this.converterCommand,
                            input: source,
                            encoderArgs: options.encoderArgs,
                            inputArgs: options.inputArgs
                        }).once("error", (e) => this.stop(e)));
                    } else {
                        this.streams.push(source = source.pipe(new FFmpegPCMTransformer({
                            command: this.converterCommand,
                            encoderArgs: options.encoderArgs,
                            inputArgs: options.inputArgs
                        })).once("error", (e) => this.stop(e)));
                    }
                }
                this.streams.push(this.volume = source = source.pipe(new VolumeTransformer()).once("error", (e) => this.stop(e)));
                this.volume.setVolume(this.volumeLevel);
                this.streams.push(this.volume.pipe(new PCMOpusTransformer({
                    opus: this.opus,
                    frameSize: options.frameSize,
                    pcmSize: options.pcmSize
                })).once("error", (e) => this.stop(e)));
                this._dataPacketMax = 1; // Live volume updating
                this._dataPacketMin = 4;
            } else {
                if(this.libopus) {
                    if(typeof source === "string") {
                        this.streams.push(source = new FFmpegOggTransformer({
                            command: this.converterCommand,
                            input: source,
                            encoderArgs: options.encoderArgs,
                            inputArgs: options.inputArgs,
                            format: options.format,
                            frameDuration: options.frameDuration
                        }).once("error", (e) => this.stop(e)));
                    } else {
                        this.streams.push(source = source.pipe(new FFmpegOggTransformer({
                            command: this.converterCommand,
                            encoderArgs: options.encoderArgs,
                            inputArgs: options.inputArgs,
                            format: options.format,
                            frameDuration: options.frameDuration
                        })).once("error", (e) => this.stop(e)));
                    }
                    this.streams.push(source.pipe(new OggOpusTransformer()).once("error", (e) => this.stop(e)));
                } else {
                    if(typeof source === "string") {
                        this.streams.push(source = new FFmpegPCMTransformer({
                            command: this.converterCommand,
                            input: source,
                            encoderArgs: options.encoderArgs,
                            inputArgs: options.inputArgs
                        }).once("error", (e) => this.stop(e)));
                    } else {
                        this.streams.push(source = source.pipe(new FFmpegPCMTransformer({
                            command: this.converterCommand,
                            encoderArgs: options.encoderArgs,
                            inputArgs: options.inputArgs
                        })).once("error", (e) => this.stop(e)));
                    }
                    this.streams.push(source.pipe(new PCMOpusTransformer({
                        opus: this.opus,
                        frameSize: options.frameSize,
                        pcmSize: options.pcmSize
                    })).once("error", (e) => this.stop(e)));
                }
            }
        } else {
            this.emit("error", new Error("Unrecognized format"));
            return false;
        }

        this._endStream = this.streams[this.streams.length - 1];
        this._endStream.manualCB = true;

        this._endStream.on("data", this.addDataPacket.bind(this));
        this._endStream.once("finish", () => this.stop(null, source));

        this.emit("start");

        return (this.encoding = true);
    }

    stop(e, source) {
        if(source && !~this.streams.indexOf(source)) {
            return;
        }

        if(e) {
            this.emit("error", e);
        }

        if(this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
            this.throttleTimeout = null;
        }

        if(this.streams.length === 0) {
            return;
        }

        if(this._endStream) {
            this._endStream.removeAllListeners("data");
        }

        for(var stream of this.streams) {
            if(typeof stream.destroy === "function") {
                stream.destroy();
            } else {
                stream.unpipe();
            }
        }

        this.reset();
        if(this.encoding) {
            this.encoding = false;
            this.emit("stop");
        }
    }

    reset() {
        this.streams = [];
        this._endStream = null;
        this.volume = null;
    }

    resetPackets() {
        this._dataPackets = [];
    }

    addDataPacket(packet) {
        if(!this.encoding) {
            return;
        }
        if(this._dataPackets.push(packet) < this._dataPacketMax && this._endStream) {
            process.nextTick(() => this._endStream && this._endStream.transformCB());
        }
    }

    setVolume(volume) {
        this.volumeLevel = volume;
        if(!this.volume) {
            return;
        }
        // var oldDB = this.volume.db;
        this.volume.setVolume(volume);
        // var newDBFactor = 10 * Math.log(1 + volume) / 6.931471805599453 / oldDB;
        // for(var i = 0; i < this._dataPackets.length; i++) {
        //     this._retransformer[i] = newDBFactor * (this._retransformer[i] || 1);
        // }
    }

    getDataPacket() {
        if(this._dataPackets.length < this._dataPacketMin && this._endStream) {
            this._endStream.transformCB();
        }
        if(this._retransformer.length === 0) {
            return this._dataPackets.shift();
        } else {
            var packet = this.opus.decode(this._dataPackets.shift());
            for(var i = 0, num; i < packet.length - 1; i += 2) {
                num = ~~(this._retransformer.shift() * packet.readInt16LE(i));
                packet.writeInt16LE(num >= 32767 ? 32767 : num <= -32767 ? -32767 : num, i);
            }
            return this.opus.encode(packet, 3840 / 2 / 2);
        }
    }

    get dataPacketCount() {
        return this._dataPackets.length;
    }
}

module.exports = Piper;
