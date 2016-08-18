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
    if (guild) {
      this.guild = guild;
    }

    if (data) {
      this.setup(data);
    }
  }

  setup(data) {
    /**
     * The unique ID of the channel
     * @type {String}
     */
    this.id = data.id;
  }

  /**
   * Deletes the channel
   * @return {Promise<Channel>}
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
