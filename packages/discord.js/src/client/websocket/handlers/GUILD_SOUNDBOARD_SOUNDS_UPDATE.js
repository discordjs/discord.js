'use strict';

const { Collection } = require('@discordjs/collection');
const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);

  if (!guild) return;

  const soundboardSounds = new Collection();

  for (const soundboardSound of data.soundboard_sounds) {
    soundboardSounds.set(soundboardSound.sound_id, guild.soundboardSounds._add(soundboardSound));
  }

  /**
   * Emitted whenever multiple guild soundboard sounds are updated.
   * @event Client#guildSoundboardSoundsUpdate
   * @param {Collection<Snowflake, SoundboardSound>} soundboardSounds The updated soundboard sounds
   * @param {Guild} guild The guild that the soundboard sounds are from
   */
  client.emit(Events.GuildSoundboardSoundsUpdate, soundboardSounds, guild);
};
