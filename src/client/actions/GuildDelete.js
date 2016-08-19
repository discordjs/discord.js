const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildDeleteAction extends Action {

  constructor(client) {
    super(client);
    this.deleted = {};
    this.timeouts = [];
  }

  handle(data) {
    const client = this.client;
    let guild = client.guilds.get(data.id);

    if (guild) {
      if (guild.available && data.unavailable) {
        // guild is unavailable
        guild.available = false;
        client.emit(Constants.Events.GUILD_UNAVAILABLE, guild);

        // stops the GuildDelete packet thinking a guild was actually deleted,
        // handles emitting of event itself
        return {
          guild: null,
        };
      }
      // delete guild
      client.guilds.delete(guild.id);
      this.deleted[guild.id] = guild;
      this.scheduleForDeletion(guild.id);
    } else if (this.deleted[data.id]) {
      guild = this.deleted[data.id];
    }

    return {
      guild,
    };
  }

  scheduleForDeletion(id) {
    this.timeouts.push(
      setTimeout(() => delete this.deleted[id],
        this.client.options.rest_ws_bridge_timeout)
    );
  }
}

module.exports = GuildDeleteAction;
