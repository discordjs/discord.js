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
  for (const privateDM of data.private_channels) client.channels.add(privateDM);

  for (const relation of data.relationships) {
    const user = client.users.add(relation.user);
    if (relation.type === 1) {
      client.user.friends.set(user.id, user);
    } else if (relation.type === 2) {
      client.user.blocked.set(user.id, user);
    }
  }

  for (const presence of data.presences || []) client.presences.add(presence);

  if (data.notes) {
    for (const user in data.notes) {
      let note = data.notes[user];
      if (!note.length) note = null;

      client.user.notes.set(user, note);
    }
  }

  if (!client.users.has('1')) {
    client.users.add({
      id: '1',
      username: 'Clyde',
      discriminator: '0000',
      avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
      bot: true,
      status: 'online',
      activity: null,
      verified: true,
    });
  }

  client.ws.checkReady();
};
