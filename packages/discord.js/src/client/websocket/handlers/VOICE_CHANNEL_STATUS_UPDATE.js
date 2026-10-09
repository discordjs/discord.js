'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const newChannel = guild.channels.cache.get(data.id);
  if (!newChannel) return;

  const oldChannel = newChannel._update(data);

  /**
   * Emitted whenever the status of a voice channel changes.
   *
   * @event Client#voiceChannelStatusUpdate
   * @param {VoiceChannel} oldChannel The voice channel before the status changed
   * @param {VoiceChannel} newChannel The voice channel after the status changed
   */
  client.emit(Events.VoiceChannelStatusUpdate, oldChannel, newChannel);
};
