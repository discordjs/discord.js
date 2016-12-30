const EventEmitter = require('events').EventEmitter;
const Prism = require('prism-media');
const OpusEncoders = require('./opus/OpusEngineList');
const Collection = require('../../util/Collection');

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
    this.dispatchers = new Collection();
    this.prism = new Prism();
    this.opusEncoder = OpusEncoders.fetch();
    this.currentTranscoder = null;
    this.tickInterval = null;
    this._volume = 1;
  }

  applyVolume(buffer, volume) {
    volume = volume || this._volume;
    if (volume === 1) return buffer;

    const out = new Buffer(buffer.length);
    for (let i = 0; i < buffer.length; i += 2) {
      if (i >= buffer.length - 1) break;
      const uint = Math.min(32767, Math.max(-32767, Math.floor(volume * buffer.readInt16LE(i))));
      out.writeInt16LE(uint, i);
    }

    return out;
  }

  setVolume(volume) {
    this._volume = volume;
  }

  setVolumeDecibels(db) {
    this.setVolume(Math.pow(10, db / 20));
  }

  setVolumeLogarithmic(value) {
    this.setVolume(Math.pow(value, 1.660964));
  }

  get volume() {
    return this._volume;
  }

  get _playableStream() {
    if (!this.currentTranscoder) return null;
    return this.currentTranscoder.transcoder.output || this.currentTranscoder.options.stream;
  }

  unregisterDispatcher(dispatcher, old) {
    let container = this.dispatchers.get(old || dispatcher.volume);
    if (container) {
      if (container.delete(dispatcher)) return;
    }
    for (container of this.dispatchers.values()) {
      container.delete(dispatcher);
    }
  }

  registerDispatcher(dispatcher) {
    if (!this.dispatchers.has(dispatcher.volume)) {
      this.dispatchers.set(dispatcher.volume, new Set());
    }
    const container = this.dispatchers.get(dispatcher.volume);
    if (!container.has(dispatcher)) {
      container.add(dispatcher);
      dispatcher.once('end', () => this.unregisterDispatcher(dispatcher));
      dispatcher.on('volumeChange', (o, n) => {
        this.unregisterDispatcher(dispatcher, o);
        if (!this.dispatchers.has(n)) {
          this.dispatchers.set(n, new Set());
        }
        this.dispatchers.get(n).add(dispatcher);
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

  pause() {
    for (const container of this.dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.pause();
      }
    }
    clearInterval(this.tickInterval);
  }

  resume() {
    for (const container of this.dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.resume();
      }
    }
    this._startPlaying();
  }

  _startPlaying() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = this.client.setInterval(this.tick.bind(this), 20);
  }

  tick() {
    if (!this._playableStream) return;
    const stream = this._playableStream;
    const bufferLength = 1920 * 2;
    let buffer = stream.read(bufferLength);

    if (!buffer) return;

    if (buffer.length !== bufferLength) {
      const newBuffer = new Buffer(bufferLength).fill(0);
      buffer.copy(newBuffer);
      buffer = newBuffer;
    }

    buffer = this.applyVolume(buffer);

    for (const x of this.dispatchers.entries()) {
      const [volume, container] = x;
      if (container.size === 0) continue;
      setImmediate(() => {
        const opusPacket = this.opusEncoder.encode(this.applyVolume(buffer, volume));
        for (const dispatcher of container.values()) {
          dispatcher.process(buffer, true, opusPacket);
        }
      });
    }
  }

  end() {
    this.killCurrentTranscoder();
    for (const container of this.dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.destroy('end', 'broadcast ended');
      }
    }
  }
}

module.exports = VoiceBroadcast;
