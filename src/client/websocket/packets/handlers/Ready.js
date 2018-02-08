const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');
let ClientUser;

class ReadyHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;

    packet.shard.heartbeat();

    data.user.user_settings = data.user_settings;
    data.user.user_guild_settings = data.user_guild_settings;

    if (!ClientUser) ClientUser = require('../../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.readyAt = new Date();
    client.users.set(clientUser.id, clientUser);

    for (const guild of data.guilds) {
      guild.shard = data.shard;
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

    const t = client.setTimeout(() => {
      packet.shard.triggerReady();
    }, 1200 * data.guilds.length);

    client.setMaxListeners(data.guilds.length + 10);

    client.once('ready', () => {
      client.syncGuilds();
      client.setMaxListeners(10);
      client.clearTimeout(t);
    });

    const shard = packet.shard;

    shard.sessionID = data.session_id;
    shard._trace = data._trace;
    client.emit(Events.DEBUG, `SHARD ${shard.id} READY ${shard._trace.join(' -> ')} ${shard.sessionID}`);
    shard.checkIfReady();
  }
}

module.exports = ReadyHandler;
