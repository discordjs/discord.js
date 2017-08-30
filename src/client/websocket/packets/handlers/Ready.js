const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');
const ClientUser = require('../../../../structures/ClientUser');

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    client.ws.heartbeat();

    data.user.user_settings = data.user_settings;
    data.user.user_guild_settings = data.user_guild_settings;

    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) client.guilds.create(guild);
    for (const privateDM of data.private_channels) client.channels.create(privateDM);

    for (const relation of data.relationships) {
      const user = client.users.create(relation.user);
      if (relation.type === 1) {
        client.user.friends.set(user.id, user);
      } else if (relation.type === 2) {
        client.user.blocked.set(user.id, user);
      }
    }

    for (const presence of data.presences || []) client.presences.create(presence);

    if (data.notes) {
      for (const user in data.notes) {
        let note = data.notes[user];
        if (!note.length) note = null;

        client.user.notes.set(user, note);
      }
    }

    if (!client.users.has('1')) {
      client.users.create({
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
      client.syncGuilds();
      client.setMaxListeners(10);
      client.clearTimeout(t);
    });

    const ws = this.packetManager.ws;

    ws.sessionID = data.session_id;
    ws._trace = data._trace;
    client.emit(Constants.Events.DEBUG, `READY ${ws._trace.join(' -> ')} ${ws.sessionID}`);
    ws.checkIfReady();
  }
}

module.exports = ReadyHandler;
