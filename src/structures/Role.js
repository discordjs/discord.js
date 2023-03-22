'use strict';

const process = require('node:process');
const Base = require('./Base');
const { Error } = require('../errors');
const Permissions = require('../util/Permissions');
const SnowflakeUtil = require('../util/SnowflakeUtil');

let deprecationEmittedForComparePositions = false;

/**
 * @type {WeakSet<Role>}
 * @private
 * @internal
 */
const deletedRoles = new WeakSet();
let deprecationEmittedForDeleted = false;

/**
 * Represents a role on Discord.
 * @extends {Base}
 */
class Role extends Base {
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild that the role belongs to
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The icon hash of the role
     * @type {?string}
     */
    this.icon = null;

    /**
     * The unicode emoji for the role
     * @type {?string}
     */
    this.unicodeEmoji = null;

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The role's id (unique to the guild it is part of)
     * @type {Snowflake}
     */
    this.id = data.id;
    if ('name' in data) {
      /**
       * The name of the role
       * @type {string}
       */
      this.name = data.name;
    }

    if ('color' in data) {
      /**
       * The base 10 color of the role
       * @type {number}
       */
      this.color = data.color;
    }

    if ('hoist' in data) {
      /**
       * If true, users that are part of this role will appear in a separate category in the users list
       * @type {boolean}
       */
      this.hoist = data.hoist;
    }

    if ('position' in data) {
      /**
       * The raw position of the role from the API
       * @type {number}
       */
      this.rawPosition = data.position;
    }

    if ('permissions' in data) {
      /**
       * The permissions of the role
       * @type {Readonly<Permissions>}
       */
      this.permissions = new Permissions(BigInt(data.permissions)).freeze();
    }

    if ('managed' in data) {
      /**
       * Whether or not the role is managed by an external service
       * @type {boolean}
       */
      this.managed = data.managed;
    }

    if ('mentionable' in data) {
      /**
       * Whether or not the role can be mentioned by anyone
       * @type {boolean}
       */
      this.mentionable = data.mentionable;
    }

    if ('icon' in data) this.icon = data.icon;

    if ('unicode_emoji' in data) this.unicodeEmoji = data.unicode_emoji;

