'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildSoundboardSoundUpdateAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);

    if (guild) {
      let oldSoundboardSound = null;

      const newSoundboardSound = guild.soundboardSounds.cache.get(data.sound_id);

      if (newSoundboardSound) {
        oldSoundboardSound = newSoundboardSound._update(data);

        /**
         * Emitted whenever a soundboard sound is updated in a guild.
         * @event Client#guildSoundboardSoundUpdate
         * @param {?SoundboardSound} oldSoundboardSound The soundboard sound before the update
         * @param {SoundboardSound} newSoundboardSound The soundboard sound after the update
         */
        this.client.emit(Events.GuildSoundboardSoundUpdate, oldSoundboardSound, newSoundboardSound);
      }

      return { oldSoundboardSound, newSoundboardSound };
    }

    return { oldSoundboardSound: null, newSoundboardSound: null };
  }
}

module.exports = GuildSoundboardSoundUpdateAction;
