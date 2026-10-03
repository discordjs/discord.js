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

  for (const guild of data.guilds) {
    client.expectedGuilds.add(guild.id);
    guild.shardId = shardId;
    client.guilds._add(guild);
  }

  if (client.application) {
    client.application._patch(data.application);
  } else {
    client.application = new ClientApplication(client, data.application);
  }

  client.status = Status.WaitingForGuilds;
};
