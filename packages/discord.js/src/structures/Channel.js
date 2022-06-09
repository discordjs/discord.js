'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Routes } = require('discord-api-types/v10');
const Base = require('./Base');

/**
 * Represents any channel on Discord.
 * @extends {Base}
 * @abstract
 */
class Channel extends Base {
  constructor(client, data, immediatePatch = true) {
    super(client);

    /**
     * The type of the channel
     * @type {ChannelType}
     */
    this.type = data.type;

    if (data && immediatePatch) this._patch(data);
  }

  _patch(data) {
    /**
     * The channel's id
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
    return DiscordSnowflake.timestampFrom(this.id);
  }

  /**
   * The time the channel was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The URL to the channel
   * @type {string}
   * @readonly
   */
  get url() {
    return `https://discord.com/channels/${this.isDMBased() ? '@me' : this.guildId}/${this.id}`;
  }

  /**
   * Whether this Channel is a partial
   * <info>This is always false outside of DM channels.</info>
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return false;
  }

  /**
   * When concatenated with a string, this automatically returns the channel's mention instead of the Channel object.
   * @returns {string}
   * @example
   * // Logs: Hello from <#123456789012345678>!
   * console.log(`Hello from ${channel}!`);
   */
  toString() {
    return `<#${this.id}>`;
  }

  /**
   * Deletes this channel.
   * @returns {Promise<Channel>}
   * @example
   * // Delete the channel
   * channel.delete()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async delete() {
    await this.client.rest.delete(Routes.channel(this.id));
    return this;
  }

  /**
   * Fetches this channel.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<Channel>}
   */
  fetch(force = true) {
    return this.client.channels.fetch(this.id, { force });
  }

  toJSON(...props) {
    return super.toJSON({ createdTimestamp: true }, ...props);
  }
}

exports.Channel = Channel;

/**
 * @external APIChannel
 * @see {@link https://discord.com/developers/docs/resources/channel#channel-object}
 */
