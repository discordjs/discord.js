const prism = require('prism-media');
const StreamDispatcher = require('../dispatcher/StreamDispatcher');
const BasePlayer = require('./BasePlayer');

/**
 * An Audio Player for a Voice Connection.
 * @private
 * @extends {EventEmitter}
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
    broadcast.dispatchers.push(dispatcher);
    return dispatcher;
  }
}

module.exports = AudioPlayer;
