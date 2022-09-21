'use strict';

const ThreadManager = require('./ThreadManager');
const { TypeError } = require('../errors');
const { ChannelTypes } = require('../util/Constants');
const { resolveAutoArchiveMaxLimit } = require('../util/Util');

/**
 * Manages API methods for {@link ThreadChannel} objects and stores their cache.
 * @extends {ThreadManager}
 */
class GuildTextThreadManager extends ThreadManager {
  /**
   * The channel this Manager belongs to
   * @name GuildTextThreadManager#channel
   * @type {TextChannel|NewsChannel}
   */

  /**
   * Options for creating a thread. <warn>Only one of `startMessage` or `type` can be defined.</warn>
   * @typedef {StartThreadOptions} GuildTextThreadCreateOptions
   * @property {MessageResolvable} [startMessage] The message to start a thread from. <warn>If this is defined then type
   * of thread gets automatically defined and cannot be changed. The provided `type` field will be ignored</warn>
   * @property {ThreadChannelTypes|number} [type] The type of thread to create. Defaults to `GUILD_PUBLIC_THREAD` if
   * created in a {@link TextChannel} <warn>When creating threads in a {@link NewsChannel} this is ignored and is always
   * `GUILD_NEWS_THREAD`</warn>
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to the thread
   * <info>Can only be set when type will be `GUILD_PRIVATE_THREAD`</info>
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the new channel in seconds
   */

  /**
   * Creates a new thread in the channel.
   * @param {GuildTextThreadCreateOptions} [options] Options to create a new thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new public thread
   * channel.threads
   *   .create({
   *     name: 'food-talk',
   *     autoArchiveDuration: 60,
   *     reason: 'Needed a separate thread for food',
   *   })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   * @example
   * // Create a new private thread
   * channel.threads
   *   .create({
   *      name: 'mod-talk',
   *      autoArchiveDuration: 60,
   *      type: 'GUILD_PRIVATE_THREAD',
   *      reason: 'Needed a separate thread for moderation',
   *    })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   */
  async create({
    name,
    autoArchiveDuration = this.channel.defaultAutoArchiveDuration,
    startMessage,
    type,
    invitable,
    reason,
    rateLimitPerUser,
  } = {}) {
    let path = this.client.api.channels(this.channel.id);
    if (type && typeof type !== 'string' && typeof type !== 'number') {
      throw new TypeError('INVALID_TYPE', 'type', 'ThreadChannelType or Number');
    }
    let resolvedType =
      this.channel.type === 'GUILD_NEWS' ? ChannelTypes.GUILD_NEWS_THREAD : ChannelTypes.GUILD_PUBLIC_THREAD;
    if (startMessage) {
      const startMessageId = this.channel.messages.resolveId(startMessage);
      if (!startMessageId) throw new TypeError('INVALID_TYPE', 'startMessage', 'MessageResolvable');
      path = path.messages(startMessageId);
    } else if (this.channel.type !== 'GUILD_NEWS') {
      resolvedType = typeof type === 'string' ? ChannelTypes[type] : type ?? resolvedType;
    }

    if (autoArchiveDuration === 'MAX') autoArchiveDuration = resolveAutoArchiveMaxLimit(this.channel.guild);

    const data = await path.threads.post({
      data: {
        name,
        auto_archive_duration: autoArchiveDuration,
        type: resolvedType,
        invitable: resolvedType === ChannelTypes.GUILD_PRIVATE_THREAD ? invitable : undefined,
        rate_limit_per_user: rateLimitPerUser,
      },
      reason,
    });

    return this.client.actions.ThreadCreate.handle(data).thread;
  }
}

module.exports = GuildTextThreadManager;
