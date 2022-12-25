'use strict';

const { Collection } = require('@discordjs/collection');
const Events = require('../../../util/Events');

module.exports = (client, { d: data }) => {
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) return;
  const members = new Collection();

  for (const member of data.members) members.set(member.user.id, guild.members._add(member));
  if (data.presences) {
    for (const presence of data.presences) guild.presences._add(Object.assign(presence, { guild }));
  }

  /**
   * Represents the properties of a guild members chunk
   * @typedef {Object} GuildMembersChunk
   * @property {number} index Index of the received chunk
   * @property {number} count Number of chunks the client should receive
   * @property {JSONValue[]} notFound An array of whatever could not be found
   * when using {@link GatewayOpcodes.RequestGuildMembers}
   * @property {?string} nonce Nonce for this chunk
   */

  /**
   * Emitted whenever a chunk of guild members is received (all members come from the same guild).
   * @event Client#guildMembersChunk
   * @param {Collection<Snowflake, GuildMember>} members The members in the chunk
   * @param {Guild} guild The guild related to the member chunk
   * @param {GuildMembersChunk} chunk Properties of the received chunk
   */
  client.emit(Events.GuildMembersChunk, members, guild, {
    index: data.chunk_index,
    count: data.chunk_count,
    notFound: data.not_found,
    nonce: data.nonce,
  });
};
