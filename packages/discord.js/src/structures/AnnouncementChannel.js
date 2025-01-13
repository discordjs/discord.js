'use strict';

const BaseGuildTextChannel = require('./BaseGuildTextChannel');

/**
 * Represents a guild announcement channel on Discord.
 * @extends {BaseGuildTextChannel}
 */
class AnnouncementChannel extends BaseGuildTextChannel {
  /**
   * Adds the target to this channel's followers.
   * @param {TextChannelResolvable} channel The channel where the webhook should be created
   * @param {string} [reason] Reason for creating the webhook
   * @returns {Promise<FollowedChannelData>} Returns the data for the followed channel
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

module.exports = AnnouncementChannel;
