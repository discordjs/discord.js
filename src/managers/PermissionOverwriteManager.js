'use strict';

const BaseManager = require('./BaseManager');
const { TypeError } = require('../errors');
const PermissionOverwrites = require('../structures/PermissionOverwrites');
const Role = require('../structures/Role');
const Collection = require('../util/Collection');

/**
 * Manages API methods for guild channel permission overwrites and stores their cache.
 * @extends {BaseManager}
 */
class PermissionOverwriteManager extends BaseManager {
  constructor(channel, iterable) {
    super(channel.client, iterable, PermissionOverwrites);

    /**
     * The channel of the permission overwrite this manager belongs to
     * @type {GuildChannel}
     */
    this.channel = channel;
  }

  /**
   * The cache of this Manager
   * @type {Collection<Snowflake, PermissionOverwrites>}
   * @name PermissionOverwriteManager#cache
   */

  add(data, cache) {
    return super.add(data, cache, { extras: [this.channel] });
  }

  /**
   * Replaces the permission overwrites in this channel.
   * @param {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} overwrites
   * Permission overwrites the channel gets updated with
   * @param {string} [reason] Reason for updating the channel overwrites
   * @returns {Promise<GuildChannel>}
   * @example
   * message.channel.permissionOverwrites.set([
   *   {
   *      id: message.author.id,
   *      deny: [Permissions.FLAGS.VIEW_CHANNEL],
   *   },
   * ], 'Needed to change permissions');
   */
  async set(overwrites, reason) {
    if (!Array.isArray(overwrites) && !(overwrites instanceof Collection)) {
      throw new TypeError('INVALID_TYPE', 'overwrites', 'Array or Collection of Permission Overwrites', true);
    }
    await this.channel.edit({ permissionOverwrites: overwrites, reason });
    return this.channel;
  }

  /**
   * Edits permission overwrites for a user or role in this channel, or creates an entry if not already present.
   * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The options for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<GuildChannel>}
   * @example
   * // Edit or Create permission overwrites for a message author
   * message.channel.permissionOverwrites.edit(message.author, {
   *   SEND_MESSAGES: false
   * })
   *   .then(channel => console.log(channel.permissionOverwrites.cache.get(message.author.id)))
   *   .catch(console.error);
   */
  async edit(userOrRole, options, reason) {
    userOrRole = this.channel.guild.roles.resolve(userOrRole) ?? this.client.users.resolve(userOrRole);
    if (!userOrRole) throw new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role');

    const type = userOrRole instanceof Role ? 'role' : 'member';
    const { allow, deny } = PermissionOverwrites.resolveOverwriteOptions(options);

    const existing = this.cache.get(userOrRole.id);
    if (existing) {
      await this.client.api
        .channels(this.channel.id)
        .permissions(userOrRole.id)
        .put({
          data: { id: userOrRole.id, type, allow, deny },
          reason,
        });
      return this.channel;
    }
    return this.create(userOrRole, options, reason);
  }

  /**
   * Creates permission overwrites for a user or role in this channel, or replaces them if already present.
   * @param {RoleResolvable|UserResolvable} userOrRole The user or role to update
   * @param {PermissionOverwriteOptions} options The options for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<GuildChannel>}
   * @example
   * // Create or Replace permission overwrites for a message author
   * message.channel.permissionOverwrites.create(message.author, {
   *   SEND_MESSAGES: false
   * })
   *   .then(channel => console.log(channel.permissionOverwrites.cache.get(message.author.id)))
   *   .catch(console.error);
   */
  async create(userOrRole, options, reason) {
    userOrRole = this.channel.guild.roles.resolve(userOrRole) ?? this.client.users.resolve(userOrRole);
    if (!userOrRole) throw new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role');

    const type = userOrRole instanceof Role ? 'role' : 'member';
    const { allow, deny } = PermissionOverwrites.resolveOverwriteOptions(options);

    await this.client.api
      .channels(this.channel.id)
      .permissions(userOrRole.id)
      .put({
        data: { id: userOrRole.id, type, allow, deny },
        reason,
      });
    return this.channel;
  }

  /**
   * Deletes permission overwrites for a user or role in this channel
   * @param {UserResolvable|RoleResolvable} userOrRole The user or role to delete
   * @param {string} [reason] The reason for deleting the overwrite
   * @returns {GuildChannel}
   */
  async delete(userOrRole, reason) {
    userOrRole = this.channel.guild.roles.resolve(userOrRole) ?? this.client.users.resolve(userOrRole);
    if (!userOrRole) throw new TypeError('INVALID_TYPE', 'parameter', 'User nor a Role');

    await this.client.api.channels(this.channel.id).permissions(userOrRole.id).delete({ reason });
    return this.channel;
  }
}

module.exports = PermissionOverwriteManager;
