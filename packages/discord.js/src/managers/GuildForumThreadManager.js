'use strict';

const { Routes } = require('discord-api-types/v10');
const ThreadManager = require('./ThreadManager');
const { TypeError } = require('../errors');
const MessagePayload = require('../structures/MessagePayload');
const { resolveAutoArchiveMaxLimit } = require('../util/Util');

class GuildForumThreadManager extends ThreadManager {
  /**
   * Options for creating a thread. <warn>Only one of `startMessage` or `type` can be defined.</warn>
   * @typedef {StartThreadOptions} GuildForumThreadCreateOptions
   * @property {MessageOptions|MessagePayload} message The message associated with the thread post
   */

  /**
   * Creates a new thread in the channel.
   * @param {GuildForumThreadCreateOptions} [options] Options to create a new thread
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
   *      type: ChannelType.GuildPrivateThread,
   *      reason: 'Needed a separate thread for moderation',
   *    })
   *   .then(threadChannel => console.log(threadChannel))
   *   .catch(console.error);
   */
  async create({
    name,
    autoArchiveDuration = this.channel.defaultAutoArchiveDuration,
    message,
    reason,
    rateLimitPerUser,
  } = {}) {
    if (!message) {
      throw new TypeError('GUILD_FORUM_MESSAGE_REQUIRED');
    }

    const messagePayload =
      message instanceof MessagePayload ? message.resolveBody() : MessagePayload.create(this, message);

    const { body, files } = messagePayload.resolveFiles();

    if (autoArchiveDuration === 'MAX') autoArchiveDuration = resolveAutoArchiveMaxLimit(this.channel.guild);

    const data = await this.client.rest.post(Routes.threads(this.channel.id), {
      body: {
        name,
        auto_archive_duration: autoArchiveDuration,
        rate_limit_per_user: rateLimitPerUser,
        ...body,
      },
      files,
      reason,
    });

    // TODO: Posts will most likely need to be serialized differently than regular threads.
    return this.client.actions.ThreadCreate.handle(data).thread;
  }
}

module.exports = GuildForumThreadManager;
