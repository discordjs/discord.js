const Action = require('./Action');
const { Events } = require('../../util/Constants');

class GuildRoleUpdateAction extends Action {
  handle(data) {
    const client = this.client;
    this._patch(data);
    const guild = client.guilds.get(data.guild_id);

    if (guild) {
      let old = null;

      const role = guild.roles.get(data.role.id);
      if (role) {
        old = role._update(data.role);
        client.emit(Events.GUILD_ROLE_UPDATE, old, role);
      }

      return {
        old,
        updated: role,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }

  _patch(data) {
    data.guild_id = BigInt(data.guild_id);
    data.role.id = BigInt(data.role.id);
  }
}

/**
 * Emitted whenever a guild role is updated.
 * @event Client#roleUpdate
 * @param {Role} oldRole The role before the update
 * @param {Role} newRole The role after the update
 */

module.exports = GuildRoleUpdateAction;
