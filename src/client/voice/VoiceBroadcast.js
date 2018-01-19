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
 * broadcast.playFile('./music.mp3');
 * // Play "music.mp3" in all voice connections that the client is in
 * for (const connection of client.voiceConnections.values()) {
 *   connection.playBroadcast(broadcast);
 * }
 * ```
 * @implements {VolumeInterface}
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
}

PlayInterface.applyToClass(VoiceBroadcast);

module.exports = VoiceBroadcast;
