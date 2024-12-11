'use strict';

const BaseGuildTextChannel = require('./BaseGuildTextChannel');

/**
 * Represents a guild news channel on Discord.
 * @extends {BaseGuildTextChannel}
 */
class NewsChannel extends BaseGuildTextChannel {
  /**
   * Represents the followed channel data.
   * @typedef {Object} FollowedChannel
   * @property {Snowflake} channelId Source channel id
   * @property {Snowflake} webhookId Created webhook id in the target channel
   */

  /**
   * Adds the target to this channel's followers.
   * @param {TextChannelResolvable} channel The channel where the webhook should be created
   * @param {string} [reason] Reason for creating the webhook
   * @returns {Promise<FollowedChannel>} Returns a followed channel object.
   * @example
   * if (channel.type === ChannelType.GuildAnnouncement) {
   *   channel.addFollower('222197033908436994', 'Important announcements')
   *     .then(() => console.log('Added follower'))
   *     .catch(console.error);
   * }
   */
  async addFollower(channel, reason) {
    return this.guild.channels.addFollower(this, channel, reason);
  }
}

module.exports = NewsChannel;
