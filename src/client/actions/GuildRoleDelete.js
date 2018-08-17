const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildRoleDeleteAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const guild = client.guilds.get(data.guild_id);
    let role;

    if (guild) {
      role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.remove(data.role_id);
        role.deleted = true;
        client.emit(Events.GUILD_ROLE_DELETE, role);
      }
    }

    return { role };
  }

  _patch(data) {
    data.guild_id = BigInt(data.guild_id);
    data.role_id = BigInt(data.role_id);
  }
}

/**
 * Emitted whenever a guild role is deleted.
 * @event Client#roleDelete
 * @param {Role} role The role that was deleted
 */

module.exports = GuildRoleDeleteAction;
