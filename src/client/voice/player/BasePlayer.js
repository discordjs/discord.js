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
    this.converterEngine.on('error', err => {
      this._shutdown();
      this.emit('error', err);
    });
    this.speaking = false;
    this.processMap = new Map();
    this.dispatcher = null;
    this._streamingData = {
      sequence: 0,
      timestamp: 0,
    };
  }

  convertStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    const encoder = this.converterEngine.createConvertStream(options.seek);
    const pipe = stream.pipe(encoder.stdin, { end: false });
    pipe.on('unpipe', () => {
      this.killStream(encoder.stdout);
      pipe.destroy();
    });
    this.processMap.set(encoder.stdout, {
      pcmConverter: encoder,
      inputStream: stream,
    });
    return encoder.stdout;
  }

  _shutdown() {
    this.speaking = false;
    if (this.dispatcher) this.dispatcher._triggerTerminalState('end', 'ended by parent player shutdown');
    for (const stream of this.processMap.keys()) this.killStream(stream);
  }

  killStream(stream) {
    const streams = this.processMap.get(stream);
    this._streamingData = this.dispatcher.streamingData;
    this.emit(Constants.Events.DEBUG, 'Cleaning up player after audio stream ended or encountered an error');

    const dummyHandler = () => null;

    if (streams) {
      this.processMap.delete(stream);
      if (streams.inputStream && streams.pcmConverter) {
        try {
          streams.inputStream.once('error', dummyHandler);
          streams.pcmConverter.once('error', dummyHandler);
          streams.pcmConverter.stdin.once('error', dummyHandler);
          streams.pcmConverter.stdout.once('error', dummyHandler);
          if (streams.inputStream.unpipe) {
            streams.inputStream.unpipe(streams.pcmConverter.stdin);
            this.emit(Constants.Events.DEBUG, '- Unpiped input stream');
          } else if (streams.inputStream.destroy) {
            streams.inputStream.destroy();
            this.emit(Constants.Events.DEBUG, '- Couldn\'t unpipe input stream, so destroyed input stream');
          }
          if (streams.pcmConverter.stdin) {
            streams.pcmConverter.stdin.end();
            this.emit(Constants.Events.DEBUG, '- Ended input stream to PCM converter');
          }
          if (streams.pcmConverter && streams.pcmConverter.kill) {
            streams.pcmConverter.kill('SIGINT');
            this.emit(Constants.Events.DEBUG, '- Killed the PCM converter');
          }
        } catch (err) {
          // if an error happened make sure the pcm converter is killed anyway
          try {
            if (streams.pcmConverter && streams.pcmConverter.kill) {
              streams.pcmConverter.kill('SIGINT');
              this.emit(Constants.Events.DEBUG, '- Killed the PCM converter after previous error (abnormal)');
            }
          } catch (e) {
            return e;
          }
          return err;
        }
      }
    }
    return null;
  }

  setSpeaking(value) {
    if (this.speaking === value) return;
    this.speaking = value;
    this.connection.websocket.send({
      op: Constants.VoiceOPCodes.SPEAKING,
      d: {
        speaking: true,
        delay: 0,
      },
    }).catch(e => {
      this.emit('debug', e);
    });
  }

  playPCMStream(pcmStream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    const dispatcher = new StreamDispatcher(this, pcmStream, this._streamingData, options);
    dispatcher.on('speaking', value => this.setSpeaking(value));
    dispatcher.on('end', () => this.killStream(pcmStream));
    dispatcher.on('error', () => this.killStream(pcmStream));
    dispatcher.setVolume(options.volume);
    this.dispatcher = dispatcher;
    return dispatcher;
  }
}

module.exports = VoiceConnectionPlayer;
