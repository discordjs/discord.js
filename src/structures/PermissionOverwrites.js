/**
 * Represents a permission overwrite for a Role or Member in a Guild Channel.
 */
class PermissionOverwrites {
  constructor(guildChannel, data) {
    /**
     * The GuildChannel this overwrite is for
     * @type {GuildChannel}
     */
    this.channel = guildChannel;
    if (data) {
      this.setup(data);
    }
  }

  setup(data) {
    /**
     * The type of this overwrite
     * @type {String}
     */
    this.type = data.type;
    /**
     * The ID of this overwrite, either a User ID or a Role ID
     * @type {String}
     */
    this.id = data.id;
    this.denyData = data.deny;
    this.allowData = data.allow;
  }
}

module.exports = PermissionOverwrites;
