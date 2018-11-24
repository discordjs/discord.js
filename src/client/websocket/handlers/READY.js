let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
  const clientUser = new ClientUser(client, data.user);
  client.user = clientUser;
  client.readyAt = new Date();
  client.users.set(clientUser.id, clientUser);

  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  client.ws.checkReady();
};
