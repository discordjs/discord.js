const AbstractHandler = require('./AbstractHandler');

const getStructure = name => require(`../../../../structures/${name}`);
const ClientUser = getStructure('ClientUser');

class ReadyHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.store.user = client.store.add('users', new ClientUser(client, data.user));

    for (const guild of data.guilds) {
      client.store.newGuild(guild);
    }

    for (const privateDM of data.private_channels) {
      client.store.newChannel(privateDM);
    }

    this.packetManager.ws.sessionID = data.session_id;

    this.packetManager.ws.checkIfReady();
  }

}

module.exports = ReadyHandler;
