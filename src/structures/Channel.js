/**
 * Represents any channel on Discord
 */
class Channel {
  constructor(client, data) {
    /**
     * The client that instantiated the Channel
     * @name Channel#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

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
   * The timestamp the channel was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return (this.id / 4194304) + 1420070400000;
  }

  /**
   * The time the channel was created
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * Deletes the channel
   * @returns {Promise<Channel>}
   * @example
   * // delete the channel
   * channel.delete()
   *  .then() // success
   *  .catch(console.error); // log error
   */
  delete() {
    return this.client.rest.methods.deleteChannel(this);
  }
}

module.exports = Channel;
