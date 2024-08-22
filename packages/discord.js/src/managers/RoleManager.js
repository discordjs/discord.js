'use strict';

const process = require('node:process');
const { Collection } = require('@discordjs/collection');
const { DiscordAPIError } = require('@discordjs/rest');
const { RESTJSONErrorCodes, Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const { Role } = require('../structures/Role');
const { resolveImage } = require('../util/DataResolver');
const PermissionsBitField = require('../util/PermissionsBitField');
const { setPosition, resolveColor } = require('../util/Util');

let cacheWarningEmitted = false;

/**
 * Manages API methods for roles and stores their cache.
 * @extends {CachedManager}
 */
class RoleManager extends CachedManager {
  constructor(guild, iterable) {
    super(guild.client, Role, iterable);
    if (!cacheWarningEmitted && this._cache.constructor.name !== 'Collection') {
      cacheWarningEmitted = true;
      process.emitWarning(
        `Overriding the cache handling for ${this.constructor.name} is unsupported and breaks functionality.`,
        'UnsupportedCacheOverwriteWarning',
      );
    }

    /**
     * The guild belonging to this manager
     * @type {Guild}
     */
    this.guild = guild;
  }

  /**
   * The role cache of this manager
   * @type {Collection<Snowflake, Role>}
   * @name RoleManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache, { extras: [this.guild] });
  }

  /**
   * Obtains a role from Discord, or the role cache if they're already available.
   * @param {Snowflake} [id] The role's id
   * @param {BaseFetchOptions} [options] Additional options for this fetch
   * @returns {Promise<?Role|Collection<Snowflake, Role>>}
   * @example
   * // Fetch all roles from the guild
   * message.guild.roles.fetch()
   *   .then(roles => console.log(`There are ${roles.size} roles.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single role
   * message.guild.roles.fetch('222078108977594368')
   *   .then(role => console.log(`The role color is: ${role.color}`))
   *   .catch(console.error);
   */
  async fetch(id, { cache = true, force = false } = {}) {
    if (!id) {
      const data = await this.client.rest.get(Routes.guildRoles(this.guild.id));
      const roles = new Collection();
      for (const role of data) roles.set(role.id, this._add(role, cache));
      return roles;
    }

    if (!force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    try {
      const data = await this.client.rest.get(Routes.guildRole(this.guild.id, id));
      return this._add(data, cache);
    } catch (error) {
      // TODO: Remove this catch in the next major version
      if (error instanceof DiscordAPIError && error.code === RESTJSONErrorCodes.UnknownRole) {
        return null;
      }

      throw error;
    }
  }

  /**
   * Data that can be resolved to a Role object. This can be:
   * * A Role
   * * A Snowflake
   * @typedef {Role|Snowflake} RoleResolvable
   */

  /**
   * Resolves a {@link RoleResolvable} to a {@link Role} object.
   * @method resolve
   * @memberof RoleManager
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Role}
   */

  /**
   * Resolves a {@link RoleResolvable} to a {@link Role} id.
   * @method resolveId
   * @memberof RoleManager
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Options used to create a new role.
   * @typedef {Object} RoleCreateOptions
   * @property {string} [name] The name of the new role
   * @property {ColorResolvable} [color] The data to create the role with
   * @property {boolean} [hoist] Whether or not the new role should be hoisted
   * @property {PermissionResolvable} [permissions] The permissions for the new role
   * @property {number} [position] The position of the new role
   * @property {boolean} [mentionable] Whether or not the new role should be mentionable
   * @property {?(BufferResolvable|Base64Resolvable|EmojiResolvable)} [icon] The icon for the role
   * <warn>The `EmojiResolvable` should belong to the same guild as the role.
   * If not, pass the emoji's URL directly</warn>
   * @property {?string} [unicodeEmoji] The unicode emoji for the role
   * @property {string} [reason] The reason for creating this role
   */

  /**
   * Creates a new role in the guild with given information.
   * <warn>The position will silently reset to 1 if an invalid one is provided, or none.</warn>
   * @param {RoleCreateOptions} [options] Options for creating the new role
   * @returns {Promise<Role>}
   * @example
   * // Create a new role
   * guild.roles.create()
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new role with data and a reason
   * guild.roles.create({
   *   name: 'Super Cool Blue People',
   *   color: Colors.Blue,
   *   reason: 'we needed a role for Super Cool People',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async create(options = {}) {
    let { name, color, hoist, permissions, position, mentionable, reason, icon, unicodeEmoji } = options;
    color &&= resolveColor(color);
    if (permissions !== undefined) permissions = new PermissionsBitField(permissions);
    if (icon) {
      const guildEmojiURL = this.guild.emojis.resolve(icon)?.imageURL();
      icon = guildEmojiURL ? await resolveImage(guildEmojiURL) : await resolveImage(icon);
      if (typeof icon !== 'string') icon = undefined;
    }

    const data = await this.client.rest.post(Routes.guildRoles(this.guild.id), {
      body: {
        name,
        color,
        hoist,
        permissions,
        mentionable,
        icon,
        unicode_emoji: unicodeEmoji,
      },
      reason,
    });
    const { role } = this.client.actions.GuildRoleCreate.handle({
      guild_id: this.guild.id,
      role: data,
    });
    if (position) return this.setPosition(role, position, { reason });
    return role;
  }

  /**
   * Options for editing a role
   * @typedef {RoleData} RoleEditOptions
   * @property {string} [reason] The reason for editing this role
   */

  /**
   * Edits a role of the guild.
   * @param {RoleResolvable} role The role to edit
   * @param {RoleEditOptions} options The options to provide
   * @returns {Promise<Role>}
   * @example
   * // Edit a role
   * guild.roles.edit('222079219327434752', { name: 'buddies' })
   *   .then(updated => console.log(`Edited role name to ${updated.name}`))
   *   .catch(console.error);
   */
  async edit(role, options) {
    role = this.resolve(role);
    if (!role) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'role', 'RoleResolvable');

    if (typeof options.position === 'number') {
      await this.setPosition(role, options.position, { reason: options.reason });
    }

    let icon = options.icon;
    if (icon) {
      const guildEmojiURL = this.guild.emojis.resolve(icon)?.imageURL();
      icon = guildEmojiURL ? await resolveImage(guildEmojiURL) : await resolveImage(icon);
      if (typeof icon !== 'string') icon = undefined;
    }

    const body = {
      name: options.name,
      color: options.color === undefined ? undefined : resolveColor(options.color),
      hoist: options.hoist,
      permissions: options.permissions === undefined ? undefined : new PermissionsBitField(options.permissions),
      mentionable: options.mentionable,
      icon,
      unicode_emoji: options.unicodeEmoji,
    };

    const d = await this.client.rest.patch(Routes.guildRole(this.guild.id, role.id), { body, reason: options.reason });

    const clone = role._clone();
    clone._patch(d);
    return clone;
  }

  /**
   * Deletes a role.
   * @param {RoleResolvable} role The role to delete
   * @param {string} [reason] Reason for deleting the role
   * @returns {Promise<void>}
   * @example
   * // Delete a role
   * guild.roles.delete('222079219327434752', 'The role needed to go')
   *   .then(() => console.log('Deleted the role'))
   *   .catch(console.error);
   */
  async delete(role, reason) {
    const id = this.resolveId(role);
    await this.client.rest.delete(Routes.guildRole(this.guild.id, id), { reason });
    this.client.actions.GuildRoleDelete.handle({ guild_id: this.guild.id, role_id: id });
  }

  /**
   * Sets the new position of the role.
   * @param {RoleResolvable} role The role to change the position of
   * @param {number} position The new position for the role
   * @param {SetRolePositionOptions} [options] Options for setting the position
   * @returns {Promise<Role>}
   * @example
   * // Set the position of the role
   * guild.roles.setPosition('222197033908436994', 1)
   *   .then(updated => console.log(`Role position: ${updated.position}`))
   *   .catch(console.error);
   */
  async setPosition(role, position, { relative, reason } = {}) {
    role = this.resolve(role);
    if (!role) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'role', 'RoleResolvable');
    const updatedRoles = await setPosition(
      role,
      position,
      relative,
      this.guild._sortedRoles(),
      this.client,
      Routes.guildRoles(this.guild.id),
      reason,
    );

    this.client.actions.GuildRolesPositionUpdate.handle({
      guild_id: this.guild.id,
      roles: updatedRoles,
    });
    return role;
  }

  /**
   * The data needed for updating a guild role's position
   * @typedef {Object} GuildRolePosition
   * @property {RoleResolvable} role The role's id
   * @property {number} position The position to update
   */

  /**
   * Batch-updates the guild's role positions
   * @param {GuildRolePosition[]} rolePositions Role positions to update
   * @returns {Promise<Guild>}
   * @example
   * guild.roles.setPositions([{ role: roleId, position: updatedRoleIndex }])
   *  .then(guild => console.log(`Role positions updated for ${guild}`))
   *  .catch(console.error);
   */
  async setPositions(rolePositions) {
    // Make sure rolePositions are prepared for API
    rolePositions = rolePositions.map(rolePosition => ({
      id: this.resolveId(rolePosition.role),
      position: rolePosition.position,
    }));

    // Call the API to update role positions
    await this.client.rest.patch(Routes.guildRoles(this.guild.id), { body: rolePositions });
    return this.client.actions.GuildRolesPositionUpdate.handle({
      guild_id: this.guild.id,
      roles: rolePositions,
    }).guild;
  }

  /**
   * Compares the positions of two roles.
   * @param {RoleResolvable} role1 First role to compare
   * @param {RoleResolvable} role2 Second role to compare
   * @returns {number} Negative number if the first role's position is lower (second role's is higher),
   * positive number if the first's is higher (second's is lower), 0 if equal
   */
  comparePositions(role1, role2) {
    const resolvedRole1 = this.resolve(role1);
    const resolvedRole2 = this.resolve(role2);
    if (!resolvedRole1 || !resolvedRole2) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'role', 'Role nor a Snowflake');
    }

    const role1Position = resolvedRole1.position;
    const role2Position = resolvedRole2.position;

    if (role1Position === role2Position) {
      return Number(BigInt(resolvedRole2.id) - BigInt(resolvedRole1.id));
    }

    return role1Position - role2Position;
  }

  /**
   * Gets the managed role a user created when joining the guild, if any
   * <info>Only ever available for bots</info>
   * @param {UserResolvable} user The user to access the bot role for
   * @returns {?Role}
   */
  botRoleFor(user) {
    const userId = this.client.users.resolveId(user);
    if (!userId) return null;
    return this.cache.find(role => role.tags?.botId === userId) ?? null;
  }

  /**
   * The `@everyone` role of the guild
   * @type {Role}
   * @readonly
   */
  get everyone() {
    return this.cache.get(this.guild.id);
  }

  /**
   * The premium subscriber role of the guild, if any
   * @type {?Role}
   * @readonly
   */
  get premiumSubscriberRole() {
    return this.cache.find(role => role.tags?.premiumSubscriberRole) ?? null;
  }

  /**
   * The role with the highest position in the cache
   * @type {Role}
   * @readonly
   */
  get highest() {
    return this.cache.reduce((prev, role) => (role.comparePositionTo(prev) > 0 ? role : prev), this.cache.first());
  }
}

module.exports = RoleManager;
