'use strict';

const BaseManager = require('./BaseManager');
const Role = require('../structures/Role');
const Collection = require('../util/Collection');
const Permissions = require('../util/Permissions');
const { resolveColor } = require('../util/Util');

/**
 * Manages API methods for roles and stores their cache.
 * @extends {BaseManager}
 */
class RoleManager extends BaseManager {
  constructor(guild, iterable) {
    super(guild.client, iterable, Role);
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

  add(data, cache) {
    return super.add(data, cache, { extras: [this.guild] });
  }

  /**
   * Obtains a role from Discord, or the role cache if they're already available.
   * @param {Snowflake} [id] ID of the role
   * @param {boolean} [cache=true] Whether to cache the new role object(s) if they weren't already
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<?Role|Collection<Snowflake, Role>>}
   * @example
   * // Fetch all roles from the guild
   * message.guild.roles.fetch()
   *   .then(roles => console.log(`There are ${roles.cache.size} roles.`))
   *   .catch(console.error);
   * @example
   * // Fetch a single role
   * message.guild.roles.fetch('222078108977594368')
   *   .then(role => console.log(`The role color is: ${role.color}`))
   *   .catch(console.error);
   */
  async fetch(id, cache = true, force = false) {
    if (id && !force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    // We cannot fetch a single role, as of this commit's date, Discord API throws with 405
    const data = await this.client.api.guilds(this.guild.id).roles.get();
    const roles = new Collection();
    for (const role of data) roles.set(role.id, this.add(role, cache));
    return id ? roles.get(id) ?? null : roles;
  }

  /**
   * Data that can be resolved to a Role object. This can be:
   * * A Role
   * * A Snowflake
   * @typedef {Role|Snowflake} RoleResolvable
   */

  /**
   * Resolves a RoleResolvable to a Role object.
   * @method resolve
   * @memberof RoleManager
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Role}
   */

  /**
   * Resolves a RoleResolvable to a role ID string.
   * @method resolveID
   * @memberof RoleManager
   * @instance
   * @param {RoleResolvable} role The role resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Creates a new role in the guild with given information.
   * <warn>The position will silently reset to 1 if an invalid one is provided, or none.</warn>
   * @param {Object} [options] Options
   * @param {string} [options.name] The name of the new role
   * @param {ColorResolvable} [options.color] The data to create the role with
   * @param {boolean} [options.hoist] Whether or not the new role should be hoisted.
   * @param {PermissionResolvable} [options.permissions] The permissions for the new role
   * @param {number} [options.position] The position of the new role
   * @param {boolean} [options.mentionable] Whether or not the new role should be mentionable.
   * @param {string} [options.reason] Reason for creating this role
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
   *   color: 'BLUE',
   *   reason: 'we needed a role for Super Cool People',
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  create(options = {}) {
    let { name, color, hoist, permissions, position, mentionable, reason } = options;
    if (color) color = resolveColor(color);
    if (permissions) permissions = Permissions.resolve(permissions).toString();

    return this.client.api
      .guilds(this.guild.id)
      .roles.post({
        data: {
          name,
          color,
          hoist,
          permissions,
          mentionable,
        },
        reason,
      })
      .then(r => {
        const { role } = this.client.actions.GuildRoleCreate.handle({
          guild_id: this.guild.id,
          role: r,
        });
        if (position) return role.setPosition(position, reason);
        return role;
      });
  }

  /**
   * Gets the managed role a user created when joining the guild, if any
   * <info>Only ever available for bots</info>
   * @param {UserResolvable} user The user to access the bot role for
   * @returns {?Role}
   */
  botRoleFor(user) {
    const userID = this.client.users.resolveID(user);
    if (!userID) return null;
    return this.cache.find(role => role.tags?.botID === userID) ?? null;
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
