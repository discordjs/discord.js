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

    this.deny = data.deny;
    this.allow = data.allow;
  }

  /**
   * Delete this Permission Overwrite.
   * @returns {Promise<PermissionOverwrites>}
   */
  delete() {
    return this.channel.client.rest.methods.deletePermissionOverwrites(this);
  }
}

module.exports = PermissionOverwrites;
