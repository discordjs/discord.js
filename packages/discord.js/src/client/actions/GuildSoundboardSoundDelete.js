'use strict';

const Action = require('./Action.js');
const Events = require('../../util/Events.js');

class GuildSoundboardSoundDeleteAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);

    if (!guild) return {};

    const soundboardSound = this.getSoundboardSound(data, guild);

    if (soundboardSound) {
      guild.soundboardSounds.cache.delete(soundboardSound.soundId);

      /**
       * Emitted whenever a soundboard sound is deleted in a guild.
       * @event Client#guildSoundboardSoundDelete
       * @param {SoundboardSound} soundboardSound The soundboard sound that was deleted
       */
      this.client.emit(Events.GuildSoundboardSoundDelete, soundboardSound);
    }

    return { soundboardSound };
  }
}

module.exports = GuildSoundboardSoundDeleteAction;
