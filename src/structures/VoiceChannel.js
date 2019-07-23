'use strict';

const GuildChannel = require('./GuildChannel');
const Invite = require('./Invite');
const { browser } = require('../util/Constants');
const Permissions = require('../util/Permissions');
const Collection = require('../util/Collection');
const { Error } = require('../errors');

/**
 * Represents a guild voice channel on Discord.
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {
  _patch(data) {
    super._patch(data);
    /**
     * The bitrate of this voice channel
     * @type {number}
     */
    this.bitrate = data.bitrate;

    /**
     * The maximum amount of users allowed in this channel - 0 means unlimited.
     * @type {number}
     */
    this.userLimit = data.user_limit;
  }

  /**
   * The members in this voice channel
   * @type {Collection<Snowflake, GuildMember>}
   * @name VoiceChannel#members
   * @readonly
   */
  get members() {
    const coll = new Collection();
    for (const state of this.guild.voiceStates.values()) {
      if (state.channelID === this.id && state.member) {
        coll.set(state.id, state.member);
      }
    }
    return coll;
  }

  /**
   * Checks if the voice channel is full
   * @type {boolean}
   * @readonly
   */
  get full() {
    return this.userLimit > 0 && this.members.size >= this.userLimit;
  }

  /**
   * Whether the channel is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return super.deletable && this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false);
  }

  /**
   * Whether the channel is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    return this.manageable && this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false);
  }

  /**
   * Whether the channel is joinable by the client user
   * @type {boolean}
   * @readonly
   */
  get joinable() {
    if (browser) return false;
    if (!this.viewable) return false;
    if (!this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false)) return false;
    if (this.full && !this.permissionsFor(this.client.user).has(Permissions.FLAGS.MOVE_MEMBERS, false)) return false;
    return true;
  }

  /**
   * Checks if the client has permission to send audio to the voice channel
   * @type {boolean}
   * @readonly
   */
  get speakable() {
    return this.permissionsFor(this.client.user).has('SPEAK', false);
  }

  /**
   * Creates an invite to this guild channel.
   * @param {Object} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @param {boolean} [options.unique=false] Create a unique invite, or use an existing one with similar settings
   * @param {string} [options.reason] Reason for creating this
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite({ temporary = false, maxAge = 86400, maxUses = 0, unique, reason } = {}) {
    return this.client.api.channels(this.id).invites.post({
      data: {
        temporary, max_age: maxAge, max_uses: maxUses, unique,
      }, reason
    })
      .then(invite => new Invite(this.client, invite));
  }

  /**
   * Fetches a collection of invites to this guild channel.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  async fetchInvites() {
    const inviteItems = await this.client.api.channels(this.id).invites.get();
    const invites = new Collection();
    for (const inviteItem of inviteItems) {
      const invite = new Invite(this.client, inviteItem);
      invites.set(invite.code, invite);
    }
    return invites;
  }

  /**
   * Sets the bitrate of the channel.
   * @param {number} bitrate The new bitrate
   * @param {string} [reason] Reason for changing the channel's bitrate
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the bitrate of a voice channel
   * voiceChannel.setBitrate(48000)
   *   .then(vc => console.log(`Set bitrate to ${vc.bitrate}bps for ${vc.name}`))
   *   .catch(console.error);
   */
  setBitrate(bitrate, reason) {
    return this.edit({ bitrate }, reason);
  }

  /**
   * Sets the user limit of the channel.
   * @param {number} userLimit The new user limit
   * @param {string} [reason] Reason for changing the user limit
   * @returns {Promise<VoiceChannel>}
   * @example
   * // Set the user limit of a voice channel
   * voiceChannel.setUserLimit(42)
   *   .then(vc => console.log(`Set user limit to ${vc.userLimit} for ${vc.name}`))
   *   .catch(console.error);
   */
  setUserLimit(userLimit, reason) {
    return this.edit({ userLimit }, reason);
  }

  /**
   * Attempts to join this voice channel.
   * @returns {Promise<VoiceConnection>}
   * @example
   * // Join a voice channel
   * voiceChannel.join()
   *   .then(connection => console.log('Connected!'))
   *   .catch(console.error);
   */
  join() {
    if (browser) return Promise.reject(new Error('VOICE_NO_BROWSER'));
    return this.client.voice.joinChannel(this);
  }

  /**
   * Leaves this voice channel.
   * @example
   * // Leave a voice channel
   * voiceChannel.leave();
   */
  leave() {
    if (browser) return;
    const connection = this.client.voice.connections.get(this.guild.id);
    if (connection && connection.channel.id === this.id) connection.disconnect();
  }
}

module.exports = VoiceChannel;
