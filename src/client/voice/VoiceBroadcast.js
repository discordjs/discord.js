'use strict';

const EventEmitter = require('events');
const BroadcastAudioPlayer = require('./player/BroadcastAudioPlayer');
const DispatcherSet = require('./util/DispatcherSet');
const PlayInterface = require('./util/PlayInterface');

/**
 * A voice broadcast can be played across multiple voice connections for improved shared-stream efficiency.
 *
 * Example usage:
 * ```js
 * const broadcast = client.createVoiceBroadcast();
 * broadcast.play('./music.mp3');
 * // Play "music.mp3" in all voice connections that the client is in
 * for (const connection of client.voiceConnections.values()) {
 *   connection.play(broadcast);
 * }
 * ```
 * @implements {PlayInterface}
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
   * Play an audio resource.
   * @param {ReadableStream|string} resource The resource to play.
   * @param {StreamOptions} [options] The options to play.
   * @example
   * // Play a local audio file
   * broadcast.play('/home/hydrabolt/audio.mp3', { volume: 0.5 });
   * @example
   * // Play a ReadableStream
   * broadcast.play(ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { filter: 'audioonly' }));
   * @example
   * // Using different protocols: https://ffmpeg.org/ffmpeg-protocols.html
   * broadcast.play('http://www.sample-videos.com/audio/mp3/wave.mp3');
   * @returns {BroadcastDispatcher}
   */
  play() { return null; }
}

PlayInterface.applyToClass(VoiceBroadcast);

module.exports = VoiceBroadcast;
