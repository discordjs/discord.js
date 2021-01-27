'use strict';

const Collection = require('../../../util/Collection');
const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const server = client.servers.cache.get(data.server_id);
  if (!server) return;
  const members = new Collection();

  for (const member of data.members) members.set(member.user.id, server.members.add(member));
  if (data.presences) {
    for (const presence of data.presences) server.presences.add(Object.assign(presence, { server }));
  }
  /**
   * Emitted whenever a chunk of server members is received (all members come from the same server).
   * @event Client#serverMembersChunk
   * @param {Collection<Snowflake, ServerMember>} members The members in the chunk
   * @param {Server} server The server related to the member chunk
   * @param {Object} chunk Properties of the received chunk
   * @param {number} chunk.index Index of the received chunk
   * @param {number} chunk.count Number of chunks the client should receive
   * @param {?string} chunk.nonce Nonce for this chunk
   */
  client.emit(Events.GUILD_MEMBERS_CHUNK, members, server, {
    count: data.chunk_count,
    index: data.chunk_index,
    nonce: data.nonce,
  });
};
