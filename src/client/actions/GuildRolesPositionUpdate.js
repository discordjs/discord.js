const Action = require('./Action');

class GuildRolesPositionUpdate extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.guild_id);
    if (guild) {
      for (const partialRole of data.roles) {
        const role = guild.roles.get(partialRole.id);
        if (role) {
          role.position = partialRole.position;
        }
      }
    }

    return {
      guild,
    };
  }
}

/**
 * Emitted whenever a guild role is created.
 * @event Client#guildRoleCreate
 * @param {Guild} guild The guild that the role was created in.
 * @param {Role} role The role that was created.
 */

module.exports = GuildRolesPositionUpdate;
