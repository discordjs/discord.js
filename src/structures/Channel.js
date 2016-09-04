/**
 * Represents any Channel on Discord
 */
class Channel {
  constructor(client, data, guild) {
    /**
     * The client that instantiated the Channel
     * @type {Client}
     */
    this.client = client;
    this.typingMap = {};
    this.typingTimeouts = [];
    if (guild) this.guild = guild;
    /**
     * The type of the channel, either:
     * * `dm` - a DM channel
     * * `group` - a Group DM channel
     * * `text` - a guild text channel
     * * `voice` - a guild voice channel
     * @type {string}
     */
    this.type = null;
    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The unique ID of the channel
     * @type {string}
     */
    this.id = data.id;
  }

  /**
   * Deletes the channel
   * @returns {Promise<Channel>}
   * @example
   * // delete the channel
   * channel.delete()
   *  .then() // success
   *  .catch(console.log); // log error
   */
  delete() {
    return this.client.rest.methods.deleteChannel(this);
  }
}

module.exports = Channel;
