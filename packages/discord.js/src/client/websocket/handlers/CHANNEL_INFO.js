'use strict';

const { Collection } = require('@discordjs/collection');
const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const channels = new Collection();

  for (const entry of data.channels) {
    const channel = guild.channels.cache.get(entry.id);
    if (!channel) continue;

    channel._patch(entry);

    channels.set(channel.id, channel);
  }

  /**
   * Emitted in response to a {@link Guild#requestChannelInfo} call.
   *
   * @event Client#channelInfo
   * @param {Collection<Snowflake, VoiceChannel>} channels Voice channels with ephemeral channel info, mapped by channel id
   */
  client.emit(Events.ChannelInfo, channels);
};
