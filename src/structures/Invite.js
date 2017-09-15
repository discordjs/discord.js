const { Endpoints } = require('../util/Constants');
const Base = require('./Base');

/**
 * Represents an invitation to a guild channel.
 * <warn>The only guaranteed properties are `code`, `guild` and `channel`. Other properties can be missing.</warn>
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
     * @type {Guild}
     */
    this.guild = this.client.guilds.create(data.guild, false);

    /**
     * The code for this invite
     * @type {string}
     */
    this.code = data.code;

    /**
     * The approximate number of online members of the guild this invite is for
     * @type {number}
     */
    this.presenceCount = data.approximate_presence_count;

    /**
     * The approximate total number of members of the guild this invite is for
     * @type {number}
     */
    this.memberCount = data.approximate_member_count;

    /**
     * The number of text channels the guild this invite goes to has
     * @type {number}
     */
    this.textChannelCount = data.guild.text_channel_count;

    /**
     * The number of voice channels the guild this invite goes to has
     * @type {number}
     */
    this.voiceChannelCount = data.guild.voice_channel_count;

    /**
     * Whether or not this invite is temporary
     * @type {boolean}
     */
    this.temporary = data.temporary;

    /**
     * The maximum age of the invite, in seconds
     * @type {?number}
     */
    this.maxAge = data.max_age;

    /**
     * How many times this invite has been used
     * @type {number}
     */
    this.uses = data.uses;

    /**
     * The maximum uses of this invite
     * @type {number}
     */
    this.maxUses = data.max_uses;

    if (data.inviter) {
      /**
       * The user who created this invite
       * @type {User}
       */
      this.inviter = this.client.users.create(data.inviter);
    }

    /**
     * The channel the invite is for
     * @type {GuildChannel}
     */
    this.channel = this.client.channels.create(data.channel, this.guild, false);

    /**
     * The timestamp the invite was created at
     * @type {number}
     */
    this.createdTimestamp = new Date(data.created_at).getTime();
  }

  /**
   * The time the invite was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The timestamp the invite will expire at
   * @type {number}
   * @readonly
   */
  get expiresTimestamp() {
    return this.createdTimestamp + (this.maxAge * 1000);
  }

  /**
   * The time the invite will expire
   * @type {Date}
   * @readonly
   */
  get expiresAt() {
    return new Date(this.expiresTimestamp);
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
}

module.exports = Invite;
