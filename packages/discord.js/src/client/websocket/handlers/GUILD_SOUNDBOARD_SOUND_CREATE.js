'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);

  if (!guild) return;

  const soundboardSound = guild.soundboardSounds._add(data);

  /**
   * Emitted whenever a guild soundboard sound is created.
   * @event Client#guildSoundboardSoundCreate
   * @param {SoundboardSound} soundboardSound The created guild soundboard sound
   */
  client.emit(Events.GuildSoundboardSoundCreate, soundboardSound);
};
