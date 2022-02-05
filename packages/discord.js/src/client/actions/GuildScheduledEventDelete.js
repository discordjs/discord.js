'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildScheduledEventDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const guildScheduledEvent = this.getScheduledEvent(data, guild);
      if (guildScheduledEvent) {
        guild.scheduledEvents.cache.delete(guildScheduledEvent.id);

        /**
         * Emitted whenever a guild scheduled event is deleted.
         * @event Client#guildScheduledEventDelete
         * @param {GuildScheduledEvent} guildScheduledEvent The deleted guild scheduled event
         */
        client.emit(Events.GuildScheduledEventDelete, guildScheduledEvent);

        return { guildScheduledEvent };
      }
    }

    return {};
  }
}

module.exports = GuildScheduledEventDeleteAction;
