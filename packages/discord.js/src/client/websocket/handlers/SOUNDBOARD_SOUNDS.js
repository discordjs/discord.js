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
   * Emitted whenever soundboard sounds are received (all soundboard sounds come from the same guild).
   * @event Client#soundboardSounds
   * @param {Collection<Snowflake, SoundboardSound>} soundboardSounds The sounds received
   * @param {Guild} guild The guild that the soundboard sounds are from
   */
  client.emit(Events.SoundboardSounds, soundboardSounds, guild);
};
