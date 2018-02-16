const TextBasedChannel = require('./interfaces/TextBasedChannel');
const Role = require('./Role');
const Permissions = require('../util/Permissions');
const GuildMemberRoleStore = require('../stores/GuildMemberRoleStore');
const Base = require('./Base');
const { Presence } = require('./Presence');
const { Error } = require('../errors');

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
     * The user that this guild member instance represents
     * @type {User}
     */
    this.user = {};

    /**
     * A list of roles that are applied to this GuildMember, mapped by the role ID
     * @type {GuildMemberRoleStore<Snowflake, Role>}
     */

    this.roles = new GuildMemberRoleStore(this);

    if (data) this._patch(data);

    /**
     * The ID of the last message sent by the member in their guild, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The Message object of the last message sent by the member in their guild, if one was sent
     * @type {?Message}
     */
    this.lastMessage = null;
  }

  _patch(data) {
    /**
     * Whether this member is speaking
     * @type {boolean}
     * @name GuildMember#speaking
     */
    if (typeof this.speaking === 'undefined') this.speaking = false;

    /**
     * The nickname of this guild member, if they have one
     * @type {?string}
     * @name GuildMember#nickname
     */
    if (typeof data.nick !== 'undefined') this.nickname = data.nick;

    /**
     * The timestamp the member joined the guild at
     * @type {number}
     * @name GuildMember#joinedTimestamp
     */
    if (data.joined_at) this.joinedTimestamp = new Date(data.joined_at).getTime();

    this.user = this.guild.client.users.add(data.user);
    if (data.roles) this.roles._patch(data.roles);
  }

  _clone() {
    const clone = super._clone();
    clone.roles = this.roles.clone();
    return clone;
  }

  get voiceState() {
    return this._frozenVoiceState || this.guild.voiceStates.get(this.id) || {};
  }

  /**
   * Whether this member is deafened server-wide
   * @type {boolean}
   * @readonly
   */
  get serverDeaf() { return this.voiceState.deaf; }

  /**
   * Whether this member is muted server-wide
   * @type {boolean}
   * @readonly
   */
  get serverMute() { return this.voiceState.mute; }

  /**
   * Whether this member is self-muted
   * @type {boolean}
   * @readonly
   */
  get selfMute() { return this.voiceState.self_mute; }

  /**
   * Whether this member is self-deafened
   * @type {boolean}
   * @readonly
   */
  get selfDeaf() { return this.voiceState.self_deaf; }

  /**
   * The voice session ID of this member (if any)
   * @type {?Snowflake}
   * @readonly
   */
  get voiceSessionID() { return this.voiceState.session_id; }

  /**
   * The voice channel ID of this member, (if any)
   * @type {?Snowflake}
   * @readonly
   */
  get voiceChannelID() { return this.voiceState.channel_id; }

  /**
   * The time the member joined the guild
   * @type {Date}
   * @readonly
   */
  get joinedAt() {
    return new Date(this.joinedTimestamp);
  }

  /**
   * The presence of this guild member
   * @type {Presence}
   * @readonly
   */
  get presence() {
    return this.frozenPresence || this.guild.presences.get(this.id) || new Presence(this.client);
  }

  /**
   * The displayed color of the member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    const role = this.roles.color;
    return (role && role.color) || 0;
  }

  /**
   * The displayed color of the member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    const role = this.roles.color;
    return (role && role.hexColor) || '#000000';
  }

  /**
   * Whether this member is muted in any way
   * @type {boolean}
   * @readonly
   */
  get mute() {
    return this.selfMute || this.serverMute;
  }

  /**
   * Whether this member is deafened in any way
   * @type {boolean}
   * @readonly
   */
  get deaf() {
    return this.selfDeaf || this.serverDeaf;
  }

  /**
   * The voice channel this member is in, if any
   * @type {?VoiceChannel}
   * @readonly
   */
  get voiceChannel() {
    return this.guild.channels.get(this.voiceChannelID);
  }

  /**
   * The ID of this user
   * @type {Snowflake}
   * @readonly
   */
  get id() {
    return this.user.id;
  }

  /**
   * The nickname of the member, or their username if they don't have one
   * @type {string}
   * @readonly
   */
  get displayName() {
    return this.nickname || this.user.username;
  }

  /**
   * The overall set of permissions for the guild member, taking only roles into account
   * @type {Permissions}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.guild.ownerID) return new Permissions(Permissions.ALL).freeze();
    return new Permissions(this.roles.map(role => role.permissions)).freeze();
  }

  /**
   * Whether the member is manageable in terms of role hierarchy by the client user
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    return this.guild.me.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  /**
   * Whether the member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    return this.manageable && this.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
  }

  /**
   * Whether the member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    return this.manageable && this.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {ChannelResolvable} channel The guild channel to use as context
   * @returns {?Permissions}
   */
  permissionsIn(channel) {
    channel = this.guild.channels.resolve(channel);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.memberPermissions(this);
  }

  /**
   * Checks if any of the member's roles have a permission.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {Object} [options] Options
   * @param {boolean} [options.checkAdmin=true] Whether to allow the administrator permission to override
   * @param {boolean} [options.checkOwner=true] Whether to allow being the guild's owner to override
   * @returns {boolean}
   */
  hasPermission(permission, { checkAdmin = true, checkOwner = true } = {}) {
    if (checkOwner && this.user.id === this.guild.ownerID) return true;
    return this.roles.some(r => r.permissions.has(permission, checkAdmin));
  }

  /**
   * Checks whether the roles of the member allows them to perform specific actions, and lists any missing permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the member to explicitly have the exact permissions
   * @returns {PermissionResolvable[]}
   */
  missingPermissions(permissions, explicit = false) {
    return this.permissions.missing(permissions, explicit);
  }

  /**
   * The data for editing a guild member.
   * @typedef {Object} GuildMemberEditData
   * @property {string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles or role IDs to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {ChannelResolvable} [channel] Channel to move member to (if they are connected to voice)
   */

  /**
   * Edits a guild member.
   * @param {GuildMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<GuildMember>}
   */
  edit(data, reason) {
    if (data.channel) {
      data.channel_id = this.client.channels.resolve(data.channel).id;
      data.channel = null;
    }
    if (data.roles) data.roles = data.roles.map(role => role instanceof Role ? role.id : role);
    let endpoint = this.client.api.guilds(this.guild.id);
    if (this.user.id === this.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') endpoint = endpoint.members('@me').nick;
      else endpoint = endpoint.members(this.id);
    } else {
      endpoint = endpoint.members(this.id);
    }
    return endpoint.patch({ data, reason }).then(() => {
      const clone = this._clone();
      data.user = this.user;
      clone._patch(data);
      clone._frozenVoiceState = {};
      Object.assign(clone._frozenVoiceState, this.voiceState);
      if (typeof data.mute !== 'undefined') clone._frozenVoiceState.mute = data.mute;
      if (typeof data.deaf !== 'undefined') clone._frozenVoiceState.mute = data.deaf;
      if (typeof data.channel_id !== 'undefined') clone._frozenVoiceState.channel_id = data.channel_id;
      return clone;
    });
  }

  /**
   * Mutes/unmutes a user.
   * @param {boolean} mute Whether or not the member should be muted
   * @param {string} [reason] Reason for muting or unmuting
   * @returns {Promise<GuildMember>}
   */
  setMute(mute, reason) {
    return this.edit({ mute }, reason);
  }

  /**
   * Deafens/undeafens a user.
   * @param {boolean} deaf Whether or not the member should be deafened
   * @param {string} [reason] Reason for deafening or undeafening
   * @returns {Promise<GuildMember>}
   */
  setDeaf(deaf, reason) {
    return this.edit({ deaf }, reason);
  }

  /**
   * Moves the guild member to the given channel.
   * @param {ChannelResolvable} channel The channel to move the member to
   * @returns {Promise<GuildMember>}
   */
  setVoiceChannel(channel) {
    return this.edit({ channel });
  }

  /**
   * Sets the nickname for the guild member.
   * @param {string} nick The nickname for the guild member
   * @param {string} [reason] Reason for setting the nickname
   * @returns {Promise<GuildMember>}
   */
  setNickname(nick, reason) {
    return this.edit({ nick }, reason);
  }

  /**
   * Creates a DM channel between the client and the member.
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.user.createDM();
  }

  /**
   * Deletes any DMs with this guild member.
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
    return this.client.api.guilds(this.guild.id).members(this.user.id).delete({ reason })
      .then(() => this);
  }

  /**
   * Bans this guild member.
   * @param {Object} [options] Options for the ban
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember>}
   * @example
   * // ban a guild member
   * guildMember.ban({ days: 7, reason: 'They deserved it' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  ban(options) {
    return this.guild.members.ban(this, options);
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

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(GuildMember);

module.exports = GuildMember;
