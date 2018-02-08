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

    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The ID of this overwrite, either a user ID or a role ID
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of a permission overwrite. It can be one of:
     * * member
     * * role
     * @typedef {string} OverwriteType
     */

    /**
     * The type of this overwrite
     * @type {OverwriteType}
     */
    this.type = data.type;

    /**
     * The permissions that are denied for the user or role.
     * @type {Permissions}
     */
    this.denied = new Permissions(data.deny).freeze();

    /**
     * The permissions that are allowed for the user or role.
     * @type {Permissions}
     */
    this.allowed = new Permissions(data.allow).freeze();
  }

  /**
   * Deletes this Permission Overwrite.
   * @param {string} [reason] Reason for deleting this overwrite
   * @returns {Promise<PermissionOverwrites>}
   */
  delete(reason) {
    return this.channel.client.api.channels[this.channel.id].permissions[this.id]
      .delete({ reason })
      .then(() => this);
  }
}

module.exports = PermissionOverwrites;
