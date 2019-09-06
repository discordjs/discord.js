'use strict';

const { Endpoints } = require('../util/Constants');
const Permissions = require('../util/Permissions');
const Base = require('./Base');

/**
 * Represents an invitation to a guild channel.
 * <warn>The only guaranteed properties are `code`, `channel`, and `url`. Other properties can be missing.</warn>
 * @extends {Base}
 */
class Invite extends Base {
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  _patch(data) {
    /**
     * The guild the invite is for
     * @type {?Guild}
     */
    this.guild = data.guild ? this.client.guilds.add(data.guild, false) : null;

    /**
     * The code for this invite
     * @type {string}
     */
    this.code = data.code;

    /**
     * The approximate number of online members of the guild this invite is for
     * @type {?number}
     */
    this.presenceCount = 'approximate_presence_count' in data ? data.approximate_presence_count : null;

    /**
     * The approximate total number of members of the guild this invite is for
     * @type {?number}
     */
    this.memberCount = 'approximate_member_count' in data ? data.approximate_member_count : null;

    /**
     * Whether or not this invite is temporary
     * @type {?boolean}
     */
    this.temporary = 'temporary' in data ? data.temporary : null;

    /**
     * The maximum age of the invite, in seconds, 0 if never expires
     * @type {?number}
     */
    this.maxAge = 'max_age' in data ? data.max_age : null;

    /**
     * How many times this invite has been used
     * @type {?number}
     */
    this.uses = 'uses' in data ? data.uses : null;

    /**
     * The maximum uses of this invite
     * @type {?number}
     */
    this.maxUses = 'max_uses' in data ? data.max_uses : null;

    /**
     * The user who created this invite
     * @type {?User}
     */
    this.inviter = data.inviter ? this.client.users.add(data.inviter) : null;

    /**
     * The target user for this invite
     * @type {?User}
     */
    this.targetUser = data.target_user ? this.client.users.add(data.target_user) : null;

    /**
     * The type of the target user:
     * * 1: STREAM
     * @typedef {number} TargetUser
     */

    /**
     * The target user type
     * @type {?TargetUser}
     */
    this.targetUserType = typeof data.target_user_type === 'number' ? data.target_user_type : null;

    /**
     * The channel the invite is for
     * @type {Channel}
     */
    this.channel = this.client.channels.add(data.channel, this.guild, false);

    /**
     * The timestamp the invite was created at
     * @type {?number}
     */
    this.createdTimestamp = 'created_at' in data ? new Date(data.created_at).getTime() : null;
  }

  /**
   * The time the invite was created at
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.createdTimestamp ? new Date(this.createdTimestamp) : null;
  }

  /**
   * Whether the invite is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    const guild = this.guild;
    if (!guild || !this.client.guilds.has(guild.id)) return false;
    if (!guild.me) throw new Error('GUILD_UNCACHED_ME');
    return this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS, false) ||
      guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD);
  }

  /**
   * The timestamp the invite will expire at
   * @type {?number}
   * @readonly
   */
  get expiresTimestamp() {
    return this.createdTimestamp && this.maxAge ? this.createdTimestamp + (this.maxAge * 1000) : null;
  }

  /**
   * The time the invite will expire at
   * @type {?Date}
   * @readonly
   */
  get expiresAt() {
    const { expiresTimestamp } = this;
    return expiresTimestamp ? new Date(expiresTimestamp) : null;
  }

  /**
   * The URL to the invite
   * @type {string}
   * @readonly
   */
  get url() {
    return Endpoints.invite(this.client.options.http.invite, this.code);
  }

  /**
   * Deletes this invite.
   * @param {string} [reason] Reason for deleting this invite
   * @returns {Promise<Invite>}
   */
  delete(reason) {
    return this.client.api.invites[this.code].delete({ reason }).then(() => this);
  }

  /**
   * When concatenated with a string, this automatically concatenates the invite's URL instead of the object.
   * @returns {string}
   * @example
   * // Logs: Invite: https://discord.gg/A1b2C3
   * console.log(`Invite: ${invite}`);
   */
  toString() {
    return this.url;
  }

  toJSON() {
    return super.toJSON({
      url: true,
      expiresTimestamp: true,
      presenceCount: false,
      memberCount: false,
      uses: false,
      channel: 'channelID',
      inviter: 'inviterID',
      guild: 'guildID',
    });
  }
}

module.exports = Invite;
