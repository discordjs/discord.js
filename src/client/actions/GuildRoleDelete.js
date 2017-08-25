const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildRoleDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let role;

    if (guild) {
      role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.remove(data.role_id);
        client.emit(Constants.Events.GUILD_ROLE_DELETE, role);
      }
    }

    return { role };
  }
}

/**
 * Emitted whenever a guild role is deleted.
 * @event Client#roleDelete
 * @param {Role} role The role that was deleted
 */

module.exports = GuildRoleDeleteAction;
