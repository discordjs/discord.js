const AbstractHandler = require('./AbstractHandler');

const getStructure = name => require(`../../../../structures/${name}`);
const ClientUser = getStructure('ClientUser');

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.dataManager.newGuild(guild);
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

    if (!client.user.bot && client.options.sync) client.setInterval(client.syncGuilds.bind(client), 30000);
    client.once('ready', client.syncGuilds.bind(client));

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
      if (!client.ws.normalReady) client.ws._emitReady(false);
    }, 1200 * data.guilds.length);

    this.packetManager.ws.sessionID = data.session_id;
    this.packetManager.ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
