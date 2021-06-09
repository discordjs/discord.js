'use strict';

const Base = require('./Base');

/**
 * Represents a WidgetMember.
 */
class WidgetMember extends Base {
  /**
   * Activity sent in a {@link WidgetMember}.
   * @typedef {Object} WidgetActivity
   * @property {string} name The name of the activity
   */

  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The raw data
   */
  constructor(client, data) {
    super(client);

    /**
     * The id of the user. It's an arbitrary number.
     * @type {string}
     */
    this.id = data.id;

    /**
     * The username of the member.
     * @type {string}
     */
    this.username = data.username;

    /**
     * The discriminator of the member.
     * @type {string}
     */
    this.discriminator = data.discriminator;

    /**
     * The avatar of the member.
     * @type {?string}
     */
    this.avatar = data.avatar;

    /**
     * The status of the member.
     * @type {PresenceStatus}
     */
    this.status = data.status;

    /**
     * If the user is in a VoiceChannel, it's the deaf state of the member.
     * @type {?boolean}
     */
    this.deaf = data.deaf;

    /**
     * If the user is in a VoiceChannel, it's the mute state of the member.
     * @type {?boolean}
     */
    this.mute = data.mute;

    /**
     * If the user is in a VoiceChannel, it's the selfDeaf state of the member.
     * @type {?boolean}
     */
    this.selfDeaf = data.self_deaf;

    /**
     * If the user is in a VoiceChannel, it's the selfMute state of the member.
     * @type {?boolean}
     */
    this.selfMute = data.self_mute;

    /**
     * If the user is in a VoiceChannel, it's the supress state of the member.
     * @type {?boolean}
     */
    this.suppress = data.suppress;

    /**
     * If the user is in a VoiceChannel, it's the id of the VoiceChannel of the member.
     * @type {?Snowflake}
     */
    this.channelID = data.channel_id;

    /**
     * The avatarUrl of the member.
     * @type {string}
     */
    this.avatarURL = data.avatar_url;

    /**
     * The activity of the member.
     * @type {?WidgetActivity}
     */
    this.activity = data.activity;
  }
}

module.exports = WidgetMember;
