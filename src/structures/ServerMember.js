'use strict';

const Base = require('./Base');
const Role = require('./Role');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const { Error } = require('../errors');
const ServerMemberRoleManager = require('../managers/ServerMemberRoleManager');
const Permissions = require('../util/Permissions');
let Structures;

/**
 * Represents a member of a server on Discord.
 * @implements {TextBasedChannel}
 * @extends {Base}
 */
class ServerMember extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the server member
   * @param {Server} server The server the member is part of
   */
  constructor(client, data, server) {
    super(client);

    /**
     * The server that this member is part of
     * @type {Server}
     */
    this.server = server;

    /**
     * The timestamp the member joined the server at
     * @type {?number}
     */
    this.joinedTimestamp = null;

    /**
     * The ID of the last message sent by the member in their server, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = null;

    /**
     * The ID of the channel for the last message sent by the member in their server, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageChannelID = null;

    /**
     * The timestamp of when the member used their Nitro boost on the server, if it was used
     * @type {?number}
     */
    this.premiumSinceTimestamp = null;

    /**
     * Whether the member has been removed from the server
     * @type {boolean}
     */
    this.deleted = false;

    /**
     * The nickname of this member, if they have one
     * @type {?string}
     */
    this.nickname = null;

    /**
     * Whether this member has yet to pass the server's membership gate
     * @type {boolean}
     */
    this.pending = false;

    this._roles = [];
    if (data) this._patch(data);
  }

  _patch(data) {
    if ('user' in data) {
      /**
       * The user that this server member instance represents
       * @type {User}
       */
      this.user = this.client.users.add(data.user, true);
    }

    if ('nick' in data) this.nickname = data.nick;
    if ('joined_at' in data) this.joinedTimestamp = new Date(data.joined_at).getTime();
    if ('premium_since' in data) this.premiumSinceTimestamp = new Date(data.premium_since).getTime();
    if ('roles' in data) this._roles = data.roles;
    this.pending = data.pending ?? false;
  }

  _clone() {
    const clone = super._clone();
    clone._roles = this._roles.slice();
    return clone;
  }

  /**
   * Whether this ServerMember is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !this.joinedTimestamp;
  }

  /**
   * A manager for the roles belonging to this member
   * @type {ServerMemberRoleManager}
   * @readonly
   */
  get roles() {
    return new ServerMemberRoleManager(this);
  }

  /**
   * The Message object of the last message sent by the member in their server, if one was sent
   * @type {?Message}
   * @readonly
   */
  get lastMessage() {
    const channel = this.server.channels.cache.get(this.lastMessageChannelID);
    return (channel && channel.messages.cache.get(this.lastMessageID)) || null;
  }

  /**
   * The voice state of this member
   * @type {VoiceState}
   * @readonly
   */
  get voice() {
    if (!Structures) Structures = require('../util/Structures');
    const VoiceState = Structures.get('VoiceState');
    return this.server.voiceStates.cache.get(this.id) || new VoiceState(this.server, { user_id: this.id });
  }

  /**
   * The time this member joined the server
   * @type {?Date}
   * @readonly
   */
  get joinedAt() {
    return this.joinedTimestamp ? new Date(this.joinedTimestamp) : null;
  }

  /**
   * The time of when the member used their Nitro boost on the server, if it was used
   * @type {?Date}
   * @readonly
   */
  get premiumSince() {
    return this.premiumSinceTimestamp ? new Date(this.premiumSinceTimestamp) : null;
  }

  /**
   * The presence of this server member
   * @type {Presence}
   * @readonly
   */
  get presence() {
    if (!Structures) Structures = require('../util/Structures');
    const Presence = Structures.get('Presence');
    return (
      this.server.presences.cache.get(this.id) ||
      new Presence(this.client, {
        user: {
          id: this.id,
        },
        server: this.server,
      })
    );
  }

  /**
   * The displayed color of this member in base 10
   * @type {number}
   * @readonly
   */
  get displayColor() {
    const role = this.roles.color;
    return (role && role.color) || 0;
  }

  /**
   * The displayed color of this member in hexadecimal
   * @type {string}
   * @readonly
   */
  get displayHexColor() {
    const role = this.roles.color;
    return (role && role.hexColor) || '#000000';
  }

  /**
   * The ID of this member
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
    return this.nickname || this.user.username;
  }

  /**
   * The overall set of permissions for this member, taking only roles into account
   * @type {Readonly<Permissions>}
   * @readonly
   */
  get permissions() {
    if (this.user.id === this.server.ownerID) return new Permissions(Permissions.ALL).freeze();
    return new Permissions(this.roles.cache.map(role => role.permissions)).freeze();
  }

  /**
   * Whether the client user is above this user in the hierarchy, according to role position and server ownership.
   * This is a prerequisite for many moderative actions.
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.user.id === this.server.ownerID) return false;
    if (this.user.id === this.client.user.id) return false;
    if (this.client.user.id === this.server.ownerID) return true;
    if (!this.server.me) throw new Error('GUILD_UNCACHED_ME');
    return this.server.me.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  /**
   * Whether this member is kickable by the client user
   * @type {boolean}
   * @readonly
   */
  get kickable() {
    return this.manageable && this.server.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
  }

  /**
   * Whether this member is bannable by the client user
   * @type {boolean}
   * @readonly
   */
  get bannable() {
    return this.manageable && this.server.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
  }

  /**
   * Returns `channel.permissionsFor(serverMember)`. Returns permissions for a member in a server channel,
   * taking into account roles and permission overwrites.
   * @param {ChannelResolvable} channel The server channel to use as context
   * @returns {Readonly<Permissions>}
   */
  permissionsIn(channel) {
    channel = this.server.channels.resolve(channel);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.memberPermissions(this);
  }

  /**
   * The data for editing a server member.
   * @typedef {Object} ServerMemberEditData
   * @property {?string} [nick] The nickname to set for the member
   * @property {Collection<Snowflake, Role>|RoleResolvable[]} [roles] The roles or role IDs to apply
   * @property {boolean} [mute] Whether or not the member should be muted
   * @property {boolean} [deaf] Whether or not the member should be deafened
   * @property {ChannelResolvable|null} [channel] Channel to move member to (if they are connected to voice), or `null`
   * if you want to kick them from voice
   */

  /**
   * Edits this member.
   * @param {ServerMemberEditData} data The data to edit the member with
   * @param {string} [reason] Reason for editing this user
   * @returns {Promise<ServerMember>}
   */
  async edit(data, reason) {
    if (data.channel) {
      data.channel = this.server.channels.resolve(data.channel);
      if (!data.channel || data.channel.type !== 'voice') {
        throw new Error('GUILD_VOICE_CHANNEL_RESOLVE');
      }
      data.channel_id = data.channel.id;
      data.channel = undefined;
    } else if (data.channel === null) {
      data.channel_id = null;
      data.channel = undefined;
    }
    if (data.roles) data.roles = data.roles.map(role => (role instanceof Role ? role.id : role));
    let endpoint = this.client.api.servers(this.server.id);
    if (this.user.id === this.client.user.id) {
      const keys = Object.keys(data);
      if (keys.length === 1 && keys[0] === 'nick') endpoint = endpoint.members('@me').nick;
      else endpoint = endpoint.members(this.id);
    } else {
      endpoint = endpoint.members(this.id);
    }
    await endpoint.patch({ data, reason });

    const clone = this._clone();
    data.user = this.user;
    clone._patch(data);
    return clone;
  }

  /**
   * Sets the nickname for this member.
   * @param {?string} nick The nickname for the server member, or `null` if you want to reset their nickname
   * @param {string} [reason] Reason for setting the nickname
   * @returns {Promise<ServerMember>}
   */
  setNickname(nick, reason) {
    return this.edit({ nick }, reason);
  }

  /**
   * Creates a DM channel between the client and this member.
   * @returns {Promise<DMChannel>}
   */
  createDM() {
    return this.user.createDM();
  }

  /**
   * Deletes any DMs with this member.
   * @returns {Promise<DMChannel>}
   */
  deleteDM() {
    return this.user.deleteDM();
  }

  /**
   * Kicks this member from the server.
   * @param {string} [reason] Reason for kicking user
   * @returns {Promise<ServerMember>}
   */
  kick(reason) {
    return this.client.api
      .servers(this.server.id)
      .members(this.user.id)
      .delete({ reason })
      .then(() => this);
  }

  /**
   * Bans this server member.
   * @param {Object} [options] Options for the ban
   * @param {number} [options.days=0] Number of days of messages to delete, must be between 0 and 7
   * @param {string} [options.reason] Reason for banning
   * @returns {Promise<ServerMember>}
   * @example
   * // ban a server member
   * serverMember.ban({ days: 7, reason: 'They deserved it' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  ban(options) {
    return this.server.members.ban(this, options);
  }

  /**
   * Fetches this ServerMember.
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<ServerMember>}
   */
  fetch(force = false) {
    return this.server.members.fetch({ user: this.id, cache: true, force });
  }

  /**
   * When concatenated with a string, this automatically returns the user's mention instead of the ServerMember object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${member}!`);
   */
  toString() {
    return `<@${this.nickname ? '!' : ''}${this.user.id}>`;
  }

  toJSON() {
    return super.toJSON({
      server: 'serverID',
      user: 'userID',
      displayName: true,
      speaking: false,
      lastMessage: false,
      lastMessageID: false,
      roles: true,
    });
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
}

TextBasedChannel.applyToClass(ServerMember);

module.exports = ServerMember;
