'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildScheduledEventDelete extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const guildEvent = guild.events._add(data);
      if (guildEvent) {
        guild.events.cache.delete(guildEvent.id);
        guildEvent.deleted = true;

        /**
         * Emitted whenever a guild event is deleted.
         * @event Client#guildScheduledEventDelete
         * @param {GuildEvent} guildEvent The deleted guild event
         */
        client.emit(Events.GUILD_SCHEDULED_EVENT_DELETE, guildEvent);

        return { guildEvent };
      }
    }

    return {};
  }
}

module.exports = GuildScheduledEventDelete;
