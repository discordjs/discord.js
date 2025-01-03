'use strict';

const Base = require('./Base');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { GuildMemberFlagsBitField } = require('../util/GuildMemberFlagsBitField');

/**
 * Represents a member of a guild on Discord. Used in interactions from guilds that aren't cached.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class MinimalGuildMember extends Base {
  constructor(client, data, guildId) {
    super(client);

    /**
     * The ID of the guild that this member is part of
     * @type {string}
     */
    this.guildId = guildId;

    /**
     * The nickname of this member, if they have one
     * @type {?string}
     */
    this.nickname = null;

    /**
     * The guild member's avatar hash
     * @type {?string}
     */
    this.avatar = null;

    /**
     * The guild member's banner hash
     * @type {?string}
     */
    this.banner = null;

    /**
     * The role ids of the member
     * @type {Snowflake[]}
     */
    this.roleIds = [];

    /**
     * The timestamp the member joined the guild at
     * @type {?number}
     */
    this.joinedTimestamp = null;

    /**
     * The last timestamp this member started boosting the guild
     * @type {?number}
     */
    this.premiumSinceTimestamp = null;

    /**
     * The flags of this member
     * @type {Readonly<GuildMemberFlagsBitField>}
     */
    this.flags = new GuildMemberFlagsBitField().freeze();

    /**
     * Whether this member has yet to pass the guild's membership gate
     * @type {?boolean}
     */
    this.pending = null;

    /**
     * The timestamp this member's timeout will be removed
     * @type {?number}
     */
    this.communicationDisabledUntilTimestamp = null;

    if (data) this._patch(data);
  }

  _patch(data) {
    if ('user' in data) {
      /**
       * The user that this guild member instance represents
       * @type {User}
       */
      this.user = this.client.users._add(data.user, true);
    }

    if ('nick' in data) this.nickname = data.nick;

    if ('avatar' in data) this.avatar = data.avatar;

    if ('banner' in data) this.banner = data.banner;

    if ('roles' in data) this.roleIds = data.roles;

    if ('joined_at' in data) this.joinedTimestamp = data.joined_at && Date.parse(data.joined_at);

    if ('premium_since' in data) this.premiumSinceTimestamp = data.premium_since && Date.parse(data.premium_since);

    if ('flags' in data) this.flags = new GuildMemberFlagsBitField(data.flags).freeze();

    if ('pending' in data) {
      this.pending = data.pending;
    } else if (!this.partial) {
      // See https://github.com/discordjs/discord.js/issues/6546 for more info.
      this.pending ??= false;
    }

    if ('communication_disabled_until' in data) {
      this.communicationDisabledUntilTimestamp =
        data.communication_disabled_until && Date.parse(data.communication_disabled_until);
    }
  }

  _clone() {
    const clone = super._clone();
    clone.roleIds = this.roleIds.slice();
    return clone;
  }

  /**
   * Whether this member is in a cached guild (true for GuildMembers, false for MinimalGuildMembers)
   * @returns {boolean}
   */
  isInCachedGuild() {
    return false;
  }

  /**
   * Whether this member is a partial (always true for MinimalGuildMembers, as they are partial GuildMembers)
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return true;
  }

  /**
   * A link to the member's guild avatar.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  avatarURL(options = {}) {
    return this.avatar && this.client.rest.cdn.guildMemberAvatar(this.guildId, this.id, this.avatar, options);
  }

  /**
   * A link to the member's banner.
   * @param {ImageURLOptions} [options={}] Options for the banner URL
   * @returns {?string}
   */
  bannerURL(options = {}) {
    return this.banner && this.client.rest.cdn.guildMemberBanner(this.guildId, this.id, this.banner, options);
  }

  /**
   * A link to the member's guild avatar if they have one.
   * Otherwise, a link to their {@link User#displayAvatarURL} will be returned.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {string}
   */
  displayAvatarURL(options) {
    return this.avatarURL(options) ?? this.user.displayAvatarURL(options);
  }

  /**
   * A link to the member's guild banner if they have one.
   * Otherwise, a link to their {@link User#bannerURL} will be returned.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  displayBannerURL(options) {
    return this.bannerURL(options) ?? this.user.bannerURL(options);
  }

  /**
   * The time this member joined the guild
   * @type {?Date}
   * @readonly
   */
  get joinedAt() {
    return this.joinedTimestamp && new Date(this.joinedTimestamp);
  }

  /**
   * The time this member's timeout will be removed
   * @type {?Date}
   * @readonly
   */
  get communicationDisabledUntil() {
    return this.communicationDisabledUntilTimestamp && new Date(this.communicationDisabledUntilTimestamp);
  }

  /**
   * The last time this member started boosting the guild
   * @type {?Date}
   * @readonly
   */
  get premiumSince() {
    return this.premiumSinceTimestamp && new Date(this.premiumSinceTimestamp);
  }

  /**
   * The member's id
   * @type {Snowflake}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * The DM between the client's user and this member
   * @type {?DMChannel}
   * @readonly
   */
  get dmChannel() {
    return this.client.users.dmChannel(this.id);
  }

  /**
   * The nickname of this member, or their user display name if they don't have one
   * @type {string}
   * @readonly
   */
  get displayName() {
    return this.nickname ?? this.user.displayName;
  }

  /**
   * Whether this member is currently timed out
   * @returns {boolean}
   */
  isCommunicationDisabled() {
    return this.communicationDisabledUntilTimestamp > Date.now();
  }

  /**
   * Creates a DM channel between the client and this member.
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<DMChannel>}
   */
  createDM(force = false) {
    return this.user.createDM(force);
  }

  /**
   * Deletes a DM channel (if one exists) between the client and the member. Resolves with the channel if successful.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.user.deleteDM();
  }

  /**
   * Whether this guild member equals another guild member. It compares all properties, so for most
   * comparison it is advisable to just compare `member.id === member2.id` as it is significantly faster
   * and is often what most users need.
   * @param {MinimalGuildMember} member The member to compare with
   * @returns {boolean}
   */
  equals(member) {
    return (
      member instanceof this.constructor &&
      this.id === member.id &&
      this.partial === member.partial &&
      this.guildId === member.guildId &&
      this.joinedTimestamp === member.joinedTimestamp &&
      this.nickname === member.nickname &&
      this.avatar === member.avatar &&
      this.pending === member.pending &&
      this.communicationDisabledUntilTimestamp === member.communicationDisabledUntilTimestamp &&
      this.flags.bitfield === member.flags.bitfield &&
      (this.roleIds === member.roleIds ||
        (this.roleIds.length === member.roleIds.length && this.roleIds.every((role, i) => role === member.roleIds[i])))
    );
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the GuildMember object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${member}!`);
   */
  toString() {
    return this.user.toString();
  }

  toJSON() {
    const json = super.toJSON({
      guildId: true,
      user: 'userId',
      displayName: true,
      roles: true,
    });
    json.avatarURL = this.avatarURL();
    json.bannerURL = this.bannerURL();
    json.displayAvatarURL = this.displayAvatarURL();
    json.displayBannerURL = this.displayBannerURL();
    return json;
  }
}

/**
 * Sends a message to this user.
 * @method send
 * @memberof MinimalGuildMember
 * @instance
 * @param {string|MessagePayload|MessageCreateOptions} options The options to provide
 * @returns {Promise<Message>}
 * @example
 * // Send a direct message
 * guildMember.send('Hello!')
 *   .then(message => console.log(`Sent message: ${message.content} to ${guildMember.displayName}`))
 *   .catch(console.error);
 */

TextBasedChannel.applyToClass(MinimalGuildMember);

module.exports = MinimalGuildMember;
