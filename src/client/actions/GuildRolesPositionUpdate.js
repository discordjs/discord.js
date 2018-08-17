const Action = require('./Action');

class GuildRolesPositionUpdate extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialRole of data.roles) {
        this._patch(partialRole);
        const role = guild.roles.get(partialRole.id);
        if (role) role.rawPosition = partialRole.position;
      }
    }

    return { guild };
  }

  _patch(data) {
    if (data.guild_id) data.guild_id = BigInt(data.guild_id);
    if (data.id) data.id = BigInt(data.id);
  }
}

module.exports = GuildRolesPositionUpdate;
