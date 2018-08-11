const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');
let ClientUser;

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    client.presence.userID = data.user.id;
    if (!ClientUser) ClientUser = require('../../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.guilds.add(guild);
    for (const privateDM of data.private_channels) client.channels.add(privateDM);

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

    const t = client.setTimeout(() => {
      client.ws.connection.triggerReady();
    }, 1200 * data.guilds.length);

    client.setMaxListeners(data.guilds.length + 10);

    client.once('ready', () => {
      client.setMaxListeners(10);
      client.clearTimeout(t);
    });

    const ws = this.packetManager.ws;

    ws.sessionID = data.session_id;
    ws._trace = data._trace;
    client.emit(Events.DEBUG, `READY ${ws._trace.join(' -> ')} ${ws.sessionID}`);
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
