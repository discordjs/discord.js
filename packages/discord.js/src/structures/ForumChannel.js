'use strict';

const GuildChannel = require('./GuildChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const GuildForumThreadManager = require('../managers/GuildForumThreadManager');
const { transformAPIGuildForumTag, transformAPIGuildDefaultReaction } = require('../util/Channels');

/**
 * @typedef {Object} GuildForumTagEmoji
 * @property {?Snowflake} id The id of a guild's custom emoji
 * @property {?string} name The unicode character of the emoji
 */

/**
 * @typedef {Object} GuildForumTag
 * @property {Snowflake} id The id of the tag
 * @property {string} name The name of the tag
 * @property {boolean} moderated Whether this tag can only be added to or removed from threads
 * by a member with the `ManageThreads` permission
 * @property {?GuildForumTagEmoji} emoji The emoji of this tag
 */

/**
 * @typedef {Object} GuildForumTagData
 * @property {Snowflake} [id] The id of the tag
 * @property {string} name The name of the tag
 * @property {boolean} [moderated] Whether this tag can only be added to or removed from threads
 * by a member with the `ManageThreads` permission
 * @property {?GuildForumTagEmoji} [emoji] The emoji of this tag
 */

/**
 * @typedef {Object} DefaultReactionEmoji
 * @property {?Snowflake} id The id of a guild's custom emoji
 * @property {?string} name The unicode character of the emoji
 */

/**
 * Represents a channel that only contains threads
 * @extends {GuildChannel}
 */
class ForumChannel extends GuildChannel {
  constructor(guild, data, client) {
    super(guild, data, client, false);

    /**
     * A manager of the threads belonging to this channel
     * @type {GuildForumThreadManager}
     */
    this.threads = new GuildForumThreadManager(this);

    this._patch(data);
  }

  _patch(data) {
    super._patch(data);
    if ('available_tags' in data) {
      /**
       * The set of tags that can be used in this channel.
       * @type {GuildForumTag[]}
       */
      this.availableTags = data.available_tags.map(tag => transformAPIGuildForumTag(tag));
    } else {
      this.availableTags ??= [];
    }

    if ('default_reaction_emoji' in data) {
      /**
       * The emoji to show in the add reaction button on a thread in a guild forum channel
       * @type {?DefaultReactionEmoji}
       */
      this.defaultReactionEmoji = data.default_reaction_emoji
        ? transformAPIGuildDefaultReaction(data.default_reaction_emoji)
        : null;
    } else {
      this.defaultReactionEmoji ??= null;
    }

    if ('default_thread_rate_limit_per_user' in data) {
      /**
       * The initial rate limit per user (slowmode) to set on newly created threads in a channel.
       * @type {?number}
       */
      this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
    } else {
      this.defaultThreadRateLimitPerUser ??= null;
    }

    if ('rate_limit_per_user' in data) {
      /**
       * The rate limit per user (slowmode) for this channel.
       * @type {?number}
       */
      this.rateLimitPerUser = data.rate_limit_per_user;
    } else {
      this.rateLimitPerUser ??= null;
    }

    if ('default_auto_archive_duration' in data) {
      /**
       * The default auto archive duration for newly created threads in this channel.
       * @type {?ThreadAutoArchiveDuration}
       */
      this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
    } else {
      this.defaultAutoArchiveDuration ??= null;
    }

    if ('nsfw' in data) {
      /**
       * If this channel is considered NSFW.
       * @type {boolean}
       */
      this.nsfw = data.nsfw;
    } else {
      this.nsfw ??= false;
    }

    if ('topic' in data) {
      /**
       * The topic of this channel.
       * @type {?string}
       */
      this.topic = data.topic;
    }
  }

  /**
   * Sets the available tags for this forum channel
   * @param {GuildForumTagData[]} availableTags The tags to set as available in this channel
   * @param {string} [reason] Reason for changing the available tags
   * @returns {Promise<ForumChannel>}
   */
  setAvailableTags(availableTags, reason) {
    return this.edit({ availableTags, reason });
  }

  /**
   * Sets the default reaction emoji for this channel
   * @param {?DefaultReactionEmoji} defaultReactionEmoji The emoji to set as the default reaction emoji
   * @param {string} [reason] Reason for changing the default reaction emoji
   * @returns {Promise<ForumChannel>}
   */
  setDefaultReactionEmoji(defaultReactionEmoji, reason) {
    return this.edit({ defaultReactionEmoji, reason });
  }

  /**
   * Sets the default rate limit per user (slowmode) for new threads in this channel
   * @param {number} defaultThreadRateLimitPerUser The rate limit to set on newly created threads in this channel
   * @param {string} [reason] Reason for changing the default rate limit
   * @returns {Promise<ForumChannel>}
   */
  setDefaultThreadRateLimitPerUser(defaultThreadRateLimitPerUser, reason) {
    return this.edit({ defaultThreadRateLimitPerUser, reason });
  }

  /**
   * Creates an invite to this guild channel.
   * @param {CreateInviteOptions} [options={}] The options for creating the invite
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite(options) {
    return this.guild.invites.create(this.id, options);
  }

  /**
   * Fetches a collection of invites to this guild channel.
   * Resolves with a collection mapping invites by their codes.
   * @param {boolean} [cache=true] Whether or not to cache the fetched invites
   * @returns {Promise<Collection<string, Invite>>}
   */
  fetchInvites(cache = true) {
    return this.guild.invites.fetch({ channelId: this.id, cache });
  }

  /**
   * Sets the default auto archive duration for all newly created threads in this channel.
   * @param {ThreadAutoArchiveDuration} defaultAutoArchiveDuration The new default auto archive duration
   * @param {string} [reason] Reason for changing the channel's default auto archive duration
   * @returns {Promise<ForumChannel>}
   */
  setDefaultAutoArchiveDuration(defaultAutoArchiveDuration, reason) {
    return this.edit({ defaultAutoArchiveDuration, reason });
  }

  /**
   * Sets a new topic for the guild channel.
   * @param {?string} topic The new topic for the guild channel
   * @param {string} [reason] Reason for changing the guild channel's topic
   * @returns {Promise<ForumChannel>}
   * @example
   * // Set a new channel topic
   * channel.setTopic('needs more rate limiting')
   *   .then(newChannel => console.log(`Channel's new topic is ${newChannel.topic}`))
   *   .catch(console.error);
   */
  setTopic(topic, reason) {
    return this.edit({ topic, reason });
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  createWebhook() {}
  fetchWebhooks() {}
  setNSFW() {}
  setRateLimitPerUser() {}
}

TextBasedChannel.applyToClass(ForumChannel, true, [
  'send',
  'lastMessage',
  'lastPinAt',
  'bulkDelete',
  'sendTyping',
  'createMessageCollector',
  'awaitMessages',
  'createMessageComponentCollector',
  'awaitMessageComponent',
]);

module.exports = ForumChannel;
