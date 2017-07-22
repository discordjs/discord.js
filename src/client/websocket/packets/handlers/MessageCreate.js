const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class MessageCreateHandler extends AbstractHandler {
  async handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const { message } = client.actions.MessageCreate.handle(data);
    if (message) {
      if (message.guild && client.options.autofetch.includes(Constants.WSEvents.MESSAGE_CREATE)) {
        const fetchList = [];
        if (!message.member && !message.webhookID) fetchList.push(message.author.id);

        data.mentions.forEach(user => {
          if (!message.guild.members.get(user.id)) fetchList.push(user.id);
        });

        if (fetchList.length) {
          try {
            await Promise.all(fetchList.map(user => message.guild.fetchMember(user)));
          } finally {
            client.emit(Constants.Events.MESSAGE_CREATE, message);
          }
          return;
        }
      }
      client.emit(Constants.Events.MESSAGE_CREATE, message);
    }
  }
}

/**
 * Emitted whenever a message is created.
 * @event Client#message
 * @param {Message} message The created message
 */

module.exports = MessageCreateHandler;
