'use strict';

const GuildBan = require('../../../structures/GuildBan.js');
const Events = require('../../../util/Events.js');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;

  const ban = guild.bans.cache.get(data.user.id) ?? new GuildBan(client, data, guild);

  guild.bans.cache.delete(ban.user.id);

  /**
   * Emitted whenever a member is unbanned from a guild.
   * @event Client#guildBanRemove
   * @param {GuildBan} ban The ban that was removed
   */
  client.emit(Events.GuildBanRemove, ban);
};
