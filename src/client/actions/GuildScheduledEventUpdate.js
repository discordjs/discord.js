'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildScheduledEventUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const oldGuildScheduledEvent = guild.scheduledEvents.cache.get(data.id)?._clone() ?? null;
      const newGuildScheduledEvent = guild.scheduledEvents._add(data);

      /**
       * Emitted whenever a guild scheduled event gets updated.
       * @event Client#guildScheduledEventUpdate
       * @param {?GuildScheduledEvent} oldGuildScheduledEvent The guild scheduled event object before the update
       * @param {GuildScheduledEvent} newGuildScheduledEvent The guild scheduled event object after the update
       */
      client.emit(Events.GUILD_SCHEDULED_EVENT_UPDATE, oldGuildScheduledEvent, newGuildScheduledEvent);

      return { oldGuildScheduledEvent, newGuildScheduledEvent };
    }

    return {};
  }
}

module.exports = GuildScheduledEventUpdateAction;
