'use strict';

const EventEmitter = require('events');
const BroadcastAudioPlayer = require('./player/BroadcastAudioPlayer');
const PlayInterface = require('./util/PlayInterface');
const { Events } = require('../../util/Constants');

/**
 * A voice broadcast can be played across multiple voice connections for improved shared-stream efficiency.
 *
 * Example usage:
 * ```js
 * const broadcast = client.voice.createBroadcast();
 * broadcast.play('./music.mp3');
 * // Play "music.mp3" in all voice connections that the client is in
 * for (const connection of client.voice.connections.values()) {
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
    /**
     * The subscribed StreamDispatchers of this broadcast
     * @type {StreamDispatcher[]}
     */
    this.subscribers = [];
    this.player = new BroadcastAudioPlayer(this);
  }

  /**
   * The current master dispatcher, if any. This dispatcher controls all that is played by subscribed dispatchers.
   * @type {?BroadcastDispatcher}
   * @readonly
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
  play() {
    return null;
  }

  /**
   * Ends the broadcast, unsubscribing all subscribed channels and deleting the broadcast
   */
  end() {
    for (const dispatcher of this.subscribers) this.delete(dispatcher);
    const index = this.client.voice.broadcasts.indexOf(this);
    if (index !== -1) this.client.voice.broadcasts.splice(index, 1);
  }

  add(dispatcher) {
    const index = this.subscribers.indexOf(dispatcher);
    if (index === -1) {
      this.subscribers.push(dispatcher);
      /**
       * Emitted whenever a stream dispatcher subscribes to the broadcast.
       * @event VoiceBroadcast#subscribe
       * @param {StreamDispatcher} subscriber The subscribed dispatcher
       */
      this.emit(Events.VOICE_BROADCAST_SUBSCRIBE, dispatcher);
      return true;
    } else {
      return false;
    }
  }

  delete(dispatcher) {
    const index = this.subscribers.indexOf(dispatcher);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
      dispatcher.destroy();
      /**
       * Emitted whenever a stream dispatcher unsubscribes to the broadcast.
       * @event VoiceBroadcast#unsubscribe
       * @param {StreamDispatcher} dispatcher The unsubscribed dispatcher
       */
      this.emit(Events.VOICE_BROADCAST_UNSUBSCRIBE, dispatcher);
      return true;
    }
    return false;
  }
}

PlayInterface.applyToClass(VoiceBroadcast);

module.exports = VoiceBroadcast;
