'use strict';

const Collection = require('../../../util/Collection');
const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;
  const members = new Collection();

  for (const member of data.members) members.set(member.user.id, guild.members.add(member));
  if (data.presences) {
    for (const presence of data.presences) guild.presences.cache.add(Object.assign(presence, { guild }));
  }
  /**
   * Emitted whenever a chunk of guild members is received (all members come from the same guild).
   * @event Client#guildMembersChunk
   * @param {Collection<Snowflake, GuildMember>} members The members in the chunk
   * @param {Guild} guild The guild related to the member chunk
   */
  client.emit(Events.GUILD_MEMBERS_CHUNK, members, guild);
};
