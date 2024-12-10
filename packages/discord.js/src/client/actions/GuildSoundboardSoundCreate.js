'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildSoundboardSoundCreateAction extends Action {
  handle(data) {
    const guild = this.client.guilds.cache.get(data.guild_id);

    let soundboardSound;

    if (guild) {
      const already = guild.soundboardSounds.cache.has(data.sound_id);

      soundboardSound = guild.soundboardSounds._add(data);

      /**
       * Emitted whenever a soundboard sound is created in a guild.
       * @event Client#guildSoundboardSoundCreate
       * @param {SoundboardSound} soundboardSound The soundboard sound that was created
       */
      if (!already) this.client.emit(Events.GuildSoundboardSoundCreate, soundboardSound);
    }

    return { soundboardSound };
  }
}

module.exports = GuildSoundboardSoundCreateAction;
