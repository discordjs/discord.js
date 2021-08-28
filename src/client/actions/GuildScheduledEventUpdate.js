'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildScheduledEventUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const oldGuildEvent = guild.events.cache.get(data.id)._clone() ?? null;
      const newGuildEvent = guild.events._add(data);

      /**
       * Emitted whenever a guild event gets updated
       * @event Client#guildScheduledEventUpdate
       * @param {?GuildEvent} oldGuildEvent The guild event object before the update
       * @param {GuildEvent} newGuildEvent The guild event object after the update
       */
      client.emit(Events.GUILD_SCHEDULED_EVENT_UPDATE, oldGuildEvent, newGuildEvent);

      return { oldGuildEvent, newGuildEvent };
    }

    return {};
  }
}

module.exports = GuildScheduledEventUpdateAction;
