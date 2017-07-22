const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class MessageCreateHandler extends AbstractHandler {
  handle(packet) {
    const client = this.packetManager.client;
    const data = packet.d;
    const { message } = client.actions.MessageCreate.handle(data);
    if (message) {
      const { autofetch } = client.options;
      if (message.guild && autofetch && autofetch.includes(Constants.WSEvents.MESSAGE_CREATE)) {
        const fetchList = [];
        if (!message.member && !message.webhookID) fetchList.push(message.author.id);

        data.mentions.forEach(user => {
          if (!message.guild.members.get(user.id)) fetchList.push(user.id);
        });

        if (fetchList.length) {
          // Emit create event regardless if members are fetched successfully
          Promise.all(fetchList.map(user => message.guild.fetchMember(user)))
          .then(() => client.emit(Constants.Events.MESSAGE_CREATE, message))
          .catch(() => client.emit(Constants.Events.MESSAGE_CREATE, message));
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
