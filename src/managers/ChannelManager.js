'use strict';

const CachedManager = require('./CachedManager');
const Channel = require('../structures/Channel');
const { Events, ThreadChannelTypes } = require('../util/Constants');

/**
 * A manager of channels belonging to a client
 * @extends {CachedManager}
 */
class ChannelManager extends CachedManager {
  constructor(client, iterable) {
    super(client, Channel, iterable);
  }

  /**
   * The cache of Channels
   * @type {Collection<Snowflake, Channel>}
   * @name ChannelManager#cache
   */

  _add(data, guild, { cache = true, allowUnknownGuild = false, fromInteraction = false } = {}) {
    const existing = this.cache.get(data.id);
    if (existing) {
      if (cache) existing._patch(data, fromInteraction);
      guild?.channels?._add(existing);
      if (ThreadChannelTypes.includes(existing.type)) {
        existing.parent?.threads?._add(existing);
      }
      return existing;
    }

    const channel = Channel.create(this.client, data, guild, { allowUnknownGuild, fromInteraction });

    if (!channel) {
      this.client.emit(Events.DEBUG, `Failed to find guild, or unknown type for channel ${data.id} ${data.type}`);
      return null;
    }

    if (cache && !allowUnknownGuild) this.cache.set(channel.id, channel);

    return channel;
  }

  _remove(id) {
    const channel = this.cache.get(id);
    channel?.guild?.channels.cache.delete(id);
    channel?.parent?.threads?.cache.delete(id);
    this.cache.delete(id);
  }

  /**
   * Data that can be resolved to give a Channel object. This can be:
   * * A Channel object
   * * A Snowflake
   * @typedef {Channel|Snowflake} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object.
   * @method resolve
   * @memberof ChannelManager
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Channel}
   */

  /**
   * Resolves a ChannelResolvable to a channel id string.
   * @method resolveId
   * @memberof ChannelManager
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Options for fetching a channel from discord
   * @typedef {BaseFetchOptions} FetchChannelOptions
   * @property {boolean} [allowUnknownGuild=false] Allows the channel to be returned even if the guild is not in cache,
   * it will not be cached. <warn>Many of the properties and methods on the returned channel will throw errors</warn>
   */

  /**
   * Obtains a channel from Discord, or the channel cache if it's already available.
   * @param {Snowflake} id The channel's id
   * @param {FetchChannelOptions} [options] Additional options for this fetch
   * @returns {Promise<?Channel>}
   * @example
   * // Fetch a channel by its id
   * client.channels.fetch('222109930545610754')
   *   .then(channel => console.log(channel.name))
   *   .catch(console.error);
   */
  async fetch(id, { allowUnknownGuild = false, cache = true, force = false } = {}) {
    if (!force) {
      const existing = this.cache.get(id);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.api.channels(id).get();
    return this._add(data, null, { cache, allowUnknownGuild });
  }
}

module.exports = ChannelManager;
