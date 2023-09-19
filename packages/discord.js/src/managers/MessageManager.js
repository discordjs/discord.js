'use strict';

const { Collection } = require('@discordjs/collection');
const { makeURLSearchParams } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const CachedManager = require('./CachedManager');
const { DiscordjsTypeError, ErrorCodes } = require('../errors');
const { Message } = require('../structures/Message');
const MessagePayload = require('../structures/MessagePayload');
const { MakeCacheOverrideSymbol } = require('../util/Symbols');
const { resolvePartialEmoji } = require('../util/Util');

/**
 * Manages API methods for Messages and holds their cache.
 * @extends {CachedManager}
 * @abstract
 */
class MessageManager extends CachedManager {
  static [MakeCacheOverrideSymbol] = MessageManager;

  constructor(channel, iterable) {
    super(channel.client, Message, iterable);

    /**
     * The channel that the messages belong to
     * @type {TextBasedChannels}
     */
    this.channel = channel;
  }

  /**
   * The cache of Messages
   * @type {Collection<Snowflake, Message>}
   * @name MessageManager#cache
   */

  _add(data, cache) {
    return super._add(data, cache);
  }

  /**
   * Data that can be resolved to a Message object. This can be:
   * * A Message
   * * A Snowflake
   * @typedef {Message|Snowflake} MessageResolvable
   */

  /**
   * Options used to fetch a message.
   * @typedef {BaseFetchOptions} FetchMessageOptions
   * @property {MessageResolvable} message The message to fetch
   */

  /**
   * Options used to fetch multiple messages.
   * <info>The `before`, `after`, and `around` parameters are mutually exclusive.</info>
   * @typedef {Object} FetchMessagesOptions
   * @property {number} [limit] The maximum number of messages to return
   * @property {Snowflake} [before] Consider only messages before this id
   * @property {Snowflake} [after] Consider only messages after this id
   * @property {Snowflake} [around] Consider only messages around this id
   * @property {boolean} [cache] Whether to cache the fetched messages
   */

  /**
   * Fetches message(s) from a channel.
   * <info>The returned Collection does not contain reaction users of the messages if they were not cached.
   * Those need to be fetched separately in such a case.</info>
   * @param {MessageResolvable|FetchMessageOptions|FetchMessagesOptions} [options] Options for fetching message(s)
   * @returns {Promise<Message|Collection<Snowflake, Message>>}
   * @example
   * // Fetch a message
   * channel.messages.fetch('99539446449315840')
   *   .then(message => console.log(message.content))
   *   .catch(console.error);
   * @example
   * // Fetch a maximum of 10 messages without caching
   * channel.messages.fetch({ limit: 10, cache: false })
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   * @example
   * // Fetch a maximum of 10 messages without caching around a message id
   * channel.messages.fetch({ limit: 10, cache: false, around: '99539446449315840' })
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   * @example
   * // Fetch messages and filter by a user id
   * channel.messages.fetch()
   *   .then(messages => console.log(`${messages.filter(m => m.author.id === '84484653687267328').size} messages`))
   *   .catch(console.error);
   */
  fetch(options) {
    if (!options) return this._fetchMany();
    const { message, cache, force } = options;
    const resolvedMessage = this.resolveId(message ?? options);
    if (resolvedMessage) return this._fetchSingle({ message: resolvedMessage, cache, force });
    return this._fetchMany(options);
  }

  async _fetchSingle({ message, cache, force = false }) {
    if (!force) {
      const existing = this.cache.get(message);
      if (existing && !existing.partial) return existing;
    }

    const data = await this.client.rest.get(Routes.channelMessage(this.channel.id, message));
    return this._add(data, cache);
  }

  async _fetchMany(options = {}) {
    const data = await this.client.rest.get(Routes.channelMessages(this.channel.id), {
      query: makeURLSearchParams(options),
    });

    return data.reduce((_data, message) => _data.set(message.id, this._add(message, options.cache)), new Collection());
  }

  /**
   * Fetches the pinned messages of this channel and returns a collection of them.
   * <info>The returned Collection does not contain any reaction data of the messages.
   * Those need to be fetched separately.</info>
   * @param {boolean} [cache=true] Whether to cache the message(s)
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Get pinned messages
   * channel.messages.fetchPinned()
   *   .then(messages => console.log(`Received ${messages.size} messages`))
   *   .catch(console.error);
   */
  async fetchPinned(cache = true) {
    const data = await this.client.rest.get(Routes.channelPins(this.channel.id));
    const messages = new Collection();
    for (const message of data) messages.set(message.id, this._add(message, cache));
    return messages;
  }

