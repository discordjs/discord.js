const PCMConverters = require('../pcm/ConverterEngineList');
const OpusEncoders = require('../opus/OpusEngineList');
const EventEmitter = require('events').EventEmitter;
const StreamDispatcher = require('../dispatcher/StreamDispatcher');

class AudioPlayer extends EventEmitter {

  constructor(voiceConnection) {
    super();
    this.voiceConnection = voiceConnection;
    this.audioToPCM = new (PCMConverters.fetch())();
    this.opusEncoder = OpusEncoders.fetch();
    this.currentConverter = null;
    this.currentDispatcher = null;
    this.audioToPCM.on('error', e => this.emit('error', e));
    this.streamingData = {
      channels: 2,
      count: 0,
      sequence: 0,
      timestamp: 0,
      pausedTime: 0,
    };
    this.voiceConnection.on('closing', () => this.cleanup(null, 'voice connection is closing'));
  }

  playUnknownStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    stream.on('end', () => {
      this.emit('debug', 'input stream to converter has ended');
    });
    stream.on('error', e => this.emit('error', e));
    const conversionProcess = this.audioToPCM.createConvertStream(options.seek);
    conversionProcess.on('error', e => this.emit('error', e));
    conversionProcess.setInput(stream);
    return this.playPCMStream(conversionProcess.process.stdout, conversionProcess, options);
  }

  cleanup(checkStream, reason) {
    // cleanup is a lot less aggressive than v9 because it doesn't try to kill every single stream it is aware of
    this.emit('debug', `clean up triggered due to ${reason}`);
    const filter = checkStream && this.currentDispatcher && this.currentDispatcher.stream === checkStream;
    if (this.currentConverter && (checkStream ? filter : true)) {
      this.currentConverter.destroy();
      this.currentConverter = null;
    }
  }

  playPCMStream(stream, converter, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    stream.on('end', () => this.emit('debug', 'pcm input stream ended'));
    this.cleanup(null, 'outstanding play stream');
    this.currentConverter = converter;
    if (this.currentDispatcher) {
      this.streamingData = this.currentDispatcher.streamingData;
    }
    stream.on('error', e => this.emit('error', e));
    const dispatcher = new StreamDispatcher(this, stream, this.streamingData, options);
    dispatcher.on('error', e => this.emit('error', e));
    dispatcher.on('end', () => this.cleanup(dispatcher.stream, 'disp ended'));
    dispatcher.on('speaking', value => this.voiceConnection.setSpeaking(value));
    this.currentDispatcher = dispatcher;
    dispatcher.on('debug', m => this.emit('debug', `stream dispatch - ${m}`));
    return dispatcher;
  }

}

module.exports = AudioPlayer;
