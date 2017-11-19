const Action = require('./Action');

class GuildBanRemove extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.create(data.user);
    if (guild && user) client.emit(Events.GUILD_BAN_REMOVE, guild, user);
  }
}

module.exports = GuildBanRemove;

const { Constants: { Events } } = require('../../');
