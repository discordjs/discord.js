'use strict';

const { OverwriteType } = require('discord-api-types/v10');
const Base = require('./Base');
const { Role } = require('./Role');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * Represents a permission overwrite for a role or member in a guild channel.
 * @extends {Base}
 */
class PermissionOverwrites extends Base {
  constructor(client, data, channel) {
    super(client);

    /**
     * The GuildChannel this overwrite is for
     * @name PermissionOverwrites#channel
     * @type {GuildChannel}
     * @readonly
     */
    Object.defineProperty(this, 'channel', { value: channel });

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The overwrite's id, either a {@link User} or a {@link Role} id
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('type' in data) {
      /**
       * The type of this overwrite
       * @type {OverwriteType}
       */
      this.type = data.type;
    }

    if ('deny' in data) {
      /**
       * The permissions that are denied for the user or role.
       * @type {Readonly<PermissionsBitField>}
       */
      this.deny = new PermissionsBitField(BigInt(data.deny)).freeze();
    }

    if ('allow' in data) {
      /**
       * The permissions that are allowed for the user or role.
       * @type {Readonly<PermissionsBitField>}
       */
      this.allow = new PermissionsBitField(BigInt(data.allow)).freeze();
    }
  }

  /**
   * Edits this Permission Overwrite.
   * @param {PermissionOverwriteOptions} options The options for the update
   * @param {string} [reason] Reason for creating/editing this overwrite
   * @returns {Promise<PermissionOverwrites>}
   * @example
   * // Update permission overwrites
   * permissionOverwrites.edit({
   *   SendMessages: false
   * })
   *   .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
   *   .catch(console.error);
   */
  async edit(options, reason) {
    await this.channel.permissionOverwrites.upsert(this.id, options, { type: this.type, reason }, this);
    return this;
  }

  /**
   * Deletes this Permission Overwrite.
   * @param {string} [reason] Reason for deleting this overwrite
   * @returns {Promise<PermissionOverwrites>}
   */
  async delete(reason) {
    await this.channel.permissionOverwrites.delete(this.id, reason);
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      allow: this.allow,
      deny: this.deny,
    };
  }

  /**
   * An object mapping permission flags to `true` (enabled), `null` (unset) or `false` (disabled).
   * ```js
   * {
   *  'SendMessages': true,
   *  'EmbedLinks': null,
   *  'AttachFiles': false,
   * }
   * ```
   * @typedef {Object} PermissionOverwriteOptions
   */

  /**
   * @typedef {Object} ResolvedOverwriteOptions
   * @property {PermissionsBitField} allow The allowed permissions
   * @property {PermissionsBitField} deny The denied permissions
   */

  /**
   * Resolves bitfield permissions overwrites from an object.
   * @param {PermissionOverwriteOptions} options The options for the update
   * @param {ResolvedOverwriteOptions} initialPermissions The initial permissions
   * @returns {ResolvedOverwriteOptions}
   */
  static resolveOverwriteOptions(options, { allow, deny } = {}) {
    allow = new PermissionsBitField(allow);
    deny = new PermissionsBitField(deny);

    for (const [perm, value] of Object.entries(options)) {
      if (value === true) {
        allow.add(perm);
        deny.remove(perm);
      } else if (value === false) {
        allow.remove(perm);
        deny.add(perm);
      } else if (value === null) {
        allow.remove(perm);
        deny.remove(perm);
      }
    }

    return { allow, deny };
  }

  /**
   * The raw data for a permission overwrite
   * @typedef {Object} RawOverwriteData
   * @property {Snowflake} id The id of the {@link Role} or {@link User} this overwrite belongs to
   * @property {string} allow The permissions to allow
   * @property {string} deny The permissions to deny
   * @property {number} type The type of this OverwriteData
   */

  /**
   * Data that can be resolved into {@link APIOverwrite}. This can be:
   * * PermissionOverwrites
   * * OverwriteData
   * @typedef {PermissionOverwrites|OverwriteData} OverwriteResolvable
   */

  /**
   * Data that can be used for a permission overwrite
   * @typedef {Object} OverwriteData
   * @property {GuildMemberResolvable|RoleResolvable} id Member or role this overwrite is for
   * @property {PermissionResolvable} [allow] The permissions to allow
   * @property {PermissionResolvable} [deny] The permissions to deny
   * @property {OverwriteType} [type] The type of this OverwriteData (mandatory if `id` is a Snowflake)
   */

  /**
   * Resolves an overwrite into {@link APIOverwrite}.
   * @param {OverwriteResolvable} overwrite The overwrite-like data to resolve
   * @param {Guild} [guild] The guild to resolve from
   * @returns {RawOverwriteData}
   */
  static resolve(overwrite, guild) {
    if (overwrite instanceof this) return overwrite.toJSON();

    const id = guild.roles.resolveId(overwrite.id) ?? guild.client.users.resolveId(overwrite.id);
    if (!id) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'overwrite.id', 'GuildMemberResolvable or RoleResolvable');
    }

    if (overwrite.type !== undefined && (typeof overwrite.type !== 'number' || !(overwrite.type in OverwriteType))) {
      throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'overwrite.type', 'OverwriteType', true);
    }

    let type;
    if (typeof overwrite.id === 'string') {
      if (overwrite.type === undefined) {
        throw new DiscordjsTypeError(ErrorCodes.PermissionOverwritesTypeMandatory);
      }
      type = overwrite.type;
    } else {
      type = overwrite.id instanceof Role ? OverwriteType.Role : OverwriteType.Member;
      if (overwrite.type !== undefined && type !== overwrite.type) {
        throw new DiscordjsTypeError(ErrorCodes.PermissionOverwritesTypeMismatch, OverwriteType[type]);
      }
    }

    return {
      id,
      type,
      allow: PermissionsBitField.resolve(overwrite.allow ?? PermissionsBitField.DefaultBit).toString(),
      deny: PermissionsBitField.resolve(overwrite.deny ?? PermissionsBitField.DefaultBit).toString(),
    };
  }
}

module.exports = PermissionOverwrites;
