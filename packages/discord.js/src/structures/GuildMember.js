'use strict';

const { PermissionFlagsBits } = require('discord-api-types/v10');
const MinimalGuildMember = require('./MinimalGuildMember');
const VoiceState = require('./VoiceState');
const { DiscordjsError, ErrorCodes } = require('../errors');
const GuildMemberRoleManager = require('../managers/GuildMemberRoleManager');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * Represents a member of a guild on Discord.
 * @extends {MinimalGuildMember}
 */
class GuildMember extends MinimalGuildMember {
  constructor(client, data, guild) {
    super(client, data, guild.id);

    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;
  }

  isInCachedGuild() {
    return true;
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
   * A link to the member's guild banner if they have one.
   * Otherwise, a link to their {@link User#bannerURL} will be returned.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  displayBannerURL(options) {
    return this.bannerURL(options) ?? this.user.bannerURL(options);
  }

  /**
   * The presence of this guild member
   * @type {?Presence}
   * @readonly
   */
  get presence() {
    return this.guild.presences.cache.get(this.id) ?? null;
  }

  /**
   * The displayed role color of this member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    return this.roles.color?.color ?? 0;
  }

  /**
   * The displayed role color of this member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    return this.roles.color?.hexColor ?? '#000000';
  }

  /**
   * The overall set of permissions for this member, taking only roles and owner status into account
   * @type {Readonly<PermissionsBitField>}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.guild.ownerId) return new PermissionsBitField(PermissionsBitField.All).freeze();
    return new PermissionsBitField(this.roles.cache.map(role => role.permissions)).freeze();
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
    if (!this.guild.members.me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    return this.guild.members.me.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  /**
   * Whether this member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    if (!this.guild.members.me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    return this.manageable && this.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers);
  }

  /**
   * Whether this member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    if (!this.guild.members.me) throw new DiscordjsError(ErrorCodes.GuildUncachedMe);
    return this.manageable && this.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers);
  }

  /**
   * Whether this member is moderatable by the client user
   * @type {boolean}
   * @readonly
   */
  get moderatable() {
    return (
      !this.permissions.has(PermissionFlagsBits.Administrator) &&
      this.manageable &&
      (this.guild.members.me?.permissions.has(PermissionFlagsBits.ModerateMembers) ?? false)
    );
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {GuildChannelResolvable} channel The guild channel to use as context
   * @returns {Readonly<PermissionsBitField>}
   */
  permissionsIn(channel) {
    channel = this.guild.channels.resolve(channel);
    if (!channel) throw new DiscordjsError(ErrorCodes.GuildChannelResolve);
    return channel.permissionsFor(this);
  }

  /**
   * Edits this member.
   * @param {GuildMemberEditOptions} options The options to provide
   * @returns {Promise<GuildMember>}
   */
  edit(options) {
    return this.guild.members.edit(this, options);
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
    return this.edit({ nick, reason });
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
   * @param {?DateResolvable} communicationDisabledUntil The date or timestamp
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
    return this.edit({ communicationDisabledUntil, reason });
  }

  /**
   * Times this guild member out.
   * @param {?number} timeout The duration in milliseconds
   * for the member's communication to be disabled. Provide `null` to remove the timeout.
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
      this.banner === member.banner &&
      this.pending === member.pending &&
      this.communicationDisabledUntilTimestamp === member.communicationDisabledUntilTimestamp &&
      this.flags.bitfield === member.flags.bitfield &&
      (this.roleIds === member.roleIds ||
        (this.roleIds.length === member.roleIds.length && this.roleIds.every((role, i) => role === member.roleIds[i])))
    );
  }
}

exports.GuildMember = GuildMember;
