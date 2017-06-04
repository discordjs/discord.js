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
     * The denied permissions.
     * @type {PermissionResolvable}
     */
    this.deny = data.deny;
    
    /**
     * The allowed permissions.
     * @type {PermissionResolvable}
     */
    this.allow = data.allow;
  }

  /**
   * Delete this Permission Overwrite.
   * @param {string} [reason] Reason for deleting this overwrite
   * @returns {Promise<PermissionOverwrites>}
   */
  delete(reason) {
    return this.channel.client.api.channels(this.channel.id).permissions(this.id)
      .delete({ reason })
      .then(() => this);
  }
}

module.exports = PermissionOverwrites;
