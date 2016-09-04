const Action = require('./Action');
const Constants = require('../../util/Constants');

class GuildRoleDeleteAction extends Action {
  constructor(client) {
    super(client);
    this.deleted = new Map();
  }

  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      let role = guild.roles.get(data.role_id);
      if (role) {
        guild.roles.delete(data.role_id);
        this.deleted.set(guild.id + data.role_id, role);
        this.scheduleForDeletion(guild.id, data.role_id);
        client.emit(Constants.Events.GUILD_ROLE_DELETE, guild, role);
      } else {
        role = this.deleted.get(guild.id + data.role_id) || null;
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
    this.client.setTimeout(() => this.deleted.delete(guildID + roleID), this.client.options.rest_ws_bridge_timeout);
  }
}

/**
 * Emitted whenever a guild role is deleted.
 * @event Client#guildRoleDelete
 * @param {Guild} guild The guild that the role was deleted in.
 * @param {Role} role The role that was deleted.
 */

module.exports = GuildRoleDeleteAction;
