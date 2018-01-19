const EventEmitter = require('events');
const BroadcastAudioPlayer = require('./player/BroadcastAudioPlayer');
const DispatcherSet = require('./util/DispatcherSet');

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
class VoiceBroadcast extends EventEmitter {
  constructor(client) {
    super();
    /**
     * The client that created the broadcast
     * @type {Client}
     */
    this.client = client;
    this.dispatchers = new DispatcherSet(this);
    this.player = new BroadcastAudioPlayer(this);
  }

  /**
   * The current master dispatcher, if any. This dispatcher controls all that is played by subscribed dispatchers.
   * @type {?BroadcastDispatcher}
   */
  get dispatcher() {
    return this.player.dispatcher;
  }

  /**
   * Plays the given file in the voice connection.
   * @param {string} file The absolute path to the file
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {BroadcastDispatcher}
   * @example
   * // Play files natively
   * voiceChannel.join()
   *   .then(connection => {
   *     const dispatcher = connection.playFile('C:/Users/Discord/Desktop/music.mp3');
   *   })
   *   .catch(console.error);
   */
  playFile(file, options) {
    return this.player.playUnknown(file, options);
  }

  /**
   * Plays an arbitrary input that can be [handled by ffmpeg](https://ffmpeg.org/ffmpeg-protocols.html#Description)
   * @param {string} input the arbitrary input
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {BroadcastDispatcher}
   */
  playArbitraryInput(input, options) {
    return this.player.playUnknown(input, options);
  }

  /**
   * Plays and converts an audio stream in the voice connection.
   * @param {ReadableStream} stream The audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {BroadcastDispatcher}
   * @example
   * // Play streams using ytdl-core
   * const ytdl = require('ytdl-core');
   * const streamOptions = { seek: 0, volume: 1 };
   * voiceChannel.join()
   *   .then(connection => {
   *     const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', { filter : 'audioonly' });
   *     const dispatcher = connection.playStream(stream, streamOptions);
   *   })
   *   .catch(console.error);
   */
  playStream(stream, options) {
    return this.player.playUnknown(stream, options);
  }

  /**
   * Plays a stream of 16-bit signed stereo PCM.
   * @param {ReadableStream} stream The audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {BroadcastDispatcher}
   */
  playConvertedStream(stream, options) {
    return this.player.playPCMStream(stream, options);
  }

  /**
   * Plays an Opus encoded stream.
   * <warn>Note that inline volume is not compatible with this method.</warn>
   * @param {ReadableStream} stream The Opus audio stream to play
   * @param {StreamOptions} [options] Options for playing the stream
   * @returns {BroadcastDispatcher}
   */
  playOpusStream(stream, options) {
    return this.player.playOpusStream(stream, options);
  }
}

module.exports = VoiceBroadcast;
