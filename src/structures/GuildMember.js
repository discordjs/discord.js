'use strict';

const process = require('node:process');
const Base = require('./Base');
const VoiceState = require('./VoiceState');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { Error } = require('../errors');
const GuildMemberRoleManager = require('../managers/GuildMemberRoleManager');
const GuildMemberFlags = require('../util/GuildMemberFlags');
const Permissions = require('../util/Permissions');

/**
 * @type {WeakSet<GuildMember>}
 * @private
 * @internal
 */
const deletedGuildMembers = new WeakSet();
let deprecationEmittedForDeleted = false;

/**
 * Represents a member of a guild on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class GuildMember extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;

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
     * The nickname of this member, if they have one
     * @type {?string}
     */
    this.nickname = null;

    /**
     * Whether this member has yet to pass the guild's membership gate
     * @type {boolean}
     */
    this.pending = false;

    /**
     * The timestamp this member's timeout will be removed
     * @type {?number}
     */
    this.communicationDisabledUntilTimestamp = null;

    this._roles = [];
    if (data) this._patch(data);
  }

  _patch(data) {
    if ('user' in data) {
      /**
       * The user that this guild member instance represents
       * @type {?User}
       */
      this.user = this.client.users._add(data.user, true);
    }

    if ('nick' in data) this.nickname = data.nick;
    if ('avatar' in data) {
      /**
       * The guild member's avatar hash
       * @type {?string}
       */
      this.avatar = data.avatar;
    } else if (typeof this.avatar !== 'string') {
      this.avatar = null;
    }
    if ('joined_at' in data) this.joinedTimestamp = new Date(data.joined_at).getTime();
    if ('premium_since' in data) {
      this.premiumSinceTimestamp = data.premium_since ? new Date(data.premium_since).getTime() : null;
    }
    if ('roles' in data) this._roles = data.roles;
    this.pending = data.pending ?? false;

    if ('communication_disabled_until' in data) {
      this.communicationDisabledUntilTimestamp =
        data.communication_disabled_until && Date.parse(data.communication_disabled_until);
    }
    if ('flags' in data) {
      /**
       * The flags of this member
       * @type {Readonly<GuildMemberFlags>}
       */
      this.flags = new GuildMemberFlags(data.flags).freeze();
    } else {
      this.flags ??= new GuildMemberFlags().freeze();
    }
  }

  _clone() {
    const clone = super._clone();
    clone._roles = this._roles.slice();
    return clone;
  }

  /**
   * Whether or not the structure has been deleted
   * @type {boolean}
   * @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091
   */
  get deleted() {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'GuildMember#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    return deletedGuildMembers.has(this);
  }

  set deleted(value) {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'GuildMember#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    if (value) deletedGuildMembers.add(this);
    else deletedGuildMembers.delete(this);
  }

  /**
   * Whether this GuildMember is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.joinedTimestamp === null;
  }

  /**
   * A manager for the roles belonging to this member
   * @type {GuildMemberRoleManager}
   * @readonly
   */
  get roles() {
    return new GuildMemberRoleManager(this);
  }

  /**
   * The voice state of this member
   * @type {VoiceState}
   * @readonly
   */
  get voice() {
    return this.guild.voiceStates.cache.get(this.id) ?? new VoiceState(this.guild, { user_id: this.id });
  }

  /**
   * A link to the member's guild avatar.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  avatarURL({ format, size, dynamic } = {}) {
    if (!this.avatar) return null;
    return this.client.rest.cdn.GuildMemberAvatar(this.guild.id, this.id, this.avatar, format, size, dynamic);
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
    return this.joinedTimestamp ? new Date(this.joinedTimestamp) : null;
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
    return this.premiumSinceTimestamp ? new Date(this.premiumSinceTimestamp) : null;
  }

  /**
   * The presence of this guild member
   * @type {?Presence}
   * @readonly
   */
  get presence() {
    return this.guild.presences.resolve(this.id);
  }

  /**
   * The displayed color of this member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    return this.roles.color?.color ?? 0;
  }

  /**
   * The displayed color of this member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    return this.roles.color?.hexColor ?? '#000000';
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
   * The nickname of this member, or their username if they don't have one
   * @type {?string}
   * @readonly
   */
  get displayName() {
    return this.nickname ?? this.user.username;
  }

  /**
   * The overall set of permissions for this member, taking only roles and owner status into account
   * @type {Readonly<Permissions>}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.guild.ownerId) return new Permissions(Permissions.ALL).freeze();
    return new Permissions(this.roles.cache.map(role => role.permissions)).freeze();
  }

  /**
   * Whether the client user is above this user in the hierarchy, according to role position and guild ownership.
   * This is a prerequisite for many moderative actions.
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.user.id === this.guild.ownerId) return false;
    if (this.user.id === this.client.user.id) return false;
    if (this.client.user.id === this.guild.ownerId) return true;
    if (!this.guild.members.me) throw new Error('GUILD_UNCACHED_ME');
    return this.guild.members.me.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  /**
   * Whether this member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    return this.manageable && this.guild.members.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
  }

  /**
   * Whether this member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    return this.manageable && this.guild.members.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
  }

  /**
   * Whether this member is moderatable by the client user
   * @type {boolean}
   * @readonly
   */
  get moderatable() {
    return (
      !this.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
      this.manageable &&
      (this.guild.members.me?.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS) ?? false)
    );
  }

  /**
   * Whether this member is currently timed out
   * @returns {boolean}
   */
  isCommunicationDisabled() {
    return this.communicationDisabledUntilTimestamp > Date.now();
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {GuildChannelResolvable} channel The guild channel to use as context
   * @returns {Readonly<Permissions>}
   */
  permissionsIn(channel) {
    channel = this.guild.channels.resolve(channel);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.permissionsFor(this);
  }

  /**
   * Edits this member.
   * @param {GuildMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<GuildMember>}
   */
  edit(data, reason) {
    return this.guild.members.edit(this, data, reason);
  }

  /**
   * Sets the nickname for this member.
   * @param {?string} nick The nickname for the guild member, or `null` if you want to reset their nickname
   * @param {string} [reason] Reason for setting the nickname
   * @returns {Promise<GuildMember>}
   * @example
   * // Set a nickname for a guild member
   * guildMember.setNickname('cool nickname', 'Needed a new nickname')
   *   .then(member => console.log(`Set nickname of ${member.user.username}`))
   *   .catch(console.error);
   * @example
   * // Remove a nickname for a guild member
   * guildMember.setNickname(null, 'No nicknames allowed!')
   *   .then(member => console.log(`Removed nickname for ${member.user.username}`))
   *   .catch(console.error);
   */
  setNickname(nick, reason) {
    return this.edit({ nick }, reason);
  }

  /**
   * Sets the flags for this member.
   * @param {GuildMemberFlagsResolvable} flags The flags to set
   * @param {string} [reason] Reason for setting the flags
   * @returns {Promise<GuildMember>}
   */
  setFlags(flags, reason) {
    return this.edit({ flags, reason });
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
   * Deletes any DMs with this member.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.user.deleteDM();
  }

  /**
   * Kicks this member from the guild.
   * @param {string} [reason] Reason for kicking user
   * @returns {Promise<GuildMember>}
   */
  kick(reason) {
    return this.guild.members.kick(this, reason);
  }

  /**
   * Bans this guild member.
   * @param {BanOptions} [options] Options for the ban
   * @returns {Promise<GuildMember>}
   * @example
   * // Ban a guild member, deleting a week's worth of messages
   * guildMember.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: 'They deserved it' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  ban(options) {
    return this.guild.bans.create(this, options);
  }

  /**
   * Times this guild member out.
   * @param {DateResolvable|null} communicationDisabledUntil The date or timestamp
   * for the member's communication to be disabled until. Provide `null` to remove the timeout.
   * @param {string} [reason] The reason for this timeout.
   * @returns {Promise<GuildMember>}
   * @example
   * // Time a guild member out for 5 minutes
   * guildMember.disableCommunicationUntil(Date.now() + (5 * 60 * 1000), 'They deserved it')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Remove the timeout of a guild member
   * guildMember.disableCommunicationUntil(null)
   *   .then(member => console.log(`Removed timeout for ${member.displayName}`))
   *   .catch(console.error);
   */
  disableCommunicationUntil(communicationDisabledUntil, reason) {
    return this.edit({ communicationDisabledUntil }, reason);
  }

  /**
   * Times this guild member out.
   * @param {number|null} timeout The time in milliseconds
   * for the member's communication to be disabled until. Provide `null` to remove the timeout.
   * @param {string} [reason] The reason for this timeout.
   * @returns {Promise<GuildMember>}
   * @example
   * // Time a guild member out for 5 minutes
   * guildMember.timeout(5 * 60 * 1000, 'They deserved it')
   *   .then(console.log)
   *   .catch(console.error);
   */
  timeout(timeout, reason) {
    return this.disableCommunicationUntil(timeout && Date.now() + timeout, reason);
  }

  /**
   * Fetches this GuildMember.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<GuildMember>}
   */
  fetch(force = true) {
    return this.guild.members.fetch({ user: this.id, cache: true, force });
  }

  /**
   * Whether this guild member equals another guild member. It compares all properties, so for most
   * comparison it is advisable to just compare `member.id === member2.id` as it is significantly faster
   * and is often what most users need.
   * @param {GuildMember} member The member to compare with
   * @returns {boolean}
   */
  equals(member) {
    return (
      member instanceof this.constructor &&
      this.id === member.id &&
      this.partial === member.partial &&
      this.guild.id === member.guild.id &&
      this.joinedTimestamp === member.joinedTimestamp &&
      this.nickname === member.nickname &&
      this.avatar === member.avatar &&
      this.pending === member.pending &&
      this.communicationDisabledUntilTimestamp === member.communicationDisabledUntilTimestamp &&
      this.flags.equals(member.flags) &&
      (this._roles === member._roles ||
        (this._roles.length === member._roles.length && this._roles.every((role, i) => role === member._roles[i])))
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
    return `<@${this.nickname ? '!' : ''}${this.user.id}>`;
  }

  toJSON() {
    const json = super.toJSON({
      guild: 'guildId',
      user: 'userId',
      displayName: true,
      roles: true,
    });
    json.avatarURL = this.avatarURL();
    json.displayAvatarURL = this.displayAvatarURL();
    return json;
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(GuildMember);

exports.GuildMember = GuildMember;
exports.deletedGuildMembers = deletedGuildMembers;

/**
 * @external APIGuildMember
 * @see {@link https://discord.com/developers/docs/resources/guild#guild-member-object}
 */
