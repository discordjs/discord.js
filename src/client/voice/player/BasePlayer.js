const OpusEngines = require('../opus/OpusEngineList');
const ConverterEngines = require('../pcm/ConverterEngineList');
const Constants = require('../../../util/Constants');
const StreamDispatcher = require('../dispatcher/StreamDispatcher');
const EventEmitter = require('events').EventEmitter;

class VoiceConnectionPlayer extends EventEmitter {

  constructor(connection) {
    super();
    this.connection = connection;
    this.opusEncoder = OpusEngines.fetch();
    const Engine = ConverterEngines.fetch();
    this.converterEngine = new Engine(this);
    this.speaking = false;
    this.processMap = new Map();
  }

  convertStream(stream) {
    const encoder = this.converterEngine.createConvertStream();
    stream.pipe(encoder.stdin);
    this.processMap.set(encoder.stdout, {
      pcmConverter: encoder,
      inputStream: stream,
    });
    return encoder.stdout;
  }

  _shutdown() {
    for (const stream of this.processMap.keys()) {
      this.killStream(stream);
    }
  }

  killStream(stream) {
    const streams = this.processMap.get(stream);
    this.emit('debug', 'cleaning up streams after end/error');
    if (streams) {
      if (streams.inputStream && streams.pcmConverter) {
        try {
          streams.pcmConverter.on('error', console.log);
          streams.pcmConverter.stdin.on('error', console.log);
          streams.pcmConverter.stdout.on('error', console.log);
          streams.inputStream.stdout.on('error', console.log);
          if (streams.pcmConverter.stdout.destroy) {
            streams.pcmConverter.stdout.destroy();
            this.emit('debug', 'stream kill part 2/5 pass');
          }
          if (streams.pcmConverter.stdin) {
            streams.pcmConverter.stdin.end();
            this.emit('debug', 'stream kill part 1/5 pass');
          }
          if (streams.pcmConverter && streams.pcmConverter.kill) {
            streams.pcmConverter.kill('SIGINT');
            this.emit('debug', 'stream kill part 3/5 pass');
          }
          if (streams.inputStream.unpipe) {
            streams.inputStream.unpipe(streams.pcmConverter.stdin);
            this.emit('debug', 'stream kill part 4/5 pass');
          }
          if (streams.inputStream.destroy) {
            streams.inputStream.destroy();
            this.emit('debug', 'stream kill part 5/5 pass');
          }
        } catch (e) {
          return e;
        }
      }
    }
  }

  setSpeaking(value) {
    if (this.speaking === value) {
      return;
    }
    this.speaking = value;
    this.connection.websocket.send({
      op: Constants.VoiceOPCodes.SPEAKING,
      d: {
        speaking: value,
        delay: 0,
      },
    });
  }

  playPCMStream(pcmStream) {
    const dispatcher = new StreamDispatcher(this, pcmStream);
    dispatcher.on('speaking', value => this.setSpeaking(value));
    dispatcher.on('end', () => this.killStream(pcmStream));
    dispatcher.on('error', () => this.killStream(pcmStream));
    return dispatcher;
  }

}

module.exports = VoiceConnectionPlayer;
