const AbstractHandler = require('./AbstractHandler');

const ClientUser = require('../../../../structures/ClientUser');

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const ws = client.ws.managers.get(packet.shardID);

    ws.heartbeat();

    const clientUser = new ClientUser(client, data.user);
    clientUser.settings = data.user_settings;
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) {
      guild.shardID = packet.shardID;
      client.dataManager.newGuild(guild);
    }
    for (const privateDM of data.private_channels) client.dataManager.newChannel(privateDM);

    for (const relation of data.relationships) {
      const user = client.dataManager.newUser(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      }
    }

    data.presences = data.presences || [];
    for (const presence of data.presences) {
      client.dataManager.newUser(presence.user);
      client._setPresence(presence.user.id, presence);
    }

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.user.bot && client.options.sync) {
      client.setInterval(() => client.syncGuilds(client.guilds, ws.shardID), 30000);
    }

    ws.once('shardReady', () => client.syncGuilds(client.guilds, ws.shardID));

    if (!client.users.has('1')) {
      client.dataManager.newUser({
        id: '1',
        username: 'Clyde',
        discriminator: '0000',
        avatar: 'https://discordapp.com/assets/f78426a064bc9dd24847519259bc42af.png',
        bot: true,
        status: 'online',
        game: null,
        verified: true,
      });
    }

    client.setTimeout(() => {
      if (!ws.normalReady) ws._emitReady(false);
    }, 1200 * data.guilds.length);

    ws.sessionID = data.session_id;
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
