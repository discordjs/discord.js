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

    this.audioToPCM.on('error', e => this.emit('error', e));
  }

  playUnknownStream(stream) {
    const conversionProcess = this.audioToPCM.createConvertStream(0);
    stream.pipe(conversionProcess.process.stdin, { end: false });
    return this.playPCMStream(conversionProcess.process.stdout);
  }

  playPCMStream(stream) {
    stream.on('error', e => this.emit('error', e));
    const dispatcher = new StreamDispatcher(this, stream, {
      channels: 2,
      count: 0,
      sequence: 0,
      timestamp: 0,
      pausedTime: 0,
    }, {
      volume: 1,
    });
    dispatcher.on('error', e => console.log('error', e));
    dispatcher.on('end', e => console.log('end', e));
    dispatcher.on('speaking', value => this.voiceConnection.setSpeaking(value));
  }

}

module.exports = AudioPlayer;
