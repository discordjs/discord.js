const VolumeInterface = require('./util/VolumeInterface');
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
 * A voice broadcast can be played across multiple voice connections for improved shared-stream efficiency.
 *
 * Example usage:
 * ```js
 * const broadcast = client.createVoiceBroadcast();
 * broadcast.playFile('./music.mp3');
 * // Play "music.mp3" in all voice connections that the client is in
 * for (const connection of client.voiceConnections.values()) {
 *   connection.playBroadcast(broadcast);
 * }
 * ```
 * @implements {VolumeInterface}
 */
class VoiceBroadcast extends VolumeInterface {
  constructor(client) {
    super();
    /**
     * The client that created the broadcast
     * @type {Client}
     */
    this.client = client;
    this._dispatchers = new Collection();
    this._encoders = new Collection();
    /**
     * Whether playing is paused
     * @type {boolean}
     */
    this.paused = false;
    /**
     * The audio transcoder that this broadcast uses
     * @type {Prism}
     */
    this.prism = new Prism();
    /**
     * The current audio transcoder that is being used
     * @type {Object}
     */
    this.currentTranscoder = null;
    this.tickInterval = null;
    this._volume = 1;
  }

  /**
   * An array of subscribed dispatchers
   * @type {StreamDispatcher[]}
   * @readonly
   */
  get dispatchers() {
    let d = [];
    for (const container of this._dispatchers.values()) {
      d = d.concat(Array.from(container.values()));
    }
    return d;
  }

  get _playableStream() {
    const currentTranscoder = this.currentTranscoder;
    if (!currentTranscoder) return null;
    const transcoder = currentTranscoder.transcoder;
    const options = currentTranscoder.options;
    return (transcoder && transcoder.output) || options.stream;
  }

  unregisterDispatcher(dispatcher, old) {
    const volume = old || dispatcher.volume;

    /**
     * Emitted whenever a stream dispatcher unsubscribes from the broadcast.
     * @event VoiceBroadcast#unsubscribe
     * @param {StreamDispatcher} dispatcher The unsubscribed dispatcher
     */
    this.emit('unsubscribe', dispatcher);
    for (const container of this._dispatchers.values()) {
      container.delete(dispatcher);

      if (!container.size) {
        this._encoders.get(volume).destroy();
        this._dispatchers.delete(volume);
        this._encoders.delete(volume);
      }
    }
  }

  registerDispatcher(dispatcher) {
    if (!this._dispatchers.has(dispatcher.volume)) {
      this._dispatchers.set(dispatcher.volume, new Set());
      this._encoders.set(dispatcher.volume, OpusEncoders.fetch());
    }
    const container = this._dispatchers.get(dispatcher.volume);
    if (!container.has(dispatcher)) {
      container.add(dispatcher);
      dispatcher.once('end', () => this.unregisterDispatcher(dispatcher));
      dispatcher.on('volumeChange', (o, n) => {
        this.unregisterDispatcher(dispatcher, o);
        if (!this._dispatchers.has(n)) {
          this._dispatchers.set(n, new Set());
          this._encoders.set(n, OpusEncoders.fetch());
        }
        this._dispatchers.get(n).add(dispatcher);
      });
      /**
       * Emitted whenever a stream dispatcher subscribes to the broadcast.
       * @event VoiceBroadcast#subscribe
       * @param {StreamDispatcher} dispatcher The subscribed dispatcher
       */
      this.emit('subscribe', dispatcher);
    }
  }

  killCurrentTranscoder() {
    if (this.currentTranscoder) {
      if (this.currentTranscoder.transcoder) this.currentTranscoder.transcoder.kill();
      this.currentTranscoder = null;
      this.emit('end');
    }
  }

  /**
   * Plays any audio stream across the broadcast.
   * @param {ReadableStream} stream The audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {VoiceBroadcast}
   * @example
   * // Play streams using ytdl-core
   * const ytdl = require('ytdl-core');
   * const streamOptions = { seek: 0, volume: 1 };
   * const broadcast = client.createVoiceBroadcast();
   *
   * voiceChannel.join()
   *   .then(connection => {
   *     const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', { filter : 'audioonly' });
   *     broadcast.playStream(stream);
   *     const dispatcher = connection.playBroadcast(broadcast);
   *   })
   *   .catch(console.error);
   */
  playStream(stream, options = {}) {
    this.setVolume(options.volume || 1);
    return this._playTranscodable(stream, options);
  }

  /**
   * Plays the given file in the voice connection.
   * @param {string} file The absolute path to the file
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {StreamDispatcher}
   * @example
   * // Play files natively
   * const broadcast = client.createVoiceBroadcast();
   *
   * voiceChannel.join()
   *   .then(connection => {
   *     broadcast.playFile('C:/Users/Discord/Desktop/music.mp3');
   *     const dispatcher = connection.playBroadcast(broadcast);
   *   })
   *   .catch(console.error);
   */
  playFile(file, options = {}) {
    this.setVolume(options.volume || 1);
    return this._playTranscodable(`file:${file}`, options);
  }

