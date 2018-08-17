const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const guild = client.guilds.get(data.guild_id);
    let role;
    if (guild) {
      const already = guild.roles.has(data.role.id);
      role = guild.roles.add(data.role);
      if (!already) client.emit(Events.GUILD_ROLE_CREATE, role);
    }
    return { role };
  }

  _patch(data) {
    data.guild_id = BigInt(data.guild_id);
    data.role.id = BigInt(data.role.id);
  }
}

/**
 * Emitted whenever a role is created.
 * @event Client#roleCreate
 * @param {Role} role The role that was created
 */

module.exports = GuildRoleCreate;
