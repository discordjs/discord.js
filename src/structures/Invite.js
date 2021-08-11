'use strict';

const Base = require('./Base');
const IntegrationApplication = require('./IntegrationApplication');
const InviteStageInstance = require('./InviteStageInstance');
const { Error } = require('../errors');
const { Endpoints } = require('../util/Constants');
const Permissions = require('../util/Permissions');

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
    const InviteGuild = require('./InviteGuild');
    const Guild = require('./Guild');
    /**
     * The guild the invite is for including welcome screen data if present
     * @type {?(Guild|InviteGuild)}
     */
    this.guild = null;
    if (data.guild) {
      this.guild = data.guild instanceof Guild ? data.guild : new InviteGuild(this.client, data.guild);
    }

    /**
     * The code for this invite
     * @type {string}
     */
    this.code = data.code;

    /**
     * The approximate number of online members of the guild this invite is for
     * @type {?number}
     */
    this.presenceCount = data.approximate_presence_count ?? null;

    /**
     * The approximate total number of members of the guild this invite is for
     * @type {?number}
     */
    this.memberCount = data.approximate_member_count ?? null;

    /**
     * Whether or not this invite is temporary
     * @type {?boolean}
     */
    this.temporary = data.temporary ?? null;

    /**
     * The maximum age of the invite, in seconds, 0 if never expires
     * @type {?number}
     */
    this.maxAge = data.max_age ?? null;

    /**
     * How many times this invite has been used
     * @type {?number}
     */
    this.uses = data.uses ?? null;

    /**
     * The maximum uses of this invite
     * @type {?number}
     */
    this.maxUses = data.max_uses ?? null;

    /**
     * The user who created this invite
     * @type {?User}
     */
    this.inviter = data.inviter ? this.client.users._add(data.inviter) : null;

    /**
     * The user whose stream to display for this voice channel stream invite
     * @type {?User}
     */
    this.targetUser = data.target_user ? this.client.users._add(data.target_user) : null;

    /**
     * The embedded application to open for this voice channel embedded application invite
     * @type {?IntegrationApplication}
     */
    this.targetApplication = data.target_application
      ? new IntegrationApplication(this.client, data.target_application)
      : null;

    /**
     * The type of the invite target:
     * * 1: STREAM
     * * 2: EMBEDDED_APPLICATION
     * @typedef {number} TargetType
     * @see {@link https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types}
     */

    /**
     * The target type
     * @type {?TargetType}
     */
    this.targetType = data.target_type ?? null;

    /**
     * The channel the invite is for
     * @type {Channel}
     */
    this.channel = this.client.channels._add(data.channel, this.guild, { cache: false });

    /**
     * The timestamp the invite was created at
     * @type {?number}
     */
    this.createdTimestamp = 'created_at' in data ? new Date(data.created_at).getTime() : null;

    this._expiresTimestamp = 'expires_at' in data ? new Date(data.expires_at).getTime() : null;

    /**
     * The stage instance data if there is a public {@link StageInstance} in the stage channel this invite is for
     * @type {?InviteStageInstance}
     */
    this.stageInstance =
      'stage_instance' in data
        ? new InviteStageInstance(this.client, data.stage_instance, this.channel.id, this.guild.id)
        : null;
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
    if (!guild || !this.client.guilds.cache.has(guild.id)) return false;
    if (!guild.me) throw new Error('GUILD_UNCACHED_ME');
    return (
      this.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS, false) ||
      guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
    );
  }

  /**
   * The timestamp the invite will expire at
   * @type {?number}
   * @readonly
   */
  get expiresTimestamp() {
    return (
      this._expiresTimestamp ??
      (this.createdTimestamp && this.maxAge ? this.createdTimestamp + this.maxAge * 1000 : null)
    );
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
  async delete(reason) {
    await this.client.api.invites[this.code].delete({ reason });
    return this;
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
      channel: 'channelId',
      inviter: 'inviterId',
      guild: 'guildId',
    });
  }

  valueOf() {
    return this.code;
  }
}

/**
 * Regular expression that globally matches Discord invite links
 * @type {RegExp}
 */
Invite.INVITES_PATTERN = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;

module.exports = Invite;
