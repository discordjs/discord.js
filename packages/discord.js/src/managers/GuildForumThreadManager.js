'use strict';

const { Routes } = require('discord-api-types/v10');
const { DiscordjsTypeError, ErrorCodes } = require('../errors/index.js');
const { MessagePayload } = require('../structures/MessagePayload.js');
const { ThreadManager } = require('./ThreadManager.js');

/**
 * Manages API methods for threads in forum channels and stores their cache.
 *
 * @extends {ThreadManager}
 */
class GuildForumThreadManager extends ThreadManager {
  /**
   * The channel this Manager belongs to
   *
   * @name GuildForumThreadManager#channel
   * @type {ForumChannel}
   */

  /**
   * @typedef {BaseMessageOptions} GuildForumThreadMessageCreateOptions
   * @property {StickerResolvable} [stickers] The stickers to send with the message
   * @property {BitFieldResolvable} [flags] The flags to send with the message
   * <info>Only `MessageFlags.SuppressEmbeds` and `MessageFlags.SuppressNotifications` can be set.</info>
   */

  /**
   * Options for creating a thread.
   *
   * @typedef {StartThreadOptions} GuildForumThreadCreateOptions
   * @property {GuildForumThreadMessageCreateOptions|MessagePayload} message The message associated with the thread post
   * @property {Snowflake[]} [appliedTags] The tags to apply to the thread
   */

  /**
   * Creates a new thread in the channel.
   *
   * @param {GuildForumThreadCreateOptions} [options] Options to create a new thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new forum post
   * forum.threads
   *   .create({
   *     name: 'Food Talk',
   *     autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
   *     message: {
   *      content: 'Discuss your favorite food!',
   *     },
   *     reason: 'Needed a separate thread for food',
   *   })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   */
  async create({
    name,
    autoArchiveDuration = this.channel.defaultAutoArchiveDuration,
    message,
    reason,
    rateLimitPerUser,
    appliedTags,
  } = {}) {
    if (!message) {
      throw new DiscordjsTypeError(ErrorCodes.GuildForumMessageRequired);
    }

    const { body, files } = await (message instanceof MessagePayload ? message : MessagePayload.create(this, message))
      .resolveBody()
      .resolveFiles();

    const data = await this.client.rest.post(Routes.threads(this.channel.id), {
      body: {
        name,
        auto_archive_duration: autoArchiveDuration,
        rate_limit_per_user: rateLimitPerUser,
        applied_tags: appliedTags,
        message: body,
      },
      files,
      reason,
    });

    return this.client.actions.ThreadCreate.handle(data).thread;
  }
}

exports.GuildForumThreadManager = GuildForumThreadManager;
