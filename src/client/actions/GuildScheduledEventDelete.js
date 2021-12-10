'use strict';

const Action = require('./Action');
const { deletedGuildScheduledEvents } = require('../../structures/GuildScheduledEvent');
const { Events } = require('../../util/Constants');

class GuildScheduledEventDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const guildScheduledEvent = guild.scheduledEvents._add(data);
      if (guildScheduledEvent) {
        guild.scheduledEvents.cache.delete(guildScheduledEvent.id);
        deletedGuildScheduledEvents.add(guildScheduledEvent);

        /**
         * Emitted whenever a guild scheduled event is deleted.
         * @event Client#guildScheduledEventDelete
         * @param {GuildScheduledEvent} guildScheduledEvent The deleted guild scheduled event
         */
        client.emit(Events.GUILD_SCHEDULED_EVENT_DELETE, guildScheduledEvent);

        return { guildScheduledEvent };
      }
    }

    return {};
  }
}

module.exports = GuildScheduledEventDeleteAction;
