'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);

  if (!guild) return;

  const oldGuildSoundboardSound = guild.soundboardSounds.cache.get(data.sound_id)?._clone() ?? null;
  const newGuildSoundboardSound = guild.soundboardSounds._add(data);

  /**
   * Emitted whenever a guild soundboard sound is updated.
   * @event Client#guildSoundboardSoundUpdate
   * @param {?SoundboardSound} oldGuildSoundboardSound The guild soundboard sound before the update
   * @param {SoundboardSound} newGuildSoundboardSound The guild soundboard sound after the update
   */
  client.emit(Events.GuildSoundboardSoundUpdate, oldGuildSoundboardSound, newGuildSoundboardSound);
};
