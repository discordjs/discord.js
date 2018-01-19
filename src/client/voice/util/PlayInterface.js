/**
 * Options that can be passed to stream-playing methods:
 * @typedef {Object} StreamOptions
 * @property {string} [type='unknown'] The type of stream. 'unknown', 'converted', 'opus', 'broadcast.
 * @property {number} [seek=0] The time to seek to
 * @property {number|boolean} [volume=1] The volume to play at. Set this to false to disable volume transforms for
 * this stream to improve performance.
 * @property {number} [passes=1] How many times to send the voice packet to reduce packet loss
 * @property {number} [plp] Expected packet loss percentage
 * @property {boolean} [fec] Enabled forward error correction
 * @property {number|string} [bitrate=96] The bitrate (quality) of the audio in kbps.
 * If set to 'auto', the voice channel's bitrate will be used
 * @property {number} [highWaterMark=12] The maximum number of opus packets to make and store before they are
 * actually needed. See https://nodejs.org/en/docs/guides/backpressuring-in-streams/. Setting this value to
 * 1 means that changes in volume will be more instant.
 */

/**
 * An interface class to allow you to play audio over VoiceConnections and VoiceBroadcasts.
 */
class PlayInterface {
  constructor(player) {
    this.player = player;
  }

  /**
   * Play an audio resource.
   * @param {ReadableStream|string} resource The resource to play.
   * @param {StreamOptions} [options] The options to play.
   * @returns {StreamDispatcher}
   */
  play(resource, options = {}) {
    const type = options.type || 'unknown';
    if (type === 'unknown') {
      return this.player.playUnknown(resource, options);
    } else if (type === 'converted') {
      return this.player.playPCMStream(resource, options);
    } else if (type === 'opus') {
      return this.player.playOpusStream(resource, options);
    } else if (type === 'broadcast') {
      if (!this.player.playBroadcast) throw Error('VOICE_PLAY_INTERFACE_NO_BROADCAST');
      return this.player.playBroadcast(resource, options);
    }
    throw Error('VOICE_PLAY_INTERFACE_BAD_TYPE');
  }

  static applyToClass(structure) {
    for (const prop of ['play']) {
      Object.defineProperty(structure.prototype, prop,
        Object.getOwnPropertyDescriptor(PlayInterface.prototype, prop));
    }
  }
}

module.exports = PlayInterface;
