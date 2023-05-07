'use strict';

const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  /**
   * The id of the parent of this channel.
   * @name CategoryChannel#parentId
   * @type {null}
   */

  /**
   * The parent of this channel.
   * @name CategoryChannel#parent
   * @type {null}
   * @readonly
   */

  /**
   * Channels that are a part of this category
   * @type {Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    return this.guild.channels.cache.filter(c => c.parentId === this.id);
  }

  /**
   * Sets the category parent of this channel.
   * <warn>It is not possible to set the parent of a CategoryChannel.</warn>
   * @method setParent
   * @memberof CategoryChannel
   * @instance
   * @param {?CategoryChannelResolvable} channel The channel to set as parent
   * @param {SetParentOptions} [options={}] The options for setting the parent
   * @returns {Promise<GuildChannel>}
   */

  /**
   * Options for creating a channel using {@link CategoryChannel#createChannel}.
   * @typedef {Object} CategoryCreateChannelOptions
   * @property {string} [name] The name of the new channel
   * @property {ChannelType|number} [type='GUILD_TEXT'] The type of the new channel.
   * @property {number} [position] Position of the new channel
   * @property {string} [topic] The topic for the new channel
   * @property {boolean} [nsfw] Whether the new channel is NSFW
   * @property {number} [bitrate] Bitrate of the new channel in bits (only voice)
   * @property {number} [userLimit] Maximum amount of users allowed in the new channel (only voice)
   * @property {OverwriteResolvable[]|Collection<Snowflake, OverwriteResolvable>} [permissionOverwrites]
   * Permission overwrites of the new channel
   * @property {number} [rateLimitPerUser] The rate limit per user (slowmode) for the new channel in seconds
   * @property {ThreadAutoArchiveDuration} [defaultAutoArchiveDuration]
   * The default auto archive duration for all new threads in this channel
   * @property {?string} [rtcRegion] The specific region of the new channel
   * @property {?VideoQualityMode|number} [videoQualityMode] The camera video quality mode of the new channel
   * @property {ChannelFlagsResolvable} [flags] The flags to set on the new channel
   * @property {GuildForumTagData[]} [availableTags] The tags to set as available in a forum channel
   * @property {?DefaultReactionEmoji} [defaultReactionEmoji] The emoji to set as the default reaction emoji
   * @property {number} [defaultThreadRateLimitPerUser] The rate limit per user (slowmode) to set on forum posts
   * @property {?SortOrderType} [defaultSortOrder] The default sort order mode to set on the new channel
   * @property {string} [reason] Reason for creating the new channel
   */

  /**
   * Creates a new channel within this category.
   * <info>You cannot create a channel of type `GUILD_CATEGORY` inside a CategoryChannel.</info>
   * @param {string} name The name of the new channel
   * @param {CategoryCreateChannelOptions} options Options for creating the new channel
   * @returns {Promise<GuildChannel>}
   */
  createChannel(name, options) {
    return this.guild.channels.create(name, {
      ...options,
      parent: this.id,
    });
  }
}

module.exports = CategoryChannel;
