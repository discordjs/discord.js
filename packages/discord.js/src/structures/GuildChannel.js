'use strict';

const { Snowflake } = require('@sapphire/snowflake');
const { PermissionFlagsBits, ChannelType } = require('discord-api-types/v10');
const { BaseChannel } = require('./BaseChannel.js');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { PermissionOverwriteManager } = require('../managers/PermissionOverwriteManager.js');
const { VoiceBasedChannelTypes } = require('../util/Constants.js');
const { PermissionsBitField } = require('../util/PermissionsBitField.js');
const { getSortableGroupTypes } = require('../util/Util.js');

/**
 * Represents a guild channel from any of the following:
 * - {@link TextChannel}
 * - {@link VoiceChannel}
 * - {@link CategoryChannel}
 * - {@link AnnouncementChannel}
 * - {@link StageChannel}
 * - {@link ForumChannel}
 * - {@link MediaChannel}
 * @extends {BaseChannel}
 * @abstract
 */
class GuildChannel extends BaseChannel {
  constructor(guild, data, client, immediatePatch = true) {
    super(client, data, false);

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
    } else {
      this.parentId ??= null;
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
          parentVal.deny.bitfield === PermissionsBitField.DefaultBit &&
          parentVal.allow.bitfield === PermissionsBitField.DefaultBit) ||
        (!parentVal &&
          channelVal.deny.bitfield === PermissionsBitField.DefaultBit &&
          channelVal.allow.bitfield === PermissionsBitField.DefaultBit)
      ) {
        return true;
      }

      // Compare overwrites
      return (
        channelVal !== undefined &&
        parentVal !== undefined &&
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
    const selfIsCategory = this.type === ChannelType.GuildCategory;
    const types = getSortableGroupTypes(this.type);

    let count = 0;
    for (const channel of this.guild.channels.cache.values()) {
      if (!types.includes(channel.type)) continue;
      if (!selfIsCategory && channel.parentId !== this.parentId) continue;
      if (this.rawPosition === channel.rawPosition) {
        if (Snowflake.compare(channel.id, this.id) === -1) count++;
      } else if (this.rawPosition > channel.rawPosition) {
        count++;
      }
    }

    return count;
  }

  /**
   * Gets the overall set of permissions for a member or role in this channel, taking into account channel overwrites.
   * @param {UserResolvable|RoleResolvable} memberOrRole The member or role to obtain the overall permissions for
   * @param {boolean} [checkAdmin=true] Whether having the {@link PermissionFlagsBits.Administrator} permission
   * will return all permissions
   * @returns {?Readonly<PermissionsBitField>}
   */
  permissionsFor(memberOrRole, checkAdmin = true) {
    const member = this.guild.members.resolve(memberOrRole);
    if (member) return this.memberPermissions(member, checkAdmin);
    const role = this.guild.roles.resolve(memberOrRole);
    return role && this.rolePermissions(role, checkAdmin);
  }

  overwritesFor(member, verified = false, roles = null) {
    const resolvedMember = verified ? member : this.guild.members.resolve(member);
    if (!resolvedMember) return [];

    const resolvedRoles = roles ?? resolvedMember.roles.cache;
    const roleOverwrites = [];
    let memberOverwrites;
    let everyoneOverwrites;

    for (const overwrite of this.permissionOverwrites.cache.values()) {
      if (overwrite.id === this.guild.id) {
        everyoneOverwrites = overwrite;
      } else if (resolvedRoles.has(overwrite.id)) {
        roleOverwrites.push(overwrite);
      } else if (overwrite.id === resolvedMember.id) {
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
   * @param {boolean} checkAdmin Whether having the {@link PermissionFlagsBits.Administrator} permission
   * will return all permissions
   * @returns {Readonly<PermissionsBitField>}
   * @private
   */
  memberPermissions(member, checkAdmin) {
    if (checkAdmin && member.id === this.guild.ownerId) {
      return new PermissionsBitField(PermissionsBitField.All).freeze();
    }

    const roles = member.roles.cache;
    const permissions = new PermissionsBitField(roles.map(role => role.permissions));

    if (checkAdmin && permissions.has(PermissionFlagsBits.Administrator)) {
      return new PermissionsBitField(PermissionsBitField.All).freeze();
    }

    const overwrites = this.overwritesFor(member, true, roles);

    return permissions
      .remove(overwrites.everyone?.deny ?? PermissionsBitField.DefaultBit)
      .add(overwrites.everyone?.allow ?? PermissionsBitField.DefaultBit)
      .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.deny) : PermissionsBitField.DefaultBit)
      .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allow) : PermissionsBitField.DefaultBit)
      .remove(overwrites.member?.deny ?? PermissionsBitField.DefaultBit)
      .add(overwrites.member?.allow ?? PermissionsBitField.DefaultBit)
      .freeze();
  }

  /**
   * Gets the overall set of permissions for a role in this channel, taking into account channel overwrites.
   * @param {Role} role The role to obtain the overall permissions for
   * @param {boolean} checkAdmin Whether having the {@link PermissionFlagsBits.Administrator} permission
   * will return all permissions
   * @returns {Readonly<PermissionsBitField>}
   * @private
   */
  rolePermissions(role, checkAdmin) {
    if (checkAdmin && role.permissions.has(PermissionFlagsBits.Administrator)) {
      return new PermissionsBitField(PermissionsBitField.All).freeze();
    }

    const everyoneOverwrites = this.permissionOverwrites.cache.get(this.guild.id);
    const roleOverwrites = this.permissionOverwrites.cache.get(role.id);

    return role.permissions
      .remove(everyoneOverwrites?.deny ?? PermissionsBitField.DefaultBit)
      .add(everyoneOverwrites?.allow ?? PermissionsBitField.DefaultBit)
      .remove(roleOverwrites?.deny ?? PermissionsBitField.DefaultBit)
      .add(roleOverwrites?.allow ?? PermissionsBitField.DefaultBit)
      .freeze();
  }

  /**
   * Locks in the permission overwrites from the parent channel.
   * @returns {Promise<GuildChannel>}
   */
  async lockPermissions() {
    if (!this.parent) throw new DiscordjsError(ErrorCodes.GuildChannelOrphan);
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
    return this.guild.members.cache.filter(member =>
      this.permissionsFor(member).has(PermissionFlagsBits.ViewChannel, false),
    );
  }

  /**
   * Edits the channel.
   * @param {GuildChannelEditOptions} options The options to provide
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit a channel
   * channel.edit({ name: 'new-channel' })
   *   .then(console.log)
   *   .catch(console.error);
   */
  edit(options) {
    return this.guild.channels.edit(this, options);
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
    return this.edit({ name, reason });
  }

  /**
   * Options used to set the parent of a channel.
   * @typedef {Object} SetParentOptions
   * @property {boolean} [lockPermissions=false] Whether to lock the permissions to what the parent's permissions are
   * @property {string} [reason] The reason for modifying the parent of the channel
   */

  /**
   * Sets the parent of this channel.
   * @param {?CategoryChannelResolvable} channel The category channel to set as the parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
   * @returns {Promise<GuildChannel>}
   * @example
   * // Add a parent to a channel
   * message.channel.setParent('355908108431917066')
   *   .then(channel => console.log(`New parent of ${channel.name}: ${channel.parent.name}`))
   *   .catch(console.error);
   * @example
   * // Move a channel and sync its permissions with the parent
   * message.channel.setParent('355908108431917066', { lockPermissions: true })
   *   .then(channel => console.log(`Moved ${message.channel.name} to ${channel.parent.name}`))
   *   .catch(console.error);
   */
  setParent(channel, { lockPermissions = false, reason } = {}) {
    return this.edit({
      parent: channel ?? null,
      lockPermissions,
      reason,
    });
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
  setPosition(position, options = {}) {
    return this.guild.channels.setPosition(this, position, options);
  }

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
    return this.guild.channels.create({
      name: options.name ?? this.name,
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
    if (permissions.has(PermissionFlagsBits.Administrator, false)) return true;
    if (this.guild.members.me.communicationDisabledUntilTimestamp > Date.now()) return false;

    const bitfield = VoiceBasedChannelTypes.includes(this.type)
      ? PermissionFlagsBits.ManageChannels | PermissionFlagsBits.Connect
      : PermissionFlagsBits.ViewChannel | PermissionFlagsBits.ManageChannels;
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
    return permissions.has(PermissionFlagsBits.ViewChannel, false);
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
    await this.guild.channels.delete(this.id, reason);
    return this;
  }
}

exports.GuildChannel = GuildChannel;
