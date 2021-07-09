'use strict';

const TextChannel = require('./TextChannel');
const { Error } = require('../errors');

/**
 * Represents a guild news channel on Discord.
 * @extends {TextChannel}
 */
class NewsChannel extends TextChannel {
  _patch(data) {
    super._patch(data);

    // News channels don't have a rate limit per user, remove it
    this.rateLimitPerUser = undefined;
  }

  /**
   * Adds the target to this channel's followers.
   * @param {GuildChannelResolvable} channel The channel where the webhook should be created
   * @param {string} [reason] Reason for creating the webhook
   * @returns {Promise<NewsChannel>}
   * @example
   * if (channel.type === 'GUILD_NEWS') {
   *   channel.addFollower('222197033908436994', 'Important announcements')
   *     .then(() => console.log('Added follower'))
   *     .catch(console.error);
   * }
   */
  async addFollower(channel, reason) {
    const channelId = this.guild.channels.resolveId(channel);
    if (!channelId) throw new Error('GUILD_CHANNEL_RESOLVE');
    await this.client.api.channels(this.id).followers.post({ data: { webhook_channel_id: channelId }, reason });
    return this;
  }
}

module.exports = NewsChannel;
