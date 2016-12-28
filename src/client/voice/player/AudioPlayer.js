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

class AudioPlayer extends EventEmitter {
  constructor(voiceConnection) {
    super();
    this.voiceConnection = voiceConnection;
    this.prism = new Prism();
    this.opusEncoder = OpusEncoders.fetch();
    this.streams = new Collection();
    this.streamingData = {
      channels: 2,
      count: 0,
      sequence: 0,
      timestamp: 0,
      pausedTime: 0,
    };
  }

  get currentTranscoder() {
    return this.streams.last().transcoder;
  }

  destroyAllStreams(exceptLatest) {
    for (const stream of this.streams.keys()) {
      const data = this.streams.get(stream);
      const transcoder = data.transcoder;
      const dispatcher = data.dispatcher;
      if (exceptLatest && transcoder === this.currentTranscoder) continue;
      if (transcoder) transcoder.kill();
      if (dispatcher) dispatcher.destroy('end');
    }
  }

  playUnknownStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    const transcoder = this.prism.transcode({
      type: 'ffmpeg',
      media: stream,
      ffmpegArguments,
    });
    this.streams.set(stream, { transcoder });
    this.playPCMStream(transcoder.output, options);
  }

  playPCMStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    this.destroyAllStreams(true);
    const dispatcher = new StreamDispatcher(this, stream, options);
    dispatcher.on('speaking', value => this.voiceConnection.setSpeaking(value));
    if (!this.streams.has(stream)) this.streams.set(stream, { dispatcher });
    this.streams.get(stream).dispatcher = dispatcher;
    return dispatcher;
  }
}

module.exports = AudioPlayer;
