const AbstractHandler = require('./AbstractHandler');
const { Events } = require('../../../../util/Constants');

class MessageReactionAddHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const { user, reaction } = client.actions.MessageReactionAdd.handle(data);
    if (reaction) client.emit(Events.MESSAGE_REACTION_ADD, reaction, user);
  }
}

module.exports = MessageReactionAddHandler;
