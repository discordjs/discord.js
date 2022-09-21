'use strict';

const GuildChannel = require('./GuildChannel');
const GuildForumThreadManager = require('../managers/GuildForumThreadManager');

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
      this.availableTags = data.available_tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        moderated: tag.moderated,
        emoji:
          tag.emoji_id ?? tag.emoji_name
            ? {
                id: tag.emoji_id,
                name: tag.emoji_name,
              }
            : null,
      }));
    } else {
      this.availableTags ??= [];
    }

    if ('default_reaction_emoji' in data) {
      /**
       * The emoji to show in the add reaction button on a thread in a guild forum channel
       * @type {?DefaultReactionEmoji}
       */
      this.defaultReactionEmoji = data.default_reaction_emoji
        ? {
            id: data.default_reaction_emoji.emoji_id,
            name: data.default_reaction_emoji.emoji_name,
          }
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
   * Sets the rate limit per user (slowmode) for this channel
   * @param {?number} rateLimitPerUser The rate limit to set on this channel
   * @param {string} [reason] Reason for changing the rate limit
   * @returns {Promise<ForumChannel>}
   */
  setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser, reason });
  }
}

module.exports = ForumChannel;
