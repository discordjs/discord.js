'use strict';

const ClientApplication = require('../../../structures/ClientApplication');
let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    ClientUser ??= require('../../../structures/ClientUser');
    client.users.me = new ClientUser(client, data.user);
  }

  for (const guild of data.guilds) {
    guild.shardId = shard.id;
    client.guilds._add(guild);
  }

  if (client.application) {
    client.application._patch(data.application);
  } else {
    client.application = new ClientApplication(client, data.application);
  }

  shard.checkReady();
};
