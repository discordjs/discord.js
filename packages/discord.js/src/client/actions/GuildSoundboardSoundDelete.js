'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildSoundboardSoundDeleteAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);

    let soundboardSound;

    if (guild) {
      soundboardSound = guild.soundboardSounds.cache._add(data, false);

      guild.soundboardSounds.cache.delete(soundboardSound.id);

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
