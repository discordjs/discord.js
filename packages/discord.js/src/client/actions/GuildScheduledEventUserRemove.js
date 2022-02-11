'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class GuildScheduledEventUserRemoveAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);

    if (guild) {
      const guildScheduledEvent = this.getScheduledEvent(data, guild);
      const user = this.getUser(data);

      if (guildScheduledEvent && user) {
        /**
         * Emitted whenever a user unsubscribes from a guild scheduled event
         * @event Client#guildScheduledEventUserRemove
         * @param {GuildScheduledEvent} guildScheduledEvent The guild scheduled event
         * @param {User} user The user who unsubscribed
         */
        client.emit(Events.GuildScheduledEventUserRemove, guildScheduledEvent, user);

        return { guildScheduledEvent, user };
      }
    }

    return {};
  }
}

module.exports = GuildScheduledEventUserRemoveAction;
