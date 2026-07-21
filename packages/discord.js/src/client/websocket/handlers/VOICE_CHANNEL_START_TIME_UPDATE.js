'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const newChannel = guild.channels.cache.get(data.id);
  if (!newChannel) return;

  const oldChannel = newChannel._update(data);

  /**
   * Emitted whenever the voice session start time of a voice channel changes.
   *
   * @event Client#voiceChannelStartTimeUpdate
   * @param {VoiceChannel} oldChannel The voice channel before the voice session start time changed
   * @param {VoiceChannel} newChannel The voice channel after the voice session start time changed
   */
  client.emit(Events.VoiceChannelStartTimeUpdate, oldChannel, newChannel);
};
