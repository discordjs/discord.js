'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  const user = client.users.add(data.user);

  /**
   * Emitted whenever a member is banned from a guild.
   * @event Client#guildBanAdd
   * @param {Guild} guild The guild that the ban occurred in
   * @param {User} user The user that was banned
   */
  if (guild && user) client.emit(Events.GUILD_BAN_ADD, guild, user);
};
