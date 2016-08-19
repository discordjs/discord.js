const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildRoleDeleteAction extends Action {

  constructor(client) {
    super(client);
    this.timeouts = [];
    this.deleted = {};
  }

  handle(data) {
    const client = this.client;
    const guild = client.guilds.get(data.guild_id);

    if (guild) {
      let exists = guild.roles.get(data.role_id);
      if (exists) {
        guild.roles.remove(data.role_id);
        this.deleted[guild.id + data.role_id] = exists;
        this.scheduleForDeletion(guild.id, data.role_id);
        client.emit(Constants.Events.GUILD_ROLE_DELETE, guild, exists);
      }

      if (!exists) {
        exists = this.deleted[guild.id + data.role_id];
      }

      return {
        role: exists,
      };
    }

    return {
      role: null,
    };
  }

  scheduleForDeletion(guildID, roleID) {
    this.timeouts.push(
      setTimeout(() => delete this.deleted[guildID + roleID],
        this.client.options.rest_ws_bridge_timeout)
    );
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
