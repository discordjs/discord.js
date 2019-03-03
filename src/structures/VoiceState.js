'use strict';

const Base = require('./Base');

/**
 * Represents the voice state for a Guild Member.
 */
class VoiceState extends Base {
  constructor(guild, data) {
    super(guild.client);
    /**
     * The guild of this voice state
     * @type {Guild}
     */
    this.guild = guild;
    /**
     * The ID of the member of this voice state
     * @type {Snowflake}
     */
    this.id = data.user_id;
    this._patch(data);
  }

  _patch(data) {
    /**
     * Whether this member is deafened server-wide
     * @type {?boolean}
     */
    this.serverDeaf = data.deaf;
    /**
     * Whether this member is muted server-wide
     * @type {?boolean}
     */
    this.serverMute = data.mute;
    /**
     * Whether this member is self-deafened
     * @type {?boolean}
     */
    this.selfDeaf = data.self_deaf;
    /**
     * Whether this member is self-muted
     * @type {?boolean}
     */
    this.selfMute = data.self_mute;
    /**
     * The session ID of this member's connection
     * @type {?string}
     */
    this.sessionID = data.session_id;
    /**
     * The ID of the voice channel that this member is in
     * @type {?Snowflake}
     */
    this.channelID = data.channel_id;
    return this;
  }

  /**
   * The member that this voice state belongs to
   * @type {?GuildMember}
   */
  get member() {
    return this.guild.members.get(this.id) || null;
  }

  /**
   * The channel that the member is connected to
   * @type {?VoiceChannel}
   */
  get channel() {
    return this.guild.channels.get(this.channelID) || null;
  }

  /**
   * Whether this member is either self-deafened or server-deafened
   * @type {?boolean}
   */
  get deaf() {
    return this.serverDeaf || this.selfDeaf;
  }

  /**
   * Whether this member is either self-muted or server-muted
   * @type {?boolean}
   */
  get mute() {
    return this.serverMute || this.selfMute;
  }

  /**
   * Whether this member is currently speaking. A boolean if the information is available (aka
   * the bot is connected to any voice channel in the guild), otherwise this is null
   * @type {?boolean}
   */
  get speaking() {
    return this.channel && this.channel.connection ?
      Boolean(this.channel.connection._speaking.get(this.id)) :
      null;
  }

  /**
   * Mutes/unmutes the member of this voice state.
   * @param {boolean} mute Whether or not the member should be muted
   * @param {string} [reason] Reason for muting or unmuting
   * @returns {Promise<GuildMember>}
   */
  setMute(mute, reason) {
    return this.member ? this.member.edit({ mute }, reason) : Promise.reject(new Error('VOICE_STATE_UNCACHED_MEMBER'));
  }

  /**
   * Deafens/undeafens the member of this voice state.
   * @param {boolean} deaf Whether or not the member should be deafened
   * @param {string} [reason] Reason for deafening or undeafening
   * @returns {Promise<GuildMember>}
   */
  setDeaf(deaf, reason) {
    return this.member ? this.member.edit({ deaf }, reason) : Promise.reject(new Error('VOICE_STATE_UNCACHED_MEMBER'));
  }

  toJSON() {
    return super.toJSON({
      id: true,
      serverDeaf: true,
      serverMute: true,
      selfDeaf: true,
      selfMute: true,
      sessionID: true,
      channelID: 'channel',
    });
  }
}

module.exports = VoiceState;
