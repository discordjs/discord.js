'use strict';

const BasePlayer = require('./BasePlayer');

/**
 * An Audio Player for a Voice Connection.
 * @private
 * @extends {BasePlayer}
 */
class AudioPlayer extends BasePlayer {
  constructor(voiceConnection) {
    super();
    /**
     * The voice connection that the player serves
     * @type {VoiceConnection}
     */
    this.voiceConnection = voiceConnection;
  }

  playBroadcast(broadcast, options) {
    const dispatcher = this.createDispatcher(options, { broadcast });
    broadcast.add(dispatcher);
    return dispatcher;
  }
}

module.exports = AudioPlayer;