    /**
     * The tags this role has
     * @type {?Object}
     * @property {Snowflake} [botId] The id of the bot this role belongs to
     * @property {Snowflake|string} [integrationId] The id of the integration this role belongs to
     * @property {true} [premiumSubscriberRole] Whether this is the guild's premium subscription role
     * @property {Snowflake} [subscriptionListingId] The id of this role's subscription SKU and listing
     * @property {true} [availableForPurchase] Whether this role is available for purchase
     */
    this.tags = data.tags ? {} : null;
    if (data.tags) {
      if ('bot_id' in data.tags) {
        this.tags.botId = data.tags.bot_id;
      }
      if ('integration_id' in data.tags) {
        this.tags.integrationId = data.tags.integration_id;
      }
      if ('premium_subscriber' in data.tags) {
        this.tags.premiumSubscriberRole = true;
      }
      if ('subscription_listing_id' in data.tags) {
        this.tags.subscriptionListingId = data.tags.subscription_listing_id;
      }
      if ('available_for_purchase' in data.tags) {
        this.tags.availableForPurchase = true;
      }
    }
  }

  /**
   * The timestamp the role was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.timestampFrom(this.id);
  }

  /**
   * The time the role was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Whether or not the role has been deleted
   * @type {boolean}
   * @deprecated This will be removed in the next major version, see https://github.com/discordjs/discord.js/issues/7091
   */
  get deleted() {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'Role#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    return deletedRoles.has(this);
  }

  set deleted(value) {
    if (!deprecationEmittedForDeleted) {
      deprecationEmittedForDeleted = true;
      process.emitWarning(
        'Role#deleted is deprecated, see https://github.com/discordjs/discord.js/issues/7091.',
        'DeprecationWarning',
      );
    }

    if (value) deletedRoles.add(this);
    else deletedRoles.delete(this);
  }

  /**
   * The hexadecimal version of the role color, with a leading hashtag
   * @type {string}
   * @readonly
   */
  get hexColor() {
    return `#${this.color.toString(16).padStart(6, '0')}`;
  }

  /**
   * The cached guild members that have this role
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    return this.guild.members.cache.filter(m => m.roles.cache.has(this.id));
  }

  /**
   * Whether the role is editable by the client user
   * @type {boolean}
   * @readonly
   */
  get editable() {
    if (this.managed) return false;
    const clientMember = this.guild.members.resolve(this.client.user);
    if (!clientMember.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return false;
    return clientMember.roles.highest.comparePositionTo(this) > 0;
  }

  /**
   * The position of the role in the role manager
   * @type {number}
   * @readonly
   */
  get position() {
    const sorted = this.guild._sortedRoles();
    return [...sorted.values()].indexOf(sorted.get(this.id));
  }

  /**
   * Compares this role's position to another role's.
   * @param {RoleResolvable} role Role to compare to this one
   * @returns {number} Negative number if this role's position is lower (other role's is higher),
   * positive number if this one is higher (other's is lower), 0 if equal
   * * @example
   * // Compare the position of a role to another
   * const roleCompare = role.comparePositionTo(otherRole);
   * if (roleCompare === 1) console.log(`${role.name} is higher than ${otherRole.name}`);
   */
  comparePositionTo(role) {
    return this.guild.roles.comparePositions(this, role);
  }

  /**
   * The data for a role.
   * @typedef {Object} RoleData
   * @property {string} [name] The name of the role
   * @property {ColorResolvable} [color] The color of the role, either a hex string or a base 10 number
   * @property {boolean} [hoist] Whether or not the role should be hoisted
   * @property {number} [position] The position of the role
   * @property {PermissionResolvable} [permissions] The permissions of the role
   * @property {boolean} [mentionable] Whether or not the role should be mentionable
   * @property {?(BufferResolvable|Base64Resolvable|EmojiResolvable)} [icon] The icon for the role
   * <warn>The `EmojiResolvable` should belong to the same guild as the role.
   * If not, pass the emoji's URL directly</warn>
   * @property {?string} [unicodeEmoji] The unicode emoji for the role
   */

  /**
   * Edits the role.
   * @param {RoleData} data The new data for the role
   * @param {string} [reason] Reason for editing this role
   * @returns {Promise<Role>}
   * @example
   * // Edit a role
   * role.edit({ name: 'new role' })
   *   .then(updated => console.log(`Edited role name to ${updated.name}`))
   *   .catch(console.error);
   */
  edit(data, reason) {
    return this.guild.roles.edit(this, data, reason);
  }

  /**
   * Returns `channel.permissionsFor(role)`. Returns permissions for a role in a guild channel,
   * taking into account permission overwrites.
   * @param {GuildChannel|Snowflake} channel The guild channel to use as context
   * @param {boolean} [checkAdmin=true] Whether having `ADMINISTRATOR` will return all permissions
   * @returns {Readonly<Permissions>}
   */
  permissionsIn(channel, checkAdmin = true) {
    channel = this.guild.channels.resolve(channel);
    if (!channel) throw new Error('GUILD_CHANNEL_RESOLVE');
    return channel.rolePermissions(this, checkAdmin);
  }

  /**
   * Sets a new name for the role.
   * @param {string} name The new name of the role
   * @param {string} [reason] Reason for changing the role's name
   * @returns {Promise<Role>}
   * @example
   * // Set the name of the role
   * role.setName('new role')
   *   .then(updated => console.log(`Updated role name to ${updated.name}`))
   *   .catch(console.error);
   */
  setName(name, reason) {
    return this.edit({ name }, reason);
  }

  /**
   * Sets a new color for the role.
   * @param {ColorResolvable} color The color of the role
   * @param {string} [reason] Reason for changing the role's color
   * @returns {Promise<Role>}
   * @example
   * // Set the color of a role
   * role.setColor('#FF0000')
   *   .then(updated => console.log(`Set color of role to ${updated.color}`))
   *   .catch(console.error);
   */
  setColor(color, reason) {
    return this.edit({ color }, reason);
  }

  /**
   * Sets whether or not the role should be hoisted.
   * @param {boolean} [hoist=true] Whether or not to hoist the role
   * @param {string} [reason] Reason for setting whether or not the role should be hoisted
   * @returns {Promise<Role>}
   * @example
   * // Set the hoist of the role
   * role.setHoist(true)
   *   .then(updated => console.log(`Role hoisted: ${updated.hoist}`))
   *   .catch(console.error);
   */
  setHoist(hoist = true, reason) {
    return this.edit({ hoist }, reason);
  }

  /**
   * Sets the permissions of the role.
   * @param {PermissionResolvable} permissions The permissions of the role
   * @param {string} [reason] Reason for changing the role's permissions
   * @returns {Promise<Role>}
   * @example
   * // Set the permissions of the role
   * role.setPermissions([Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS])
   *   .then(updated => console.log(`Updated permissions to ${updated.permissions.bitfield}`))
   *   .catch(console.error);
   * @example
   * // Remove all permissions from a role
   * role.setPermissions(0n)
   *   .then(updated => console.log(`Updated permissions to ${updated.permissions.bitfield}`))
   *   .catch(console.error);
   */
  setPermissions(permissions, reason) {
    return this.edit({ permissions }, reason);
  }

  /**
   * Sets whether this role is mentionable.
   * @param {boolean} [mentionable=true] Whether this role should be mentionable
   * @param {string} [reason] Reason for setting whether or not this role should be mentionable
   * @returns {Promise<Role>}
   * @example
   * // Make the role mentionable
   * role.setMentionable(true)
   *   .then(updated => console.log(`Role updated ${updated.name}`))
   *   .catch(console.error);
   */
  setMentionable(mentionable = true, reason) {
    return this.edit({ mentionable }, reason);
  }

  /**
   * Sets a new icon for the role.
   * @param {?(BufferResolvable|Base64Resolvable|EmojiResolvable)} icon The icon for the role
   * <warn>The `EmojiResolvable` should belong to the same guild as the role.
   * If not, pass the emoji's URL directly</warn>
   * @param {string} [reason] Reason for changing the role's icon
   * @returns {Promise<Role>}
   */
  setIcon(icon, reason) {
    return this.edit({ icon }, reason);
  }

  /**
   * Sets a new unicode emoji for the role.
   * @param {?string} unicodeEmoji The new unicode emoji for the role
   * @param {string} [reason] Reason for changing the role's unicode emoji
   * @returns {Promise<Role>}
   * @example
   * // Set a new unicode emoji for the role
   * role.setUnicodeEmoji('🤖')
   *   .then(updated => console.log(`Set unicode emoji for the role to ${updated.unicodeEmoji}`))
   *   .catch(console.error);
   */
  setUnicodeEmoji(unicodeEmoji, reason) {
    return this.edit({ unicodeEmoji }, reason);
  }

  /**
   * Options used to set the position of a role.
   * @typedef {Object} SetRolePositionOptions
   * @property {boolean} [relative=false] Whether to change the position relative to its current value or not
   * @property {string} [reason] The reason for changing the position
   */

  /**
   * Sets the new position of the role.
   * @param {number} position The new position for the role
   * @param {SetRolePositionOptions} [options] Options for setting the position
   * @returns {Promise<Role>}
   * @example
   * // Set the position of the role
   * role.setPosition(1)
   *   .then(updated => console.log(`Role position: ${updated.position}`))
   *   .catch(console.error);
   */
  setPosition(position, options = {}) {
    return this.guild.roles.setPosition(this, position, options);
  }

  /**
   * Deletes the role.
   * @param {string} [reason] Reason for deleting this role
   * @returns {Promise<Role>}
   * @example
   * // Delete a role
   * role.delete('The role needed to go')
   *   .then(deleted => console.log(`Deleted role ${deleted.name}`))
   *   .catch(console.error);
   */
  async delete(reason) {
    await this.guild.roles.delete(this.id, reason);
    return this;
  }

  /**
   * A link to the role's icon
   * @param {StaticImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL({ format, size } = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.RoleIcon(this.id, this.icon, format, size);
  }

  /**
   * Whether this role equals another role. It compares all properties, so for most operations
   * it is advisable to just compare `role.id === role2.id` as it is much faster and is often
   * what most users need.
   * @param {Role} role Role to compare with
   * @returns {boolean}
   */
  equals(role) {
    return (
      role &&
      this.id === role.id &&
      this.name === role.name &&
      this.color === role.color &&
      this.hoist === role.hoist &&
      this.position === role.position &&
      this.permissions.bitfield === role.permissions.bitfield &&
      this.managed === role.managed &&
      this.icon === role.icon &&
      this.unicodeEmoji === role.unicodeEmoji
    );
  }

  /**
   * When concatenated with a string, this automatically returns the role's mention instead of the Role object.
   * @returns {string}
   * @example
   * // Logs: Role: <@&123456789012345678>
   * console.log(`Role: ${role}`);
   */
  toString() {
    if (this.id === this.guild.id) return '@everyone';
    return `<@&${this.id}>`;
  }

  toJSON() {
    return {
      ...super.toJSON({ createdTimestamp: true }),
      permissions: this.permissions.toJSON(),
    };
  }

  /**
   * Compares the positions of two roles.
   * @param {Role} role1 First role to compare
   * @param {Role} role2 Second role to compare
   * @returns {number} Negative number if the first role's position is lower (second role's is higher),
   * positive number if the first's is higher (second's is lower), 0 if equal
   * @deprecated Use {@link RoleManager#comparePositions} instead.
   */
  static comparePositions(role1, role2) {
    if (!deprecationEmittedForComparePositions) {
      process.emitWarning(
        'The Role.comparePositions method is deprecated. Use RoleManager#comparePositions instead.',
        'DeprecationWarning',
      );

      deprecationEmittedForComparePositions = true;
    }

    return role1.guild.roles.comparePositions(role1, role2);
  }
}

exports.Role = Role;
exports.deletedRoles = deletedRoles;

/**
 * @external APIRole
 * @see {@link https://discord.com/developers/docs/topics/permissions#role-object}
 */
