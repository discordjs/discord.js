const EventEmitter = require('events').EventEmitter;
const Prism = require('prism-media');

const ffmpegArguments = [
  '-analyzeduration', '0',
  '-loglevel', '0',
  '-f', 's16le',
  '-ar', '48000',
  '-ac', '2',
];

class VoiceBroadcast extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.dispatchers = [];
    this.prism = new Prism();
    this.currentTranscoder = null;
    this.tickInterval = null;
  }

  get _playableStream() {
    if (!this.currentTranscoder) return null;
    return this.currentTranscoder.transcoder.output || this.currentTranscoder.options.stream;
  }

  registerDispatcher(dispatcher) {
    if (!this.dispatchers.includes(dispatcher)) {
      this.dispatchers.push(dispatcher);
      dispatcher.once('end', () => {
        const ind = this.dispatchers.indexOf(dispatcher);
        if (ind > -1) this.dispatchers.splice(ind, 1);
      });
    }
  }

  killCurrentTranscoder() {
    if (this.currentTranscoder) {
      if (this.currentTranscoder.transcoder) this.currentTranscoder.transcoder.kill();
      this.currentTranscoder = null;
    }
  }

  playStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    options.stream = stream;
    return this._playTranscodable(stream, options);
  }

  playFile(file, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    return this._playTranscodable(file, options);
  }

  _playTranscodable(media, options) {
    this.killCurrentTranscoder();
    const transcoder = this.prism.transcode({
      type: 'ffmpeg',
      media,
      ffmpegArguments: ffmpegArguments.concat(['-ss', String(options.seek)]),
    });
    transcoder.once('error', e => this.emit('error', e));
    transcoder.once('end', () => this.killCurrentTranscoder());
    this.currentTranscoder = {
      transcoder,
      options,
    };
    transcoder.output.once('readable', () => this._startPlaying());
    return this;
  }

  playConvertedStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    this.killCurrentTranscoder();
    const options = { seek, volume, passes, stream };
    this.currentTranscoder = { options };
    stream.once('readable', () => this._startPlaying());
    return this;
  }

  _startPlaying() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = this.client.setInterval(this.tick.bind(this), 20);
  }

  tick() {
    if (!this._playableStream) return;
    const stream = this._playableStream;
    const buffer = stream.read(1920 * 2);

    for (const dispatcher of this.dispatchers) {
      setImmediate(() => dispatcher.process(buffer, true));
    }
  }

  end() {
    this.killCurrentTranscoder();
    for (const dispatcher of this.dispatchers) {
      dispatcher.destroy('end', 'broadcast ended');
    }
  }
}

module.exports = VoiceBroadcast;