  /**
   * Resolves a {@link MessageResolvable} to a {@link Message} object.
   * @method resolve
   * @memberof MessageManager
   * @instance
   * @param {MessageResolvable} message The message resolvable to resolve
   * @returns {?Message}
   */

  /**
   * Resolves a {@link MessageResolvable} to a {@link Message} id.
   * @method resolveId
   * @memberof MessageManager
   * @instance
   * @param {MessageResolvable} message The message resolvable to resolve
   * @returns {?Snowflake}
   */

  /**
   * Options that can be passed to edit a message.
   * @typedef {BaseMessageOptions} MessageEditOptions
   * @property {AttachmentPayload[]} [attachments] An array of attachments to keep,
   * all attachments will be kept if omitted
   * @property {MessageFlags} [flags] Which flags to set for the message
   * <info>Only the {@link MessageFlags.SuppressEmbeds} flag can be modified.</info>
   */

  /**
   * Edits a message, even if it's not cached.
   * @param {MessageResolvable} message The message to edit
   * @param {string|MessageEditOptions|MessagePayload} options The options to edit the message
   * @returns {Promise<Message>}
   */
  async edit(message, options) {
    const messageId = this.resolveId(message);
    if (!messageId) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    const { body, files } = await (options instanceof MessagePayload
      ? options
      : MessagePayload.create(message instanceof Message ? message : this, options)
    )
      .resolveBody()
      .resolveFiles();
    const d = await this.client.rest.patch(Routes.channelMessage(this.channel.id, messageId), { body, files });

    const existing = this.cache.get(messageId);
    if (existing) {
      const clone = existing._clone();
      clone._patch(d);
      return clone;
    }
    return this._add(d);
  }

  /**
   * Publishes a message in an announcement channel to all channels following it, even if it's not cached.
   * @param {MessageResolvable} message The message to publish
   * @returns {Promise<Message>}
   */
  async crosspost(message) {
    message = this.resolveId(message);
    if (!message) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    const data = await this.client.rest.post(Routes.channelMessageCrosspost(this.channel.id, message));
    return this.cache.get(data.id) ?? this._add(data);
  }

  /**
   * Pins a message to the channel's pinned messages, even if it's not cached.
   * @param {MessageResolvable} message The message to pin
   * @param {string} [reason] Reason for pinning
   * @returns {Promise<void>}
   */
  async pin(message, reason) {
    message = this.resolveId(message);
    if (!message) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    await this.client.rest.put(Routes.channelPin(this.channel.id, message), { reason });
  }

  /**
   * Unpins a message from the channel's pinned messages, even if it's not cached.
   * @param {MessageResolvable} message The message to unpin
   * @param {string} [reason] Reason for unpinning
   * @returns {Promise<void>}
   */
  async unpin(message, reason) {
    message = this.resolveId(message);
    if (!message) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    await this.client.rest.delete(Routes.channelPin(this.channel.id, message), { reason });
  }

  /**
   * Adds a reaction to a message, even if it's not cached.
   * @param {MessageResolvable} message The message to react to
   * @param {EmojiIdentifierResolvable} emoji The emoji to react with
   * @returns {Promise<void>}
   */
  async react(message, emoji) {
    message = this.resolveId(message);
    if (!message) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    emoji = resolvePartialEmoji(emoji);
    if (!emoji) throw new DiscordjsTypeError(ErrorCodes.EmojiType, 'emoji', 'EmojiIdentifierResolvable');

    const emojiId = emoji.id
      ? `${emoji.animated ? 'a:' : ''}${emoji.name}:${emoji.id}`
      : encodeURIComponent(emoji.name);

    await this.client.rest.put(Routes.channelMessageOwnReaction(this.channel.id, message, emojiId));
  }

  /**
   * Deletes a message, even if it's not cached.
   * @param {MessageResolvable} message The message to delete
   * @returns {Promise<void>}
   */
  async delete(message) {
    message = this.resolveId(message);
    if (!message) throw new DiscordjsTypeError(ErrorCodes.InvalidType, 'message', 'MessageResolvable');

    await this.client.rest.delete(Routes.channelMessage(this.channel.id, message));
  }
}

module.exports = MessageManager;
