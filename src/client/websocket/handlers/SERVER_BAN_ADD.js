'use strict';

const { Events } = require('../../../util/Constants');

module.exports = (client, { d: data }) => {
  const server = client.servers.cache.get(data.server_id);
  const user = client.users.add(data.user);

  /**
   * Emitted whenever a member is banned from a server.
   * @event Client#serverBanAdd
   * @param {Server} server The server that the ban occurred in
   * @param {User} user The user that was banned
   */
  if (server && user) client.emit(Events.GUILD_BAN_ADD, server, user);
};
