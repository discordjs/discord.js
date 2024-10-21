'use strict';

const ClientApplication = require('../../../structures/ClientApplication');
let ClientUser;

module.exports = (client, { d: data }, shardId) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    ClientUser ??= require('../../../structures/ClientUser');
    client.user = new ClientUser(client, data.user);
    client.users.cache.set(client.user.id, client.user);
  }

  for (const guild of data.guilds) {
    guild.shardId = shardId;
    client.guilds._add(guild);
  }

  if (client.application) {
    client.application._patch(data.application);
  } else {
    client.application = new ClientApplication(client, data.application);
  }
};
