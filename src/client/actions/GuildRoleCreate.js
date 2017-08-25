const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildRoleCreate extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let role;
    if (guild) {
      const already = guild.roles.has(data.role.id);
      role = guild.roles.create(data.role);
      if (!already) client.emit(Constants.Events.GUILD_ROLE_CREATE, role);
    }
    return { role };
  }
}

/**
 * Emitted whenever a role is created.
 * @event Client#roleCreate
 * @param {Role} role The role that was created
 */

module.exports = GuildRoleCreate;
