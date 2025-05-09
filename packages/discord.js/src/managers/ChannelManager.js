'use strict';

const process = require('node:process');
const { lazy } = require('@discordjs/util');
const { Routes } = require('discord-api-types/v10');
const { CachedManager } = require('./CachedManager.js');
const { BaseChannel } = require('../structures/BaseChannel.js');
const { MessagePayload } = require('../structures/MessagePayload.js');
const { createChannel } = require('../util/Channels.js');
const { ThreadChannelTypes } = require('../util/Constants.js');
const { Events } = require('../util/Events.js');

const getMessage = lazy(() => require('../structures/Message.js').Message);

let cacheWarningEmitted = false;

/**
 * A manager of channels belonging to a client
 * @extends {CachedManager}
 */
class ChannelManager extends CachedManager {
  constructor(client, iterable) {
    super(client, BaseChannel, iterable);
    const defaultCaching =
      this._cache.constructor.name === 'Collection' ||
      this._cache.maxSize === undefined ||
      this._cache.maxSize === Infinity;
    if (!cacheWarningEmitted && !defaultCaching) {
      cacheWarningEmitted = true;
      process.emitWarning(
        `Overriding the cache handling for ${this.constructor.name} is unsupported and breaks functionality.`,
        'UnsupportedCacheOverwriteWarning',
      );
    }
  }

  /**
   * The cache of Channels
   * @type {Collection<Snowflake, BaseChannel>}
   * @name ChannelManager#cache
   */

  _add(data, guild, { cache = true, allowUnknownGuild = false } = {}) {
    const existing = this.cache.get(data.id);
    if (existing) {
      if (cache) existing._patch(data);
      guild?.channels?._add(existing);
      if (ThreadChannelTypes.includes(existing.type)) {
        existing.parent?.threads?._add(existing);
      }
      return existing;
    }

    const channel = createChannel(this.client, data, guild, { allowUnknownGuild });

    if (!channel) {
      this.client.emit(Events.Debug, `Failed to find guild, or unknown type for channel ${data.id} ${data.type}`);
      return null;
    }

    if (cache && !allowUnknownGuild) this.cache.set(channel.id, channel);

    return channel;
  }

  _remove(id) {
    const channel = this.cache.get(id);
    channel?.guild?.channels.cache.delete(id);

    for (const [code, invite] of channel?.guild?.invites.cache ?? []) {
      if (invite.channelId === id) channel.guild.invites.cache.delete(code);
    }

    channel?.parent?.threads?.cache.delete(id);
    this.cache.delete(id);

    if (channel?.threads) {
      for (const threadId of channel.threads.cache.keys()) {
        this.cache.delete(threadId);
        channel.guild?.channels.cache.delete(threadId);
      }
    }
  }

  /**
   * Data that can be resolved to give a Channel object. This can be:
   * * A Channel object
   * * A Snowflake
   * @typedef {BaseChannel|Snowflake} ChannelResolvable
   */

  /**
   * Resolves a ChannelResolvable to a Channel object.
   * @method resolve
   * @memberof ChannelManager
   * @instance
   * @param {ChannelResolvable} channel The channel resolvable to resolve
   * @returns {?BaseChannel}
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
   * Options for fetching a channel from Discord
   * @typedef {BaseFetchOptions} FetchChannelOptions
   * @property {boolean} [allowUnknownGuild=false] Allows the channel to be returned even if the guild is not in cache,
   * it will not be cached. <warn>Many of the properties and methods on the returned channel will throw errors</warn>
   */

  /**
   * Obtains a channel from Discord, or the channel cache if it's already available.
   * @param {Snowflake} id The channel's id
   * @param {FetchChannelOptions} [options] Additional options for this fetch
   * @returns {Promise<?BaseChannel>}
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

    const data = await this.client.rest.get(Routes.channel(id));
    return this._add(data, null, { cache, allowUnknownGuild });
  }

  /**
   * Creates a message in a channel.
   * @param {TextChannelResolvable} channel The channel to send the message to
   * @param {string|MessagePayload|MessageCreateOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Send a basic message
   * client.channels.createMessage(channel, 'hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   * @example
   * // Send a remote file
   * client.channels.createMessage(channel, {
   *   files: ['https://github.com/discordjs.png']
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Send a local file
   * client.channels.createMessage(channel, {
   *   files: [{
   *     attachment: 'entire/path/to/file.jpg',
   *     name: 'file.jpg',
   *     description: 'A description of the file'
   *   }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async createMessage(channel, options) {
    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveBody();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveBody();
    }

    const resolvedChannelId = this.resolveId(channel);
    const resolvedChannel = this.resolve(channel);
    const { body, files } = await messagePayload.resolveFiles();
    const data = await this.client.rest.post(Routes.channelMessages(resolvedChannelId), { body, files });

    return resolvedChannel?.messages._add(data) ?? new (getMessage())(this.client, data);
  }
}

exports.ChannelManager = ChannelManager;
