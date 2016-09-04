const AbstractHandler = require('./AbstractHandler');

const getStructure = name => require(`../../../../structures/${name}`);
const ClientUser = getStructure('ClientUser');

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyTime = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.dataManager.newGuild(guild);
    for (const privateDM of data.private_channels) client.dataManager.newChannel(privateDM);

    if (!client.user.bot) client.setInterval(client.syncGuilds.bind(client), 30000);
    client.once('ready', client.syncGuilds.bind(client));

    client.setTimeout(() => {
      if (!client.ws.normalReady) client.ws._emitReady(false);
    }, 1200 * data.guilds.length);

    this.packetManager.ws.sessionID = data.session_id;
    this.packetManager.ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
