'use strict';

const { Channel } = require('./Channel');
const PermissionOverwrites = require('./PermissionOverwrites');
const { Error } = require('../errors');
const PermissionOverwriteManager = require('../managers/PermissionOverwriteManager');
const { ChannelTypes, VoiceBasedChannelTypes } = require('../util/Constants');
const Permissions = require('../util/Permissions');
const Util = require('../util/Util');

/**
 * Represents a guild channel from any of the following:
 * - {@link TextChannel}
 * - {@link VoiceChannel}
 * - {@link CategoryChannel}
 * - {@link NewsChannel}
 * - {@link StoreChannel}
 * - {@link StageChannel}
 * @extends {Channel}
 * @abstract
 */
class GuildChannel extends Channel {
  constructor(guild, data, client, immediatePatch = true) {
    super(guild?.client ?? client, data, false);

    /**
     * The guild the channel is in
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The id of the guild the channel is in
     * @type {Snowflake}
     */
    this.guildId = guild?.id ?? data.guild_id;

    this.parentId = this.parentId ?? null;
    /**
     * A manager of permission overwrites that belong to this channel
     * @type {PermissionOverwriteManager}
     */
    this.permissionOverwrites = new PermissionOverwriteManager(this);

    if (data && immediatePatch) this._patch(data);
  }

  _patch(data) {
    super._patch(data);

    if ('name' in data) {
      /**
       * The name of the guild channel
       * @type {string}
       */
      this.name = data.name;
    }

    if ('position' in data) {
      /**
       * The raw position of the channel from Discord
       * @type {number}
       */
      this.rawPosition = data.position;
    }

    if ('guild_id' in data) {
      this.guildId = data.guild_id;
    }

    if ('parent_id' in data) {
      /**
       * The id of the category parent of this channel
       * @type {?Snowflake}
       */
      this.parentId = data.parent_id;
    }

    if ('permission_overwrites' in data) {
      this.permissionOverwrites.cache.clear();
      for (const overwrite of data.permission_overwrites) {
        this.permissionOverwrites._add(overwrite);
      }
    }
  }

  _clone() {
    const clone = super._clone();
    clone.permissionOverwrites = new PermissionOverwriteManager(clone, this.permissionOverwrites.cache.values());
    return clone;
  }

  /**
   * The category parent of this channel
   * @type {?CategoryChannel}
   * @readonly
   */
  get parent() {
    return this.guild.channels.resolve(this.parentId);
  }

