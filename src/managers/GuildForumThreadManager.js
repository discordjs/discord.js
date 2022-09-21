'use strict';

const ThreadManager = require('./ThreadManager');
const { TypeError } = require('../errors');
const MessagePayload = require('../structures/MessagePayload');
const { resolveAutoArchiveMaxLimit } = require('../util/Util');

/**
 * Manages API methods for threads in forum channels and stores their cache.
 * @extends {ThreadManager}
 */
class GuildForumThreadManager extends ThreadManager {
  /**
   * The channel this Manager belongs to
   * @name GuildForumThreadManager#channel
   * @type {ForumChannel}
   */

  /**
   * @typedef {BaseMessageOptions} GuildForumThreadCreateOptions
   * @property {stickers} [stickers] The stickers to send with the message
   * @property {BitFieldResolvable} [flags] The flags to send with the message
   */

  /**
   * Options for creating a thread.
   * @typedef {StartThreadOptions} GuildForumThreadCreateOptions
   * @property {GuildForumThreadCreateOptions|MessagePayload} message The message associated with the thread post
   * @property {Snowflake[]} [appliedTags] The tags to apply to the thread
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
    let path = this.client.api.channels(this.channel.id);

    if (!message) {
      throw new TypeError('GUILD_FORUM_MESSAGE_REQUIRED');
    }

    let messagePayload;

    if (message instanceof MessagePayload) {
      messagePayload = message.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, message).resolveData();
    }

    const { data: body, files } = await messagePayload.resolveFiles();

    if (autoArchiveDuration === 'MAX') autoArchiveDuration = resolveAutoArchiveMaxLimit(this.channel.guild);

    const data = await path.threads.post({
      data: {
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
