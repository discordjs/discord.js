'use strict';

const Base = require('./Base');
const { Error, TypeError } = require('../errors');

/**
 * Represents the voice state for a Guild Member.
 */
class VoiceState extends Base {
  /**
   * @param {Guild} guild The guild the voice state is part of
   * @param {Object} data The data for the voice state
   */
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
    this.serverDeaf = 'deaf' in data ? data.deaf : null;
    /**
     * Whether this member is muted server-wide
     * @type {?boolean}
     */
    this.serverMute = 'mute' in data ? data.mute : null;
    /**
     * Whether this member is self-deafened
     * @type {?boolean}
     */
    this.selfDeaf = 'self_deaf' in data ? data.self_deaf : null;
    /**
     * Whether this member is self-muted
     * @type {?boolean}
     */
    this.selfMute = 'self_mute' in data ? data.self_mute : null;
    /**
     * Whether this member's camera is enabled
     * @type {?boolean}
     */
    this.selfVideo = 'self_video' in data ? data.self_video : null;
    /**
     * The session ID of this member's connection
     * @type {?string}
     */
    this.sessionID = 'session_id' in data ? data.session_id : null;
    /**
     * Whether this member is streaming using "Go Live"
     * @type {boolean}
     */
    this.streaming = data.self_stream || false;
    /**
     * The ID of the voice or stage channel that this member is in
     * @type {?Snowflake}
     */
    this.channelID = data.channel_id || null;
    /**
     * Whether this member is suppressed from speaking. This property is specific to stage channels only.
     * @type {boolean}
     */
    this.suppress = data.suppress;
    /**
     * The time at which the member requested to speak. This property is specific to stage channels only.
     * @type {?number}
     */
    this.requestToSpeakTimestamp = data.request_to_speak_timestamp
      ? new Date(data.request_to_speak_timestamp).getTime()
      : null;
    return this;
  }

  /**
   * The member that this voice state belongs to
   * @type {?GuildMember}
   * @readonly
   */
  get member() {
    return this.guild.members.cache.get(this.id) || null;
  }

  /**
   * The channel that the member is connected to
   * @type {?VoiceChannel|StageChannel}
   * @readonly
   */
  get channel() {
    return this.guild.channels.cache.get(this.channelID) || null;
  }

  /**
   * Whether this member is either self-deafened or server-deafened
   * @type {?boolean}
   * @readonly
   */
  get deaf() {
    return this.serverDeaf || this.selfDeaf;
  }

  /**
   * Whether this member is either self-muted or server-muted
   * @type {?boolean}
   * @readonly
   */
  get mute() {
    return this.serverMute || this.selfMute;
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

  /**
   * Kicks the member from the channel.
   * @param {string} [reason] Reason for kicking member from the channel
   * @returns {Promise<GuildMember>}
   */
  kick(reason) {
    return this.setChannel(null, reason);
  }

  /**
   * Moves the member to a different channel, or disconnects them from the one they're in.
   * @param {ChannelResolvable|null} [channel] Channel to move the member to, or `null` if you want to disconnect them
   * from voice.
   * @param {string} [reason] Reason for moving member to another channel or disconnecting
   * @returns {Promise<GuildMember>}
   */
  setChannel(channel, reason) {
    return this.member
      ? this.member.edit({ channel }, reason)
      : Promise.reject(new Error('VOICE_STATE_UNCACHED_MEMBER'));
  }

  /**
   * Toggles the request to speak in the channel.
   * Only applicable for stage channels and for the client's own voice state.
   * @param {boolean} request Whether or not the client is requesting to become a speaker.
   * @example
   * // Making the client request to speak in a stage channel (raise its hand)
   * guild.me.voice.setRequestToSpeak(true);
   * @example
   * // Making the client cancel a request to speak
   * guild.me.voice.setRequestToSpeak(false);
   * @returns {Promise<void>}
   */
  async setRequestToSpeak(request) {
    const channel = this.channel;
    if (channel?.type !== 'stage') throw new Error('VOICE_NOT_STAGE_CHANNEL');

    if (this.client.user.id !== this.id) throw new Error('VOICE_STATE_NOT_OWN');

    await this.client.api.guilds(this.guild.id, 'voice-states', '@me').patch({
      data: {
        channel_id: this.channelID,
        request_to_speak_timestamp: request ? new Date().toISOString() : null,
      },
    });
  }

  /**
   * Suppress/unsuppress the user. Only applicable for stage channels.
   * @param {boolean} suppressed - Whether or not the user should be suppressed.
   * @example
   * // Making the client a speaker
   * guild.me.voice.setSuppressed(false);
   * @example
   * // Making the client an audience member
   * guild.me.voice.setSuppressed(true);
   * @example
   * // Inviting another user to speak
   * voiceState.setSuppressed(false);
   * @example
   * // Moving another user to the audience, or cancelling their invite to speak
   * voiceState.setSuppressed(true);
   * @returns {Promise<void>}
   */
  async setSuppressed(suppressed) {
    if (typeof suppressed !== 'boolean') throw new TypeError('VOICE_STATE_INVALID_TYPE', 'suppressed');

    const channel = this.channel;
    if (channel?.type !== 'stage') throw new Error('VOICE_NOT_STAGE_CHANNEL');

    const target = this.client.user.id === this.id ? '@me' : this.id;

    await this.client.api.guilds(this.guild.id, 'voice-states', target).patch({
      data: {
        channel_id: this.channelID,
        suppress: suppressed,
      },
    });
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
