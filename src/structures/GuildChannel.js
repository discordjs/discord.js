'use strict';

const Channel = require('./Channel');
const Invite = require('./Invite');
const PermissionOverwrites = require('./PermissionOverwrites');
const Role = require('./Role');
const { Error, TypeError } = require('../errors');
const Collection = require('../util/Collection');
const Permissions = require('../util/Permissions');
const Util = require('../util/Util');

/**
 * Represents a guild channel from any of the following:
 * - {@link TextChannel}
 * - {@link VoiceChannel}
 * - {@link CategoryChannel}
 * - {@link NewsChannel}
 * - {@link StoreChannel}
 * @extends {Channel}
 */
class GuildChannel extends Channel {
  /**
   * @param {Guild} guild The guild the guild channel is part of
   * @param {Object} data The data for the guild channel
   */
  constructor(guild, data) {
    super(guild.client, data);

    /**
     * The guild the channel is in
     * @type {Guild}
     */
    this.guild = guild;
  }

  _patch(data) {
    super._patch(data);

    /**
     * The name of the guild channel
     * @type {string}
     */
    this.name = data.name;

    /**
     * The raw position of the channel from discord
     * @type {number}
     */
    this.rawPosition = data.position;

    /**
     * The ID of the category parent of this channel
     * @type {?Snowflake}
     */
    this.parentID = data.parent_id;

    /**
     * A map of permission overwrites in this channel for roles and users
     * @type {Collection<Snowflake, PermissionOverwrites>}
     */
    this.permissionOverwrites = new Collection();
    if (data.permission_overwrites) {
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites.set(overwrite.id, new PermissionOverwrites(this, overwrite));
      }
    }
  }

  /**
   * The category parent of this channel
   * @type {?CategoryChannel}
   * @readonly
   */
  get parent() {
    return this.guild.channels.cache.get(this.parentID) || null;
  }

  /**
   * If the permissionOverwrites match the parent channel, null if no parent
   * @type {?boolean}
   * @readonly
   */
  get permissionsLocked() {
    if (!this.parent) return null;
    if (this.permissionOverwrites.size !== this.parent.permissionOverwrites.size) return false;
    return this.permissionOverwrites.every((value, key) => {
      const testVal = this.parent.permissionOverwrites.get(key);
      return (
        testVal !== undefined &&
        testVal.deny.bitfield === value.deny.bitfield &&
        testVal.allow.bitfield === value.allow.bitfield
      );
    });
  }

  /**
   * The position of the channel
   * @type {number}
   * @readonly
   */
  get position() {
    const sorted = this.guild._sortedChannels(this);
    return sorted.array().indexOf(sorted.get(this.id));
  }

  /**
   * Gets the overall set of permissions for a member or role in this channel, taking into account channel overwrites.
   * @param {GuildMemberResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @returns {?Readonly<Permissions>}
   */
  permissionsFor(memberOrRole) {
    const member = this.guild.members.resolve(memberOrRole);
    if (member) return this.memberPermissions(member);
    const role = this.guild.roles.resolve(memberOrRole);
    if (role) return this.rolePermissions(role);
    return null;
  }

  overwritesFor(member, verified = false, roles = null) {
    if (!verified) member = this.guild.members.resolve(member);
    if (!member) return [];

    roles = roles || member.roles.cache;
    const roleOverwrites = [];
    let memberOverwrites;
    let everyoneOverwrites;

    for (const overwrite of this.permissionOverwrites.values()) {
      if (overwrite.id === this.guild.id) {
        everyoneOverwrites = overwrite;
      } else if (roles.has(overwrite.id)) {
        roleOverwrites.push(overwrite);
      } else if (overwrite.id === member.id) {
        memberOverwrites = overwrite;
      }
    }

    return {
      everyone: everyoneOverwrites,
      roles: roleOverwrites,
      member: memberOverwrites,
    };
  }

  /**
   * Gets the overall set of permissions for a member in this channel, taking into account channel overwrites.
   * @param {GuildMember} member The member to obtain the overall permissions for
   * @returns {Readonly<Permissions>}
   * @private
   */
  memberPermissions(member) {
    if (member.id === this.guild.ownerID) return new Permissions(Permissions.ALL).freeze();

    const roles = member.roles.cache;
    const permissions = new Permissions(roles.map(role => role.permissions));

    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return new Permissions(Permissions.ALL).freeze();

    const overwrites = this.overwritesFor(member, true, roles);

    return permissions
      .remove(overwrites.everyone ? overwrites.everyone.deny : 0)
      .add(overwrites.everyone ? overwrites.everyone.allow : 0)
      .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.deny) : 0)
      .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allow) : 0)
      .remove(overwrites.member ? overwrites.member.deny : 0)
      .add(overwrites.member ? overwrites.member.allow : 0)
      .freeze();
  }

  /**
   * Gets the overall set of permissions for a role in this channel, taking into account channel overwrites.
   * @param {Role} role The role to obtain the overall permissions for
   * @returns {Readonly<Permissions>}
   * @private
   */
  rolePermissions(role) {
    if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return new Permissions(Permissions.ALL).freeze();

    const everyoneOverwrites = this.permissionOverwrites.get(this.guild.id);
    const roleOverwrites = this.permissionOverwrites.get(role.id);

    return role.permissions
      .remove(everyoneOverwrites ? everyoneOverwrites.deny : 0)
      .add(everyoneOverwrites ? everyoneOverwrites.allow : 0)
      .remove(roleOverwrites ? roleOverwrites.deny : 0)
      .add(roleOverwrites ? roleOverwrites.allow : 0)
      .freeze();
  }

  /**
   * Replaces the permission overwrites in this channel.
   * @param {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} overwrites
   * Permission overwrites the channel gets updated with
   * @param {string} [reason] Reason for updating the channel overwrites
   * @returns {Promise<GuildChannel>}
   * @example
   * channel.overwritePermissions([
   *   {
   *      id: message.author.id,
   *      deny: ['VIEW_CHANNEL'],
   *   },
   * ], 'Needed to change permissions');
   */
  overwritePermissions(overwrites, reason) {
    if (!Array.isArray(overwrites) && !(overwrites instanceof Collection)) {
      return Promise.reject(
        new TypeError('INVALID_TYPE', 'overwrites', 'Array or Collection of Permission Overwrites', true),
      );
    }
    return this.edit({ permissionOverwrites: overwrites, reason }).then(() => this);
  }

  /**
   * Updates Overwrites for a user or role in this channel. (creates if non-existent)
   * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The options for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<GuildChannel>}
   * @example
   * // Update or Create permission overwrites for a message author
   * message.channel.updateOverwrite(message.author, {
   *   SEND_MESSAGES: false
   * })
   *   .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
   *   .catch(console.error);
   */
  updateOverwrite(userOrRole, options, reason) {
    userOrRole = this.guild.roles.resolve(userOrRole) || this.client.users.resolve(userOrRole);
    if (!userOrRole) return Promise.reject(new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role', true));

    const existing = this.permissionOverwrites.get(userOrRole.id);
    if (existing) return existing.update(options, reason).then(() => this);
    return this.createOverwrite(userOrRole, options, reason);
  }

  /**
   * Overwrites the permissions for a user or role in this channel. (replaces if existent)
   * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The options for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create or Replace permissions overwrites for a message author
   * message.channel.createOverwrite(message.author, {
   *   SEND_MESSAGES: false
   * })
   *   .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
   *   .catch(console.error);
   */
  createOverwrite(userOrRole, options, reason) {
    userOrRole = this.guild.roles.resolve(userOrRole) || this.client.users.resolve(userOrRole);
    if (!userOrRole) return Promise.reject(new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role', true));

    const type = userOrRole instanceof Role ? 'role' : 'member';
    const { allow, deny } = PermissionOverwrites.resolveOverwriteOptions(options);

    return this.client.api
      .channels(this.id)
      .permissions[userOrRole.id].put({
        data: { id: userOrRole.id, type, allow: allow.bitfield, deny: deny.bitfield },
        reason,
      })
      .then(() => this);
  }

  /**
   * Locks in the permission overwrites from the parent channel.
   * @returns {Promise<GuildChannel>}
   */
  lockPermissions() {
    if (!this.parent) return Promise.reject(new Error('GUILD_CHANNEL_ORPHAN'));
    const permissionOverwrites = this.parent.permissionOverwrites.map(overwrite => overwrite.toJSON());
    return this.edit({ permissionOverwrites });
  }

  /**
   * A collection of members that can see this channel, mapped by their ID
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    const members = new Collection();
    for (const member of this.guild.members.cache.values()) {
      if (this.permissionsFor(member).has('VIEW_CHANNEL', false)) {
        members.set(member.id, member);
      }
    }
    return members;
  }

  /**
   * The data for a guild channel.
   * @typedef {Object} ChannelData
   * @property {string} [name] The name of the channel
   * @property {number} [position] The position of the channel
   * @property {string} [topic] The topic of the text channel
   * @property {boolean} [nsfw] Whether the channel is NSFW
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the voice channel
   * @property {Snowflake} [parentID] The parent ID of the channel
   * @property {boolean} [lockPermissions]
   * Lock the permissions of the channel to what the parent's permissions are
   * @property {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [permissionOverwrites]
   * Permission overwrites for the channel
   * @property {number} [rateLimitPerUser] The ratelimit per user for the channel in seconds
   */

  /**
   * Edits the channel.
   * @param {ChannelData} data The new data for the channel
   * @param {string} [reason] Reason for editing this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit a channel
   * channel.edit({ name: 'new-channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async edit(data, reason) {
    if (typeof data.position !== 'undefined') {
      await Util.setPosition(
        this,
        data.position,
        false,
        this.guild._sortedChannels(this),
        this.client.api.guilds(this.guild.id).channels,
        reason,
      ).then(updatedChannels => {
        this.client.actions.GuildChannelsPositionUpdate.handle({
          guild_id: this.guild.id,
          channels: updatedChannels,
        });
      });
    }

    const permission_overwrites =
      data.permissionOverwrites && data.permissionOverwrites.map(o => PermissionOverwrites.resolve(o, this.guild));

    const newData = await this.client.api.channels(this.id).patch({
      data: {
        name: (data.name || this.name).trim(),
        topic: data.topic,
        nsfw: data.nsfw,
        bitrate: data.bitrate || this.bitrate,
        user_limit: typeof data.userLimit !== 'undefined' ? data.userLimit : this.userLimit,
        parent_id: data.parentID,
        lock_permissions: data.lockPermissions,
        rate_limit_per_user: data.rateLimitPerUser,
        permission_overwrites,
      },
      reason,
    });

    const clone = this._clone();
    clone._patch(newData);
    return clone;
  }

  /**
   * Sets a new name for the guild channel.
   * @param {string} name The new name for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's name
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel name
   * channel.setName('not_general')
   *   .then(newChannel => console.log(`Channel's new name is ${newChannel.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Sets the category parent of this channel.
   * @param {?CategoryChannel|Snowflake} channel Parent channel
   * @param {Object} [options={}] Options to pass
   * @param {boolean} [options.lockPermissions=true] Lock the permissions to what the parent's permissions are
   * @param {string} [options.reason] Reason for modifying the parent of this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Add a parent to a channel
   * message.channel.setParent('355908108431917066', { lockPermissions: false })
   *   .then(channel => console.log(`New parent of ${message.channel.name}: ${channel.name}`))
   *   .catch(console.error);
   */
  setParent(channel, { lockPermissions = true, reason } = {}) {
    return this.edit(
      {
        // eslint-disable-next-line no-prototype-builtins
        parentID: channel !== null ? (channel.hasOwnProperty('id') ? channel.id : channel) : null,
        lockPermissions,
      },
      reason,
    );
  }

  /**
   * Sets a new topic for the guild channel.
   * @param {string} topic The new topic for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's topic
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *   .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *   .catch(console.error);
   */
  setTopic(topic, reason) {
    return this.edit({ topic }, reason);
  }

  /**
   * Sets a new position for the guild channel.
   * @param {number} position The new position for the guild channel
   * @param {Object} [options] Options for setting position
   * @param {boolean} [options.relative=false] Change the position relative to its current value
   * @param {string} [options.reason] Reason for changing the position
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel position
   * channel.setPosition(2)
   *   .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *   .catch(console.error);
   */
  setPosition(position, { relative, reason } = {}) {
    return Util.setPosition(
      this,
      position,
      relative,
      this.guild._sortedChannels(this),
      this.client.api.guilds(this.guild.id).channels,
      reason,
    ).then(updatedChannels => {
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: this.guild.id,
        channels: updatedChannels,
      });
      return this;
    });
  }

  /**
   * Creates an invite to this guild channel.
   * @param {Object} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @param {boolean} [options.unique=false] Create a unique invite, or use an existing one with similar settings
   * @param {string} [options.reason] Reason for creating this
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite({ temporary = false, maxAge = 86400, maxUses = 0, unique, reason } = {}) {
    return this.client.api
      .channels(this.id)
      .invites.post({
        data: {
          temporary,
          max_age: maxAge,
          max_uses: maxUses,
          unique,
        },
        reason,
      })
      .then(invite => new Invite(this.client, invite));
  }

  /**
   * Fetches a collection of invites to this guild channel.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  async fetchInvites() {
    const inviteItems = await this.client.api.channels(this.id).invites.get();
    const invites = new Collection();
    for (const inviteItem of inviteItems) {
      const invite = new Invite(this.client, inviteItem);
      invites.set(invite.code, invite);
    }
    return invites;
  }

  /* eslint-disable max-len */
  /**
   * Clones this channel.
   * @param {Object} [options] The options
   * @param {string} [options.name=this.name] Name of the new channel
   * @param {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [options.permissionOverwrites=this.permissionOverwrites]
   * Permission overwrites of the new channel
   * @param {string} [options.type=this.type] Type of the new channel
   * @param {string} [options.topic=this.topic] Topic of the new channel (only text)
   * @param {boolean} [options.nsfw=this.nsfw] Whether the new channel is nsfw (only text)
   * @param {number} [options.bitrate=this.bitrate] Bitrate of the new channel in bits (only voice)
   * @param {number} [options.userLimit=this.userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @param {number} [options.rateLimitPerUser=ThisType.rateLimitPerUser] Ratelimit per user for the new channel (only text)
   * @param {ChannelResolvable} [options.parent=this.parent] Parent of the new channel
   * @param {string} [options.reason] Reason for cloning this channel
   * @returns {Promise<GuildChannel>}
   */
  clone(options = {}) {
    Util.mergeDefault(
      {
        name: this.name,
        permissionOverwrites: this.permissionOverwrites,
        topic: this.topic,
        type: this.type,
        nsfw: this.nsfw,
        parent: this.parent,
        bitrate: this.bitrate,
        userLimit: this.userLimit,
        rateLimitPerUser: this.rateLimitPerUser,
        reason: null,
      },
      options,
    );
    return this.guild.channels.create(options.name, options);
  }
  /* eslint-enable max-len */

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites and ID as another channel.
   * In most cases, a simple `channel.id === channel2.id` will do, and is much faster too.
   * @param {GuildChannel} channel Channel to compare with
   * @returns {boolean}
   */
  equals(channel) {
    let equal =
      channel &&
      this.id === channel.id &&
      this.type === channel.type &&
      this.topic === channel.topic &&
      this.position === channel.position &&
      this.name === channel.name;

    if (equal) {
      if (this.permissionOverwrites && channel.permissionOverwrites) {
        equal = this.permissionOverwrites.equals(channel.permissionOverwrites);
      } else {
        equal = !this.permissionOverwrites && !channel.permissionOverwrites;
      }
    }

    return equal;
  }

  /**
   * Whether the channel is deletable by the client user
   * @type {boolean}
   * @readonly
   */
  get deletable() {
    return this.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS, false);
  }

  /**
   * Whether the channel is manageable by the client user
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.client.user.id === this.guild.ownerID) return true;
    if (this.type === 'voice') {
      if (!this.permissionsFor(this.client.user).has(Permissions.FLAGS.CONNECT, false)) {
        return false;
      }
    } else if (!this.viewable) {
      return false;
    }
    return this.permissionsFor(this.client.user).has(Permissions.FLAGS.MANAGE_CHANNELS, false);
  }

  /**
   * Whether the channel is viewable by the client user
   * @type {boolean}
   * @readonly
   */
  get viewable() {
    if (this.client.user.id === this.guild.ownerID) return true;
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;
    return permissions.has(Permissions.FLAGS.VIEW_CHANNEL, false);
  }

  /**
   * Deletes this channel.
   * @param {string} [reason] Reason for deleting this channel
   * @returns {Promise<GuildChannel>}
   * @example
   * // Delete the channel
   * channel.delete('making room for new channels')
   *   .then(console.log)
   *   .catch(console.error);
   */
  delete(reason) {
    return this.client.api
      .channels(this.id)
      .delete({ reason })
      .then(() => this);
  }
}

module.exports = GuildChannel;
