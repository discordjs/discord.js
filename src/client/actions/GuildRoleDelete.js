const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildRoleDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);
    let role;

    if (guild) {
      role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.remove(data.role_id);
        role.deleted = true;
        /**
         * Emitted whenever a guild role is deleted.
         * @event Client#roleDelete
         * @param {Role} role The role that was deleted
         */
        client.emit(Events.GUILD_ROLE_DELETE, role);
      }
    }

    return { role };
  }
}


module.exports = GuildRoleDeleteAction;
