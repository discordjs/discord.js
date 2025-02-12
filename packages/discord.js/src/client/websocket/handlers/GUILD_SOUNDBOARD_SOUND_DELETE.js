'use strict';

const { Events } = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);

  if (!guild) return;

  const soundboardSound = guild.soundboardSounds.cache.get(data.sound_id);

  if (soundboardSound) {
    guild.soundboardSounds.cache.delete(soundboardSound.soundId);

    /**
     * Emitted whenever a soundboard sound is deleted in a guild.
     * @event Client#guildSoundboardSoundDelete
     * @param {SoundboardSound} soundboardSound The soundboard sound that was deleted
     */
    client.emit(Events.GuildSoundboardSoundDelete, soundboardSound);
  }
};
