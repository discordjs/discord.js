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

/**
 * A voice broadcast that can be played across multiple voice connections
 * @extends {EventEmitter}
 */
class VoiceBroadcast extends EventEmitter {
  constructor(client) {
    super();
    /**
     * The client that created the broadcast
     * @type {Client}
     */
    this.client = client;
    this.dispatchers = new Collection();
    /**
     * The audio transcoder that this broadcast uses
     * @type {Prism}
     */
    this.prism = new Prism();
    /**
     * The opus encoder that this broadcast uses
     * @type {NodeOpusEngine|OpusScriptEngine}
     */
    this.opusEncoder = OpusEncoders.fetch();
    /**
     * The current audio transcoder that is being used
     * @type {object}
     */
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

  /**
   * Sets the volume relative to the input stream - i.e. 1 is normal, 0.5 is half, 2 is double.
   * @param {number} volume The volume that you want to set
   */
  setVolume(volume) {
    this._volume = volume;
  }

  /**
   * Set the volume in decibels
   * @param {number} db The decibels
   */
  setVolumeDecibels(db) {
    this.setVolume(Math.pow(10, db / 20));
  }

  /**
   * Set the volume so that a perceived value of 0.5 is half the perceived volume etc.
   * @param {number} value The value for the volume
   */
  setVolumeLogarithmic(value) {
    this.setVolume(Math.pow(value, 1.660964));
  }

  /**
   * The current volume of the broadcast
   * @readonly
   * @type {number}
   */
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

  /**
   * Plays any audio stream across the broadcast
   * @param {ReadableStream} stream The audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {VoiceBroadcast}
   * @example
   * // play streams using ytdl-core
   * const ytdl = require('ytdl-core');
   * const streamOptions = { seek: 0, volume: 1 };
   * const broadcast = client.createVoiceBroadcast();
   *
   * voiceChannel.join()
   *  .then(connection => {
   *    const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', {filter : 'audioonly'});
   *    broadcast.playStream(stream);
   *    const dispatcher = connection.playBroadcast(broadcast);
   *  })
   *  .catch(console.error);
   */
  playStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    const options = { seek, volume, passes };
    options.stream = stream;
    return this._playTranscodable(stream, options);
  }

  /**
   * Play the given file in the voice connection.
   * @param {string} file The path to the file
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {StreamDispatcher}
   * @example
   * // play files natively
   * const broadcast = client.createVoiceBroadcast();
   *
   * voiceChannel.join()
   *  .then(connection => {
   *    broadcast.playFile('C:/Users/Discord/Desktop/music.mp3');
   *    const dispatcher = connection.playBroadcast(broadcast);
   *  })
   *  .catch(console.error);
   */
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
    /**
     * Emitted whenever an error occurs
     * @event VoiceBroadcast#error
     * @param {Error} error the error that occurred
     */
    transcoder.once('error', e => {
      if (this.listenerCount('error') > 0) this.emit('error', e);
      /**
       * Emitted whenever the VoiceBroadcast has any warnings
       * @event VoiceBroadcast#warn
       * @param {string|Error} warning the warning that was raised
       */
      else this.emit('warn', e);
    });
    transcoder.once('end', () => this.killCurrentTranscoder());
    this.currentTranscoder = {
      transcoder,
      options,
    };
    transcoder.output.once('readable', () => this._startPlaying());
    return this;
  }

  /**
   * Plays a stream of 16-bit signed stereo PCM at 48KHz.
   * @param {ReadableStream} stream The audio stream to play.
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {VoiceBroadcast}
   */
  playConvertedStream(stream, { seek = 0, volume = 1, passes = 1 } = {}) {
    this.killCurrentTranscoder();
    const options = { seek, volume, passes, stream };
    this.currentTranscoder = { options };
    stream.once('readable', () => this._startPlaying());
    return this;
  }

  /**
   * Pauses the entire broadcast - all dispatchers also pause
   */
  pause() {
    for (const container of this.dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.pause();
      }
    }
    clearInterval(this.tickInterval);
  }

  /**
   * Resumes the entire broadcast - all dispatchers also resume
   */
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
      setImmediate(() => {
        const [volume, container] = x;
        const opusPacket = this.opusEncoder.encode(this.applyVolume(buffer, volume));
        for (const dispatcher of container.values()) {
          setImmediate(() => dispatcher.process(buffer, true, opusPacket));
        }
      });
    }
  }

  /**
   * End the current broadcast, all subscribed dispatchers will also end
   */
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
