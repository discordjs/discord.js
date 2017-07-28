const Snowflake = require('../util/Snowflake');
const Constants = require('../util/Constants');

/**
 * Represents any channel on Discord.
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
     * * `category` - a guild category channel
     * * `generic` - a generic guild channel, unknown type
     * @type {string}
     */
    this.type = Object.keys(Constants.ChannelTypes)[data.type] || 'generic';

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The unique ID of the channel
     * @type {Snowflake}
     */
    this.id = data.id;
  }

  /**
   * The timestamp the channel was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
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
   * Deletes this channel.
   * @returns {Promise<Channel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *  .then() // Success
   *  .catch(console.error); // Log error
   */
  delete() {
    return this.client.api.channels(this.id).delete().then(() => this);
  }
}

module.exports = Channel;