  /**
   * If the permissionOverwrites match the parent channel, null if no parent
   * @type {?boolean}
   * @readonly
   */
  get permissionsLocked() {
    if (!this.parent) return null;

    // Get all overwrites
    const overwriteIds = new Set([
      ...this.permissionOverwrites.cache.keys(),
      ...this.parent.permissionOverwrites.cache.keys(),
    ]);

    // Compare all overwrites
    return [...overwriteIds].every(key => {
      const channelVal = this.permissionOverwrites.cache.get(key);
      const parentVal = this.parent.permissionOverwrites.cache.get(key);

      // Handle empty overwrite
      if (
        (!channelVal &&
          parentVal.deny.bitfield === Permissions.defaultBit &&
          parentVal.allow.bitfield === Permissions.defaultBit) ||
        (!parentVal &&
          channelVal.deny.bitfield === Permissions.defaultBit &&
          channelVal.allow.bitfield === Permissions.defaultBit)
      ) {
        return true;
      }

      // Compare overwrites
      return (
        typeof channelVal !== 'undefined' &&
        typeof parentVal !== 'undefined' &&
        channelVal.deny.bitfield === parentVal.deny.bitfield &&
        channelVal.allow.bitfield === parentVal.allow.bitfield
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
    return [...sorted.values()].indexOf(sorted.get(this.id));
  }

  /**
   * Gets the overall set of permissions for a member or role in this channel, taking into account channel overwrites.
   * @param {GuildMemberResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @param {boolean} [checkAdmin=true] Whether having `ADMINISTRATOR` will return all permissions
   * @returns {?Readonly<Permissions>}
   */
  permissionsFor(memberOrRole, checkAdmin = true) {
    const member = this.guild.members.resolve(memberOrRole);
    if (member) return this.memberPermissions(member, checkAdmin);
    const role = this.guild.roles.resolve(memberOrRole);
    return role && this.rolePermissions(role, checkAdmin);
  }

  overwritesFor(member, verified = false, roles = null) {
    if (!verified) member = this.guild.members.resolve(member);
    if (!member) return [];

    roles ??= member.roles.cache;
    const roleOverwrites = [];
    let memberOverwrites;
    let everyoneOverwrites;

    for (const overwrite of this.permissionOverwrites.cache.values()) {
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
   * @param {boolean} checkAdmin=true Whether having `ADMINISTRATOR` will return all permissions
   * @returns {Readonly<Permissions>}
   * @private
   */
  memberPermissions(member, checkAdmin) {
    if (checkAdmin && member.id === this.guild.ownerId) return new Permissions(Permissions.ALL).freeze();

    const roles = member.roles.cache;
    const permissions = new Permissions(roles.map(role => role.permissions));

    if (checkAdmin && permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return new Permissions(Permissions.ALL).freeze();
    }

    const overwrites = this.overwritesFor(member, true, roles);

    return permissions
      .remove(overwrites.everyone?.deny ?? Permissions.defaultBit)
      .add(overwrites.everyone?.allow ?? Permissions.defaultBit)
      .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.deny) : Permissions.defaultBit)
      .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allow) : Permissions.defaultBit)
      .remove(overwrites.member?.deny ?? Permissions.defaultBit)
      .add(overwrites.member?.allow ?? Permissions.defaultBit)
      .freeze();
  }

  /**
   * Gets the overall set of permissions for a role in this channel, taking into account channel overwrites.
   * @param {Role} role The role to obtain the overall permissions for
   * @param {boolean} checkAdmin Whether having `ADMINISTRATOR` will return all permissions
   * @returns {Readonly<Permissions>}
   * @private
   */
  rolePermissions(role, checkAdmin) {
    if (checkAdmin && role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return new Permissions(Permissions.ALL).freeze();
    }

    const everyoneOverwrites = this.permissionOverwrites.cache.get(this.guild.id);
    const roleOverwrites = this.permissionOverwrites.cache.get(role.id);

    return role.permissions
      .remove(everyoneOverwrites?.deny ?? Permissions.defaultBit)
      .add(everyoneOverwrites?.allow ?? Permissions.defaultBit)
      .remove(roleOverwrites?.deny ?? Permissions.defaultBit)
      .add(roleOverwrites?.allow ?? Permissions.defaultBit)
      .freeze();
  }

  /**
   * Locks in the permission overwrites from the parent channel.
   * @returns {Promise<GuildChannel>}
   */
  lockPermissions() {
    if (!this.parent) return Promise.reject(new Error('GUILD_CHANNEL_ORPHAN'));
    const permissionOverwrites = this.parent.permissionOverwrites.cache.map(overwrite => overwrite.toJSON());
    return this.edit({ permissionOverwrites });
  }

  /**
   * A collection of cached members of this channel, mapped by their ids.
   * Members that can view this channel, if the channel is text-based.
   * Members in the channel, if the channel is voice-based.
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    return this.guild.members.cache.filter(m => this.permissionsFor(m).has(Permissions.FLAGS.VIEW_CHANNEL, false));
  }

  /**
   * The data for a guild channel.
   * @typedef {Object} ChannelData
   * @property {string} [name] The name of the channel
   * @property {ChannelType} [type] The type of the channel (only conversion between text and news is supported)
   * @property {number} [position] The position of the channel
   * @property {string} [topic] The topic of the text channel
   * @property {boolean} [nsfw] Whether the channel is NSFW
   * @property {number} [bitrate] The bitrate of the voice channel
   * @property {number} [userLimit] The user limit of the voice channel
   * @property {?CategoryChannelResolvable} [parent] The parent of the channel
   * @property {boolean} [lockPermissions]
   * Lock the permissions of the channel to what the parent's permissions are
   * @property {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [permissionOverwrites]
   * Permission overwrites for the channel
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the channel in seconds
   * @property {ThreadAutoArchiveDuration} [defaultAutoArchiveDuration]
   * The default auto archive duration for all new threads in this channel
   * @property {?string} [rtcRegion] The RTC region of the channel
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
    data.parent &&= this.client.channels.resolveId(data.parent);

    if (typeof data.position !== 'undefined') {
      const updatedChannels = await Util.setPosition(
        this,
        data.position,
        false,
        this.guild._sortedChannels(this),
        this.client.api.guilds(this.guild.id).channels,
        reason,
      );
      this.client.actions.GuildChannelsPositionUpdate.handle({
        guild_id: this.guild.id,
        channels: updatedChannels,
      });
    }

    let permission_overwrites;

    if (data.permissionOverwrites) {
      permission_overwrites = data.permissionOverwrites.map(o => PermissionOverwrites.resolve(o, this.guild));
    }

    if (data.lockPermissions) {
      if (data.parent) {
        const newParent = this.guild.channels.resolve(data.parent);
        if (newParent?.type === 'GUILD_CATEGORY') {
          permission_overwrites = newParent.permissionOverwrites.cache.map(o =>
            PermissionOverwrites.resolve(o, this.guild),
          );
        }
      } else if (this.parent) {
        permission_overwrites = this.parent.permissionOverwrites.cache.map(o =>
          PermissionOverwrites.resolve(o, this.guild),
        );
      }
    }

    const newData = await this.client.api.channels(this.id).patch({
      data: {
        name: (data.name ?? this.name).trim(),
        type: ChannelTypes[data.type],
        topic: data.topic,
        nsfw: data.nsfw,
        bitrate: data.bitrate ?? this.bitrate,
        user_limit: data.userLimit ?? this.userLimit,
        rtc_region: data.rtcRegion ?? this.rtcRegion,
        parent_id: data.parent,
        lock_permissions: data.lockPermissions,
        rate_limit_per_user: data.rateLimitPerUser,
        default_auto_archive_duration: data.defaultAutoArchiveDuration,
        permission_overwrites,
      },
      reason,
    });

    return this.client.actions.ChannelUpdate.handle(newData).updated;
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
   * Options used to set the parent of a channel.
   * @typedef {Object} SetParentOptions
   * @property {boolean} [lockPermissions=true] Whether to lock the permissions to what the parent's permissions are
   * @property {string} [reason] The reason for modifying the parent of the channel
   */

  /**
   * Sets the parent of this channel.
   * @param {?CategoryChannelResolvable} channel The category channel to set as the parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
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
        parent: channel ?? null,
        lockPermissions,
      },
      reason,
    );
  }

  /**
   * Options used to set the position of a channel.
   * @typedef {Object} SetChannelPositionOptions
   * @property {boolean} [relative=false] Whether or not to change the position relative to its current value
   * @property {string} [reason] The reason for changing the position
   */

  /**
   * Sets a new position for the guild channel.
   * @param {number} position The new position for the guild channel
   * @param {SetChannelPositionOptions} [options] Options for setting position
   * @returns {Promise<GuildChannel>}
   * @example
   * // Set a new channel position
   * channel.setPosition(2)
   *   .then(newChannel => console.log(`Channel's new position is ${newChannel.position}`))
   *   .catch(console.error);
   */
  async setPosition(position, { relative, reason } = {}) {
    const updatedChannels = await Util.setPosition(
      this,
      position,
      relative,
      this.guild._sortedChannels(this),
      this.client.api.guilds(this.guild.id).channels,
      reason,
    );
    this.client.actions.GuildChannelsPositionUpdate.handle({
      guild_id: this.guild.id,
      channels: updatedChannels,
    });
    return this;
  }

  /**
   * Data that can be resolved to an Application. This can be:
   * * An Application
   * * An Activity with associated Application
   * * A Snowflake
   * @typedef {Application|Snowflake} ApplicationResolvable
   */

  /**
   * Options used to clone a guild channel.
   * @typedef {GuildChannelCreateOptions} GuildChannelCloneOptions
   * @property {string} [name=this.name] Name of the new channel
   */

  /**
   * Clones this channel.
   * @param {GuildChannelCloneOptions} [options] The options for cloning this channel
   * @returns {Promise<GuildChannel>}
   */
  clone(options = {}) {
    return this.guild.channels.create(options.name ?? this.name, {
      permissionOverwrites: this.permissionOverwrites.cache,
      topic: this.topic,
      type: this.type,
      nsfw: this.nsfw,
      parent: this.parent,
      bitrate: this.bitrate,
      userLimit: this.userLimit,
      rateLimitPerUser: this.rateLimitPerUser,
      position: this.rawPosition,
      reason: null,
      ...options,
    });
  }

  /**
   * Checks if this channel has the same type, topic, position, name, overwrites, and id as another channel.
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
        equal = this.permissionOverwrites.cache.equals(channel.permissionOverwrites.cache);
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
    return this.manageable && this.guild.rulesChannelId !== this.id && this.guild.publicUpdatesChannelId !== this.id;
  }

  /**
   * Whether the channel is manageable by the client user
   * @type {boolean}
   * @readonly
   */
  get manageable() {
    if (this.client.user.id === this.guild.ownerId) return true;
    const permissions = this.permissionsFor(this.client.user);
    if (!permissions) return false;

    // This flag allows managing even if timed out
    if (permissions.has(Permissions.FLAGS.ADMINISTRATOR, false)) return true;
    if (this.guild.me.communicationDisabledUntilTimestamp > Date.now()) return false;

    const bitfield = VoiceBasedChannelTypes.includes(this.type)
      ? Permissions.FLAGS.MANAGE_CHANNELS | Permissions.FLAGS.CONNECT
      : Permissions.FLAGS.VIEW_CHANNEL | Permissions.FLAGS.MANAGE_CHANNELS;
    return permissions.has(bitfield, false);
  }

  /**
   * Whether the channel is viewable by the client user
   * @type {boolean}
   * @readonly
   */
  get viewable() {
    if (this.client.user.id === this.guild.ownerId) return true;
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
  async delete(reason) {
    await this.client.api.channels(this.id).delete({ reason });
    return this;
  }
}

module.exports = GuildChannel;
