import { ClientApplication } from '../../../structures/ClientApplication.js';
import { ClientUser } from '../../../structures/ClientUser.js';
import { Status } from '../../../util/Status.js';

export default (client, { d: data }, shardId) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    client.user = new ClientUser(client, data.user);
    client.users.cache.set(client.user.id, client.user);
  }

  const expectedGuilds = new Set();
  for (const guild of data.guilds) {
    expectedGuilds.add(guild.id);
    guild.shardId = shardId;
    client.guilds._add(guild);
  }

  if (expectedGuilds.size) {
    client.expectedGuilds.set(shardId, expectedGuilds);
  } else {
    client.expectedGuilds.delete(shardId);
  }

  for (const guild of client.guilds.cache.values()) {
    if (guild.shardId === shardId && !expectedGuilds.has(guild.id)) {
      client.actions.GuildDelete.handle(guild);
    }
  }

  if (client.application) {
    client.application._patch(data.application);
  } else {
    client.application = new ClientApplication(client, data.application);
  }

  client.status = Status.WaitingForGuilds;
};
