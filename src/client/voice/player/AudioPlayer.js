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
  }

  playUnknownStream(stream) {
    stream.on('end', () => {

    console.log(Date.now(), 'real input stream ended');
    })
    const conversionProcess = this.audioToPCM.createConvertStream(0);
    stream.pipe(conversionProcess.process.stdin, { end: false });
    return this.playPCMStream(conversionProcess.process.stdout, conversionProcess);
  }

  cleanup(checkStream) {
    // cleanup is a lot less aggressive than v9 because it doesn't try to kill every single stream it is aware of
    console.log(Date.now(), 'clean up triggered');
    const filter = checkStream && this.currentDispatcher && this.currentDispatcher.stream === checkStream;
    if (this.currentConverter && (checkStream ? filter : true)) {
      if (this.currentConverter.process.stdin.destroy) {
        this.currentConverter.process.stdin.destroy();
      }
      if (this.currentConverter.process.kill) {
        this.currentConverter.process.kill();
      }
      this.currentConverter = null;
    }
  }

  playPCMStream(stream, converter) {
    stream.on('end', () => {

    console.log(Date.now(), 'pcm input stream ended');
    })
    this.cleanup();
    this.currentConverter = converter;
    if (this.currentDispatcher) {
      this.streamingData = this.currentDispatcher.streamingData;
    }
    stream.on('error', e => this.emit('error', e));
    const dispatcher = new StreamDispatcher(this, stream, this.streamingData, {
      volume: 1,
    });
    dispatcher.on('error', e => this.emit('error', e));
    dispatcher.on('end', () => this.cleanup(dispatcher.stream));
    dispatcher.on('speaking', value => this.voiceConnection.setSpeaking(value));
    this.currentDispatcher = dispatcher;
  }

}

module.exports = AudioPlayer;
