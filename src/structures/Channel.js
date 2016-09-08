/**
 * Represents any Channel on Discord
 */
class Channel {
  constructor(client, data) {
    /**
     * The client that instantiated the Channel
     * @type {Client}
     */
    this.client = client;
    Object.defineProperty(this, 'client', { enumerable: false, configurable: false });

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
   * The time the channel was created
   * @readonly
   * @type {Date}
   */
  get creationDate() {
    return new Date((this.id / 4194304) + 1420070400000);
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
