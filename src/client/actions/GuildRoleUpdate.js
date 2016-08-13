const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class GuildRoleUpdateAction extends Action {

  handle(data) {
    const client = this.client;
    const guild = client.store.get('guilds', data.guild_id);

    const roleData = data.role;

    if (guild) {
      let oldRole;
      const existingRole = guild.store.get('roles', roleData.id);
      // exists and not the same
      if (existingRole && !existingRole.equals(roleData)) {
        oldRole = cloneObject(existingRole);
        existingRole.setup(data.role);
        client.emit(Constants.Events.GUILD_ROLE_UPDATE, guild, oldRole, existingRole);
      }

      return {
        old: oldRole,
        updated: existingRole,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = GuildRoleUpdateAction;
