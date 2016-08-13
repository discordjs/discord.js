// ##untested handler##

const AbstractHandler = require('./AbstractHandler');

class GuildMemberRemoveHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    client.actions.GuildMemberRemove.handle(data);
  }

}

module.exports = GuildMemberRemoveHandler;
