const PCMConverters = require('../pcm/ConverterEngineList');
const OpusEncoders = require('../opus/OpusEngineList');
const EventEmitter = require('events').EventEmitter;
const StreamDispatcher = require('../dispatcher/StreamDispatcher');

/**
 * Represents the Audio Player of a Voice Connection
 * @extends {EventEmitter}
 * @private
 */
class AudioPlayer extends EventEmitter {
  constructor(voiceConnection) {
    super();
    /**
     * The voice connection the player belongs to
     * @type {VoiceConnection}
     */
    this.voiceConnection = voiceConnection;
    this.audioToPCM = new (PCMConverters.fetch())();
    this.opusEncoder = OpusEncoders.fetch();
    this.currentConverter = null;
    /**
     * The current stream dispatcher, if a stream is being played
     * @type {StreamDispatcher}
     */
    this.dispatcher = null;
    this.audioToPCM.on('error', e => this.emit('error', e));
    this.streamingData = {
      channels: 2,
      count: 0,
      sequence: 0,
      timestamp: 0,
      pausedTime: 0,
    };
    this.voiceConnection.on('closing', () => this.cleanup(null, 'voice connection closing'));
  }

  playUnknownStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    stream.on('end', () => {
      this.emit('debug', 'Input stream to converter has ended');
    });
    stream.on('error', e => this.emit('error', e));
    const conversionProcess = this.audioToPCM.createConvertStream(options.seek);
    conversionProcess.on('error', e => this.emit('error', e));
    conversionProcess.setInput(stream);
    return this.playPCMStream(conversionProcess.process.stdout, conversionProcess, options);
  }

  cleanup(checkStream, reason) {
    // cleanup is a lot less aggressive than v9 because it doesn't try to kill every single stream it is aware of
    this.emit('debug', `Clean up triggered due to ${reason}`);
    const filter = checkStream && this.dispatcher && this.dispatcher.stream === checkStream;
    if (this.currentConverter && (checkStream ? filter : true)) {
      this.currentConverter.destroy();
      this.currentConverter = null;
    }
  }

  playPCMStream(stream, converter, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    stream.on('end', () => this.emit('debug', 'PCM input stream ended'));
    this.cleanup(null, 'outstanding play stream');
    this.currentConverter = converter;
    if (this.dispatcher) {
      this.streamingData = this.dispatcher.streamingData;
    }
    stream.on('error', e => this.emit('error', e));
    const dispatcher = new StreamDispatcher(this, stream, this.streamingData, options);
    dispatcher.on('error', e => this.emit('error', e));
    dispatcher.on('end', () => this.cleanup(dispatcher.stream, 'dispatcher ended'));
    dispatcher.on('speaking', value => this.voiceConnection.setSpeaking(value));
    this.dispatcher = dispatcher;
    dispatcher.on('debug', m => this.emit('debug', `Stream dispatch - ${m}`));
    return dispatcher;
  }

}

module.exports = AudioPlayer;
