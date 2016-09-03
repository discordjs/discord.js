const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildRoleDeleteAction extends Action {

  constructor(client) {
    super(client);
    this.deleted = {};
  }

  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      let role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.delete(data.role_id);
        this.deleted[guild.id + data.role_id] = role;
        this.scheduleForDeletion(guild.id, data.role_id);
        client.emit(Constants.Events.GUILD_ROLE_DELETE, guild, role);
      } else {
        role = this.deleted[guild.id + data.role_id];
      }

      return {
        role,
      };
    }

    return {
      role: null,
    };
  }

  scheduleForDeletion(guildID, roleID) {
    this.client.setTimeout(() => delete this.deleted[guildID + roleID], this.client.options.rest_ws_bridge_timeout);
  }
}

/**
* Emitted whenever a guild role is deleted.
*
* @event Client#guildRoleDelete
* @param {Guild} guild the guild that the role was deleted in.
* @param {Role} role the role that was deleted.
*/

module.exports = GuildRoleDeleteAction;
