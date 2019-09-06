'use strict';

const EventEmitter = require('events').EventEmitter;
const { Readable, pipeline } = require('stream');
const prism = require('prism-media');
const StreamDispatcher = require('../dispatcher/StreamDispatcher');

const FFMPEG_ARGUMENTS = [
  '-analyzeduration', '0',
  '-loglevel', '0',
  '-f', 's16le',
  '-ar', '48000',
  '-ac', '2',
];

/**
 * An Audio Player for a Voice Connection.
 * @private
 * @extends {EventEmitter}
 */
class BasePlayer extends EventEmitter {
  constructor() {
    super();
    this.dispatcher = null;
    this.streamingData = { channels: 2, sequence: 0, timestamp: 0 };
  }

  destroy() {
    this.destroyDispatcher();
  }

  destroyDispatcher() {
    if (this.dispatcher) {
      this.dispatcher.destroy();
      this.dispatcher = null;
    }
  }

  playUnknown(input, options) {
    const streams = [];
    const args = [...FFMPEG_ARGUMENTS];

    if (input instanceof Readable) {
      streams.push(['input', input]);
    } else {
      args.unshift('-i', input);
    }
    if (options.seek) args.unshift('-ss', String(options.seek));

    streams.push(['ffmpeg', new prism.FFmpeg({ args })]);
    return this.playPCMStream(streams, options);
  }

  playPCMStream(streams = [], options) {
    if (options && options.volume !== false) {
      streams.push(['volume', new prism.VolumeTransformer({ type: 's16le', volume: options ? options.volume : 1 })]);
    }
    const encoder = new prism.opus.Encoder({ channels: 2, rate: 48000, frameSize: 960 });
    streams.push(['opus:encoder', encoder]);
    return this.playOpusStream(streams, options);
  }

  playOpusStream(streams = [], options) {
    // If the user has not opted out of volume and there isn't already a volume transform stream, make one
    if (options.volume !== false && !streams.some(part => part[0] === 'volume')) {
      streams.push(['opus:decoder', new prism.opus.Decoder({ channels: 2, rate: 48000, frameSize: 960 })]);
      streams.push(['volume', new prism.VolumeTransformer({ type: 's16le', volume: options ? options.volume : 1 })]);
      streams.push(['opus:encoder', new prism.opus.Encoder({ channels: 2, rate: 48000, frameSize: 960 })]);
    }
    return this.createDispatcher(options, streams);
  }

  createDispatcher(options, streams, broadcast) {
    this.destroyDispatcher();
    const dispatcher = this.dispatcher = new StreamDispatcher(this, options, streams, broadcast);
    streams.push(['dispatcher', dispatcher]);
    // eslint-disable-next-line no-empty-function
    const noop = () => {};
    pipeline(...streams.map(part => part[1]), noop);
    return dispatcher;
  }
}

module.exports = BasePlayer;
