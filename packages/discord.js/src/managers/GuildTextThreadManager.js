'use strict';

const { ChannelType, Routes } = require('discord-api-types/v10');
const ThreadManager = require('./ThreadManager');
const { ErrorCodes, TypeError } = require('../errors');

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
   * @typedef {StartThreadOptions} ThreadCreateOptions
   * @property {MessageResolvable} [startMessage] The message to start a thread from.
   * <warn>If this is defined, then the `type` of thread gets inferred automatically and cannot be changed.</warn>
   * @property {ThreadChannelTypes} [type] The type of thread to create.
   * Defaults to {@link ChannelType.PublicThread} if created in a {@link TextChannel}
   * <warn>When creating threads in a {@link NewsChannel}, this is ignored and is always
   * {@link ChannelType.AnnouncementThread}</warn>
   * @property {boolean} [invitable] Whether non-moderators can add other non-moderators to the thread
   * <info>Can only be set when type will be {@link ChannelType.PrivateThread}</info>
   */

  /**
   * Creates a new thread in the channel.
   * @param {ThreadCreateOptions} [options] Options to create a new thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new public thread
   * channel.threads
   *   .create({
   *     name: 'food-talk',
   *     autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
   *     reason: 'Needed a separate thread for food',
   *   })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   * @example
   * // Create a new private thread
   * channel.threads
   *   .create({
   *      name: 'mod-talk',
   *      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
   *      type: ChannelType.PrivateThread,
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
    let resolvedType =
      this.channel.type === ChannelType.GuildAnnouncement ? ChannelType.AnnouncementThread : ChannelType.PublicThread;
    let startMessageId;
    if (startMessage) {
      startMessageId = this.channel.messages.resolveId(startMessage);
      if (!startMessageId) throw new TypeError(ErrorCodes.InvalidType, 'startMessage', 'MessageResolvable');
    } else if (this.channel.type !== ChannelType.GuildAnnouncement) {
      resolvedType = type ?? resolvedType;
    }

    const data = await this.client.rest.post(Routes.threads(this.channel.id, startMessageId), {
      body: {
        name,
        auto_archive_duration: autoArchiveDuration,
        type: resolvedType,
        invitable: resolvedType === ChannelType.PrivateThread ? invitable : undefined,
        rate_limit_per_user: rateLimitPerUser,
      },
      reason,
    });

    return this.client.actions.ThreadCreate.handle(data).thread;
  }
}

module.exports = GuildTextThreadManager;
