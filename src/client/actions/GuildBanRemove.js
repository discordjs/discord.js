const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildBanRemove extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const guild = client.guilds.get(data.guild_id);
    const user = client.users.add(data.user);
    if (guild && user) client.emit(Events.GUILD_BAN_REMOVE, guild, user);
  }

  _patch(data) {
    data.guild_id = BigInt(data.guild_id);
    data.user.id = BigInt(data.user.id);
  }
}

module.exports = GuildBanRemove;
