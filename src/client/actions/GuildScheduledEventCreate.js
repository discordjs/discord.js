'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildScheduledEventCreateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    if (guild) {
      const guildEvent = guild.events._add(data);

      /**
       * Emitted whenever a guild event is created.
       * @event Client#guildScheduledEventCreate
       * @param {GuildEvent} guildEvent The created guild event
       */
      client.emit(Events.GUILD_SCHEDULED_EVENT_CREATE, guildEvent);

      return { guildEvent };
    }

    return {};
  }
}

module.exports = GuildScheduledEventCreateAction;
