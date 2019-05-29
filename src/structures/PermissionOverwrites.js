const Permissions = require('../util/Permissions');

/**
 * Represents a permission overwrite for a role or member in a guild channel.
 */
class PermissionOverwrites {
  constructor(guildChannel, data) {
    /**
     * The GuildChannel this overwrite is for
     * @name PermissionOverwrites#channel
     * @type {GuildChannel}
     * @readonly
     */
    Object.defineProperty(this, 'channel', { value: guildChannel });

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this overwrite, either a user ID or a role ID
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of this overwrite
     * @type {string}
     */
    this.type = data.type;

    /**
     * The permissions that are denied for the user or role as a bitfield.
     * @type {number}
     */
    this.deny = data.deny;

    /**
     * The permissions that are allowed for the user or role as a bitfield.
     * @type {number}
     */
    this.allow = data.allow;

    /**
     * The permissions that are denied for the user or role.
     * @type {Permissions}
     * @deprecated
     */
    this.denied = new Permissions(data.deny).freeze();

    /**
     * The permissions that are allowed for the user or role.
     * @type {Permissions}
     * @deprecated
     */
    this.allowed = new Permissions(data.allow).freeze();
  }

  /**
   * Delete this Permission Overwrite.
   * @param {string} [reason] Reason for deleting this overwrite
   * @returns {Promise<PermissionOverwrites>}
   */
  delete(reason) {
    return this.channel.client.rest.methods.deletePermissionOverwrites(this, reason);
  }
}

module.exports = PermissionOverwrites;
