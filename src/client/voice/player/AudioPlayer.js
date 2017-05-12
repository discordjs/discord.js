const EventEmitter = require('events').EventEmitter;
const Prism = require('prism-media');
const StreamDispatcher = require('../dispatcher/StreamDispatcher');
const Collection = require('../../../util/Collection');
const OpusEncoders = require('../opus/OpusEngineList');

const ffmpegArguments = [
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
class AudioPlayer extends EventEmitter {
  constructor(voiceConnection) {
    super();
    /**
     * The voice connection that the player serves
     * @type {VoiceConnection}
     */
    this.voiceConnection = voiceConnection;
    /**
     * The prism transcoder that the player uses
     * @type {Prism}
     */
    this.prism = new Prism();
    /**
     * The opus encoder that the player uses
     * @type {NodeOpusEngine|OpusScriptEngine}
     */
    this.opusEncoder = OpusEncoders.fetch();
    this.streams = new Collection();
    this.currentStream = {};
    this.streamingData = {
      channels: 2,
      count: 0,
      sequence: 0,
      timestamp: 0,
      pausedTime: 0,
    };
    this.voiceConnection.once('closing', () => this.destroyCurrentStream());
  }

  /**
   * The current transcoder
   * @type {?Object}
   * @readonly
   */
  get transcoder() {
    return this.currentStream.transcoder;
  }

  /**
   * The current dispatcher
   * @type {?StreamDispatcher}
   * @readonly
   */
  get dispatcher() {
    return this.currentStream.dispatcher;
  }

  destroy() {
    if (this.opusEncoder) this.opusEncoder.destroy();
  }

  destroyCurrentStream() {
    const transcoder = this.transcoder;
    const dispatcher = this.dispatcher;
    if (transcoder) transcoder.kill();
    if (dispatcher) {
      const end = dispatcher.listeners('end')[0];
      const error = dispatcher.listeners('error')[0];
      if (end) dispatcher.removeListener('end', end);
      if (error) dispatcher.removeListener('error', error);
      dispatcher.destroy('end');
    }
    this.currentStream = {};
  }

  playUnknownStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    OpusEncoders.guaranteeOpusEngine();
    const options = { seek, volume, passes };
    const transcoder = this.prism.transcode({
      type: 'ffmpeg',
      media: stream,
      ffmpegArguments: ffmpegArguments.concat(['-ss', String(seek)]),
    });
    this.destroyCurrentStream();
    this.currentStream = {
      transcoder: transcoder,
      output: transcoder.output,
      input: stream,
    };
    transcoder.on('error', e => {
      this.destroyCurrentStream();
      if (this.listenerCount('error') > 0) this.emit('error', e);
      this.emit('warn', `prism transcoder error - ${e}`);
    });
    return this.playPCMStream(transcoder.output, options, true);
  }

  playPCMStream(stream, { seek = 0, volume = 1, passes = 1 } = {}, fromUnknown = false) {
    OpusEncoders.guaranteeOpusEngine();
    const options = { seek, volume, passes };
    const dispatcher = this.createDispatcher(stream, options);
    if (fromUnknown) {
      this.currentStream.dispatcher = dispatcher;
    } else {
      this.destroyCurrentStream();
      this.currentStream = {
        dispatcher,
        input: stream,
        output: stream,
      };
    }
    return dispatcher;
  }

  playOpusStream(stream, { seek = 0, passes = 1 } = {}) {
    const options = { seek, passes, opus: true };
    this.destroyCurrentStream();
    const dispatcher = this.createDispatcher(stream, options);
    this.currentStream = {
      dispatcher,
      input: stream,
      output: stream,
    };
    return dispatcher;
  }

  playBroadcast(broadcast, { volume = 1, passes = 1 } = {}) {
    const options = { volume, passes };
    this.destroyCurrentStream();
    const dispatcher = this.createDispatcher(broadcast, options);
    this.currentStream = {
      dispatcher,
      broadcast,
      input: broadcast,
      output: broadcast,
    };
    broadcast.registerDispatcher(dispatcher);
    return dispatcher;
  }

  createDispatcher(stream, options) {
    const dispatcher = new StreamDispatcher(this, stream, options);
    dispatcher.on('end', () => this.destroyCurrentStream());
    dispatcher.on('error', () => this.destroyCurrentStream());
    dispatcher.on('speaking', value => this.voiceConnection.setSpeaking(value));
    return dispatcher;
  }
}

module.exports = AudioPlayer;
