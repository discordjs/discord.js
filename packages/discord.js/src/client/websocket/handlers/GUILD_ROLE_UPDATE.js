'use strict';

const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const role = guild.roles.cache.get(data.role.id);
  if (!role) return;

  const old = role._update(data.role);

  /**
   * Emitted whenever a guild role is updated.
   * @event Client#roleUpdate
   * @param {Role} oldRole The role before the update
   * @param {Role} newRole The role after the update
   */
  client.emit(Events.GuildRoleUpdate, old, role);
};
