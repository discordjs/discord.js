'use strict';

const Base = require('./Base');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { GuildMemberFlagsBitField } = require('../util/GuildMemberFlagsBitField');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * Represents a member of a guild on Discord. Used in interactions from guilds that aren't cached.
 * Backwards compatible with {@link APIGuildMember}.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class UncachedGuildMember extends Base {
  constructor(client, data, guildId) {
    super(client);

    /**
     * The ID of the guild that this member is part of
     * @type {string}
     */
    this.guildId = guildId;

    /**
     * The user that this guild member instance represents
     * @type {User}
     */
    this.user = this.client.users._add(data.user, true);

    /**
     * The nickname of this member, if they have one
     * @type {?string}
     */
    this.nickname = data.nick;

    /**
     * The guild member's avatar hash
     * @type {?string}
     */
    this.avatar = data.avatar;

    /**
     * The role ids of the member
     * @name UncachedGuildMember#roleIds
     * @type {Snowflake[]}
     */
    this.roleIds = data.roles;

    /**
     * The timestamp the member joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = Date.parse(data.joined_at);

    /**
     * The timestamp the member joined the guild at, as an ISO8601 timestamp
     * @type {string}
     * @deprecated Use {@link UncachedGuildMember#joinedTimestamp} or {@link UncachedGuildMember#joinedAt} instead
     */
    this.joined_at = data.joined_at;

    /**
     * The last timestamp this member started boosting the guild
     * @type {?number}
     */
    this.premiumSinceTimestamp = data.premium_since ? Date.parse(data.premium_since) : null;

    /**
     * The last timestamp this member started boosting the guild, as an ISO8601 timestamp
     * @type {?string}
     * @deprecated Use {@link UncachedGuildMember#premiumSinceTimestamp}
     * or {@link UncachedGuildMember#premiumSince} instead
     */
    this.premium_since = data.premium_since;

    /**
     * Whether the user is deafened in voice channels
     * @type {boolean | undefined}
     */
    this.deaf = data.deaf;

    /**
     * Whether the user is muted in voice channels
     * @type {boolean | undefined}
     */
    this.mute = data.mute;

    /**
     * The flags of this member
     * @type {Readonly<GuildMemberFlagsBitField>}
     */
    this.parsedFlags = new GuildMemberFlagsBitField(data.flags).freeze();

    /**
     * The raw flags of this member
     * @type {number}
     * @deprecated Use {@link UncachedGuildMember#parsedFlags} instead.
     * This field will be replaced with parsedFlags in the future.
     */
    this.flags = data.flags;

    /**
     * Whether this member has yet to pass the guild's membership gate
     * @type {?boolean}
     */
    this.pending = data.pending;

    /**
     * The total permissions of the member in this channel, including overwrites
     * @type {Readonly<PermissionsBitField>}
     */
    this.parsedPermissions = new PermissionsBitField(data.permissions).freeze();

    /**
     * Raw total permissions of the member in this channel, including overwrites
     * @type {?string}
     * @deprecated Use {@link UncachedGuildMember#parsedPermissions} instead.
     * This field will be replaced with parsedPermissions in the future.
     */
    this.permissions = data.permissions;

    /**
     * The timestamp this member's timeout will be removed
     * @type {?number}
     */
    this.communicationDisabledUntilTimestamp =
      data.communication_disabled_until && Date.parse(data.communication_disabled_until);

    /**
     * The timestamp this member's timeout will be removed, as an ISO8601 timestamp
     * @type {?string}
     * @deprecated Use {@link UncachedGuildMember#communicationDisabledUntilTimestamp}
     * or {@link UncachedGuildMember#communicationDisabledUntil} instead
     */
    this.communication_disabled_until = data.communication_disabled_until;

    /**
     * Whether this UncachedGuildMember is a partial (always true, as it is a partial GuildMember)
     * @type {boolean}
     * @readonly
     */
    this.partial = true;
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
   * A link to the member's guild avatar if they have one.
   * Otherwise, a link to their {@link User#displayAvatarURL} will be returned.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {string}
   */
  displayAvatarURL(options) {
    return this.avatarURL(options) ?? this.user.displayAvatarURL(options);
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
   * @type {?string}
   * @readonly
   */
  get displayName() {
    return this.nickname ?? this.user.displayName;
  }

  /**
   * The nickname of the member
   * @name UncachedGuildMember#nick
   * @type {?string}
   * @deprecated Use {@link UncachedGuildMember#nickname} instead
   */
  get nick() {
    return this.nickname;
  }

  /**
   * The role ids of the member
   * @name UncachedGuildMember#roles
   * @type {Snowflake[]}
   * @deprecated Use {@link UncachedGuildMember#roleIds} instead
   */
  get roles() {
    return this.roleIds;
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
   * @param {UncachedGuildMember} member The member to compare with
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
      this.parsedFlags.bitfield === member.parsedFlags.bitfield &&
      (this.roleIds === member.roleIds ||
        (this.roleIds.length === member.roleIds.length && this.roleIds.every((role, i) => role === member.roleIds[i])))
    );
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention
   * instead of the UncachedGuildMember object.
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
    json.displayAvatarURL = this.displayAvatarURL();
    return json;
  }
}

/**
 * Sends a message to this user.
 * @method send
 * @memberof UncachedGuildMember
 * @instance
 * @param {string|MessagePayload|MessageCreateOptions} options The options to provide
 * @returns {Promise<Message>}
 * @example
 * // Send a direct message
 * UncachedGuildMember.send('Hello!')
 *   .then(message => console.log(`Sent message: ${message.content} to ${guildMember.displayName}`))
 *   .catch(console.error);
 */

TextBasedChannel.applyToClass(UncachedGuildMember);

module.exports = UncachedGuildMember;