  _playTranscodable(media, options) {
    this.killCurrentTranscoder();
    const transcoder = this.prism.transcode({
      type: 'ffmpeg',
      media,
      ffmpegArguments: ffmpegArguments.concat(['-ss', String(options.seek || 0)]),
    });
    /**
     * Emitted whenever an error occurs.
     * @event VoiceBroadcast#error
     * @param {Error} error The error that occurred
     */
    transcoder.once('error', e => {
      if (this.listenerCount('error') > 0) this.emit('error', e);
      /**
       * Emitted whenever the VoiceBroadcast has any warnings.
       * @event VoiceBroadcast#warn
       * @param {string|Error} warning The warning that was raised
       */
      else this.emit('warn', e);
    });
    /**
     * Emitted once the broadcast (the audio stream) ends.
     * @event VoiceBroadcast#end
     */
    transcoder.once('end', () => this.killCurrentTranscoder());
    this.currentTranscoder = {
      transcoder,
      options,
    };
    transcoder.output.once('readable', () => this._startPlaying());
    return this;
  }

  /**
   * Plays a stream of 16-bit signed stereo PCM.
   * @param {ReadableStream} stream The audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {VoiceBroadcast}
   */
  playConvertedStream(stream, options = {}) {
    this.killCurrentTranscoder();
    this.setVolume(options.volume || 1);
    this.currentTranscoder = { options: { stream } };
    stream.once('readable', () => this._startPlaying());
    return this;
  }

  /**
   * Plays an Opus encoded stream.
   * <warn>Note that inline volume is not compatible with this method.</warn>
   * @param {ReadableStream} stream The Opus audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {StreamDispatcher}
   */
  playOpusStream(stream) {
    this.currentTranscoder = { options: { stream }, opus: true };
    stream.once('readable', () => this._startPlaying());
    return this;
  }

  /**
   * Plays an arbitrary input that can be [handled by ffmpeg](https://ffmpeg.org/ffmpeg-protocols.html#Description).
   * @param {string} input The arbitrary input
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {VoiceBroadcast}
   */
  playArbitraryInput(input, options = {}) {
    this.setVolume(options.volume || 1);
    options.input = input;
    return this._playTranscodable(input, options);
  }

  /**
   * Pauses the entire broadcast - all dispatchers are also paused.
   */
  pause() {
    this.paused = true;
    for (const container of this._dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.pause();
      }
    }
  }

  /**
   * Resumes the entire broadcast - all dispatchers are also resumed.
   */
  resume() {
    this.paused = false;
    for (const container of this._dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.resume();
      }
    }
  }

  _startPlaying() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    // Old code?
    // this.tickInterval = this.client.setInterval(this.tick.bind(this), 20);
    this._startTime = Date.now();
    this._count = 0;
    this._pausedTime = 0;
    this._missed = 0;
    this.tick();
  }

  tick() {
    if (!this._playableStream) return;
    if (this.paused) {
      this._pausedTime += 20;
      setTimeout(() => this.tick(), 20);
      return;
    }

    const opus = this.currentTranscoder.opus;
    const buffer = this.readStreamBuffer();

    if (!buffer) {
      this._missed++;
      if (this._missed < 5) {
        this._pausedTime += 200;
        setTimeout(() => this.tick(), 200);
      } else {
        this.killCurrentTranscoder();
      }
      return;
    }

    this._missed = 0;

    let packetMatrix = {};

    const getOpusPacket = volume => {
      if (packetMatrix[volume]) return packetMatrix[volume];

      const opusEncoder = this._encoders.get(volume);
      const opusPacket = opusEncoder.encode(this.applyVolume(buffer, this._volume * volume));
      packetMatrix[volume] = opusPacket;
      return opusPacket;
    };

    for (const dispatcher of this.dispatchers) {
      if (opus) {
        dispatcher.processPacket(buffer);
        continue;
      }

      const volume = dispatcher.volume;
      dispatcher.processPacket(getOpusPacket(volume));
    }

    const next = 20 + (this._startTime + this._pausedTime + (this._count * 20) - Date.now());
    this._count++;
    setTimeout(() => this.tick(), next);
  }

  readStreamBuffer() {
    const opus = this.currentTranscoder.opus;
    const bufferLength = (opus ? 80 : 1920) * 2;
    let buffer = this._playableStream.read(bufferLength);
    if (opus) return buffer;
    if (!buffer) return null;

    if (buffer.length !== bufferLength) {
      const newBuffer = Buffer.alloc(bufferLength).fill(0);
      buffer.copy(newBuffer);
      buffer = newBuffer;
    }

    return buffer;
  }

  /**
   * Stops the current stream from playing without unsubscribing dispatchers.
   */
  end() {
    this.killCurrentTranscoder();
  }

  /**
   * Ends the current broadcast, all subscribed dispatchers will also end.
   */
  destroy() {
    this.end();
    for (const container of this._dispatchers.values()) {
      for (const dispatcher of container.values()) {
        dispatcher.destroy('end', 'broadcast ended');
      }
    }
  }
}

module.exports = VoiceBroadcast;
