const AbstractHandler = require('./AbstractHandler');

const getStructure = name => require(`../../../../structures/${name}`);
const ClientUser = getStructure('ClientUser');

class ReadyHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.users.set(clientUser.id, clientUser);
    for (const guild of data.guilds) {
      client.dataManager.newGuild(guild);
    }

    for (const privateDM of data.private_channels) {
      client.dataManager.newChannel(privateDM);
    }

    this.packetManager.ws.sessionID = data.session_id;

    this.packetManager.ws.checkIfReady('abc');
  }

}

module.exports = ReadyHandler;
