'use strict';

const { Routes } = require('discord-api-types/v10');
const ThreadManager = require('./ThreadManager');
const { TypeError, ErrorCodes } = require('../errors');
const MessagePayload = require('../structures/MessagePayload');
const { resolveAutoArchiveMaxLimit } = require('../util/Util');

/**
 * Manages API methods for threads in forum channels and stores their cache.
 * @extends {ThreadManager}
 */
class GuildForumThreadManager extends ThreadManager {
  /**
   * @typedef {BaseMessageOptions} GuildForumThreadCreateOptions
   * @property {stickers} [stickers] The stickers to send with the message
   * @property {BitFieldResolvable} [flags] The flags to send with the message
   */

  /**
   * Options for creating a thread. <warn>Only one of `startMessage` or `type` can be defined.</warn>
   * @typedef {StartThreadOptions} GuildForumThreadCreateOptions
   * @property {GuildForumThreadCreateOptions|MessagePayload} message The message associated with the thread post
   * @property {GuildForumTag[]} [appliedTags] The tags to apply to the thread
   */

  /**
   * Creates a new thread in the channel.
   * @param {GuildForumThreadCreateOptions} [options] Options to create a new thread
   * @returns {Promise<ThreadChannel>}
   * @example
   * // Create a new forum post
   * forum.threads
   *   .create({
   *     name: 'Food Talk',
   *     autoArchiveDuration: 60,
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
      throw new TypeError(ErrorCodes.GuildForumMessageRequired);
    }

    const messagePayload =
      message instanceof MessagePayload ? message.resolveBody() : MessagePayload.create(this, message).resolveBody();

    const { body, files } = await messagePayload.resolveFiles();
    if (autoArchiveDuration === 'MAX') autoArchiveDuration = resolveAutoArchiveMaxLimit(this.channel.guild);

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

module.exports = GuildForumThreadManager;
