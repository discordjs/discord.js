const TextBasedChannel = require('./interfaces/TextBasedChannel');
const Role = require('./Role');
const Permissions = require('../util/Permissions');
const Collection = require('../util/Collection');
const Base = require('./Base');
const { Presence } = require('./Presence');
const { Error, TypeError } = require('../errors');

/**
 * Represents a member of a guild on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class GuildMember extends Base {
  constructor(guild, data) {
    super(guild.client);

    /**
     * The guild that this member is part of
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The user that this guild member instance Represents
     * @type {User}
     */
    this.user = {};

    this._roles = [];

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
    if (typeof data.joined_at !== 'undefined') this.joinedTimestamp = new Date(data.joined_at).getTime();

    this.user = this.guild.client.users.create(data.user);
    if (data.roles) this._roles = data.roles;
  }

  get voiceState() {
    return this._frozenVoiceState || this.guild.voiceStates.get(this.id) || {};
  }

  /**
   * Whether this member is deafened server-wide
   * @type {boolean}
   */
  get serverDeaf() { return this.voiceState.deaf; }

  /**
   * Whether this member is muted server-wide
   * @type {boolean}
   */
  get serverMute() { return this.voiceState.mute; }

  /**
   * Whether this member is self-muted
   * @type {boolean}
   */
  get selfMute() { return this.voiceState.self_mute; }

  /**
   * Whether this member is self-deafened
   * @type {boolean}
   */
  get selfDeaf() { return this.voiceState.self_deaf; }

  /**
   * The voice session ID of this member (if any)
   * @type {?Snowflake}
   */
  get voiceSessionID() { return this.voiceState.session_id; }

  /**
   * The voice channel ID of this member, (if any)
   * @type {?Snowflake}
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
    return this.frozenPresence || this.guild.presences.get(this.id) || new Presence();
  }

  /**
   * A list of roles that are applied to this GuildMember, mapped by the role ID
   * @type {Collection<Snowflake, Role>}
   * @readonly
   */
  get roles() {
    const list = new Collection();
    const everyoneRole = this.guild.roles.get(this.guild.id);

    if (everyoneRole) list.set(everyoneRole.id, everyoneRole);

    for (const roleID of this._roles) {
      const role = this.guild.roles.get(roleID);
      if (role) list.set(role.id, role);
    }

    return list;
  }

  /**
   * The role of the member with the highest position
   * @type {Role}
   * @readonly
   */
  get highestRole() {
    return this.roles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The role of the member used to set their color
   * @type {?Role}
   * @readonly
   */
  get colorRole() {
    const coloredRoles = this.roles.filter(role => role.color);
    if (!coloredRoles.size) return null;
    return coloredRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
  }

  /**
   * The displayed color of the member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    const role = this.colorRole;
    return (role && role.color) || 0;
  }

  /**
   * The displayed color of the member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    const role = this.colorRole;
    return (role && role.hexColor) || '#000000';
  }

  /**
   * The role of the member used to hoist them in a separate category in the users list
   * @type {?Role}
   * @readonly
   */
  get hoistRole() {
    const hoistedRoles = this.roles.filter(role => role.hoist);
    if (!hoistedRoles.size) return null;
    return hoistedRoles.reduce((prev, role) => !prev || role.comparePositionTo(prev) > 0 ? role : prev);
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
    if (this.user.id === this.guild.ownerID) return new Permissions(Permissions.ALL);

    let permissions = 0;
    const roles = this.roles;
    for (const role of roles.values()) permissions |= role.permissions;

    return new Permissions(permissions);
  }

  /**
   * Whether the member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return false;
    return clientMember.highestRole.comparePositionTo(this.highestRole) > 0;
  }

  /**
   * Whether the member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    if (this.user.id === this.guild.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    const clientMember = this.guild.member(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return false;
    return clientMember.highestRole.comparePositionTo(this.highestRole) > 0;
  }

  /**
   * Returns `channel.permissionsFor(guildMember)`. Returns permissions for a member in a guild channel,
   * taking into account roles and permission overwrites.
   * @param {ChannelResolvable} channel The guild channel to use as context
   * @returns {?Permissions}
   */
  permissionsIn(channel) {
    channel = this.client.resolver.resolveChannel(channel);
    if (!channel || !channel.guild) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.permissionsFor(this);
  }

  /**
   * Checks if any of the member's roles have a permission.
   * @param {PermissionResolvable|PermissionResolvable[]} permission Permission(s) to check for
   * @param {boolean} [explicit=false] Whether to require the role to explicitly have the exact permission
   * **(deprecated)**
   * @param {boolean} [checkAdmin] Whether to allow the administrator permission to override
   * (takes priority over `explicit`)
   * @param {boolean} [checkOwner] Whether to allow being the guild's owner to override
   * (takes priority over `explicit`)
   * @returns {boolean}
   */
  hasPermission(permission, explicit = false, checkAdmin, checkOwner) {
    if (typeof checkAdmin === 'undefined') checkAdmin = !explicit;
    if (typeof checkOwner === 'undefined') checkOwner = !explicit;
    if (checkOwner && this.user.id === this.guild.ownerID) return true;
    return this.roles.some(r => r.hasPermission(permission, undefined, checkAdmin));
  }

  /**
   * Checks whether the roles of the member allows them to perform specific actions, and lists any missing permissions.
   * @param {PermissionResolvable[]} permissions The permissions to check for
   * @param {boolean} [explicit=false] Whether to require the member to explicitly have the exact permissions
   * @returns {PermissionResolvable[]}
   */
  missingPermissions(permissions, explicit = false) {
    return permissions.missing(permissions, explicit);
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
   * Edit a guild member.
   * @param {GuildMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<GuildMember>}
   */
  edit(data, reason) {
    if (data.channel) {
      data.channel_id = this.client.resolver.resolveChannel(data.channel).id;
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
      clone._frozenVoiceState = this.voiceState;
      if (typeof data.mute !== 'undefined') clone._frozenVoiceState.mute = data.mute;
      if (typeof data.deaf !== 'undefined') clone._frozenVoiceState.mute = data.deaf;
      if (typeof data.channel_id !== 'undefined') clone._frozenVoiceState.channel_id = data.channel_id;
      return clone;
    });
  }

  /**
   * Mute/unmute a user.
   * @param {boolean} mute Whether or not the member should be muted
   * @param {string} [reason] Reason for muting or unmuting
   * @returns {Promise<GuildMember>}
   */
  setMute(mute, reason) {
    return this.edit({ mute }, reason);
  }

  /**
   * Deafen/undeafen a user.
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
   * Sets the roles applied to the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to apply
   * @param {string} [reason] Reason for applying the roles
   * @returns {Promise<GuildMember>}
   */
  setRoles(roles, reason) {
    return this.edit({ roles }, reason);
  }

  /**
   * Adds a single role to the member.
   * @param {RoleResolvable} role The role or ID of the role to add
   * @param {string} [reason] Reason for adding the role
   * @returns {Promise<GuildMember>}
   */
  addRole(role, reason) {
    role = this.client.resolver.resolveRole(this.guild, role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    if (this._roles.includes(role.id)) return Promise.resolve(this);
    return this.client.api.guilds(this.guild.id).members(this.user.id).roles(role.id)
      .put({ reason })
      .then(() => {
        const clone = this._clone();
        if (!clone._roles.includes(role.id)) clone._roles.push(role.id);
        return clone;
      });
  }

  /**
   * Adds multiple roles to the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to add
   * @param {string} [reason] Reason for adding the roles
   * @returns {Promise<GuildMember>}
   */
  addRoles(roles, reason) {
    let allRoles = this._roles.slice();
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.client.resolver.resolveRole(this.guild, role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      allRoles.push(role.id);
    }
    return this.edit({ roles: allRoles }, reason);
  }

  /**
   * Removes a single role from the member.
   * @param {RoleResolvable} role The role or ID of the role to remove
   * @param {string} [reason] Reason for removing the role
   * @returns {Promise<GuildMember>}
   */
  removeRole(role, reason) {
    role = this.client.resolver.resolveRole(this.guild, role);
    if (!role) return Promise.reject(new TypeError('INVALID_TYPE', 'role', 'Role nor a Snowflake'));
    if (!this._roles.includes(role.id)) return Promise.resolve(this);
    return this.client.api.guilds(this.guild.id).members(this.user.id).roles(role.id)
      .delete({ reason })
      .then(() => {
        const clone = this._clone();
        const index = clone._roles.indexOf(role.id);
        if (~index) clone._roles.splice(index, 1);
        return clone;
      });
  }

  /**
   * Removes multiple roles from the member.
   * @param {Collection<Snowflake, Role>|RoleResolvable[]} roles The roles or role IDs to remove
   * @param {string} [reason] Reason for removing the roles
   * @returns {Promise<GuildMember>}
   */
  removeRoles(roles, reason) {
    const allRoles = this._roles.slice();
    for (let role of roles instanceof Collection ? roles.values() : roles) {
      role = this.client.resolver.resolveRole(this.guild, role);
      if (!role) {
        return Promise.reject(new TypeError('INVALID_TYPE', 'roles',
          'Array or Collection of Roles or Snowflakes', true));
      }
      const index = allRoles.indexOf(role.id);
      if (index >= 0) allRoles.splice(index, 1);
    }
    return this.edit({ roles: allRoles }, reason);
  }

  /**
   * Set the nickname for the guild member.
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
   * Kick this member from the guild.
   * @param {string} [reason] Reason for kicking user
   * @returns {Promise<GuildMember>}
   */
  kick(reason) {
    return this.client.api.guilds(this.guild.id).members(this.user.id).delete({ reason })
      .then(() =>
        this.client.actions.GuildMemberRemove.handle({
          guild_id: this.guild.id,
          user: this.user,
        }).member
      );
  }

  /**
   * Ban this guild member.
   * @param {Object|number|string} [options] Ban options. If a number, the number of days to delete messages for, if a
   * string, the ban reason. Supplying an object allows you to do both.
   * @param {number} [options.days=0] Number of days of messages to delete
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<GuildMember>}
   * @example
   * // ban a guild member
   * guildMember.ban(7);
   */
  ban(options) {
    return this.guild.ban(this, options);
  }

  /**
   * When concatenated with a string, this automatically concatenates the user's mention instead of the Member object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789>!
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
