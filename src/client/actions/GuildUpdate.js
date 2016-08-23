const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class GuildUpdateAction extends Action {

  constructor(client) {
    super(client);
    this.deleted = {};
    this.timeouts = [];
  }

  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.id);

    if (guild) {
      const oldGuild = cloneObject(guild);
      guild.setup(data);

      if (!oldGuild.equals(data)) {
        client.emit(Constants.Events.GUILD_UPDATE, oldGuild, guild);
      }

      return {
        old: oldGuild,
        updated: guild,
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
*
* @event Client#guildUpdate
* @param {Guild} oldGuild the guild before the update.
* @param {Guild} newGuild the guild after the update.
*/

module.exports = GuildUpdateAction;
