const Action = require('./Action');
const Constants = require('../../util/Constants');
const Guild = require('../../structures/Guild');

class GuildUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      const newGuild = new Guild(client, data);
      client.emit(Constants.Events.GUILD_UPDATE, guild, newGuild);
      this.client.guilds.set(newGuild.id, newGuild);
      return {
        old: guild,
        updated: newGuild,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a guild is updated - e.g. name change.
 * @event Client#guildUpdate
 * @param {Guild} oldGuild The guild before the update
 * @param {Guild} newGuild The guild after the update
 */

module.exports = GuildUpdateAction;
