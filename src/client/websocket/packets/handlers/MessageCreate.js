const AbstractHandler = require('./AbstractHandler');
const Constants = require('../../../../util/Constants');

class MessageCreateHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const response = client.actions.MessageCreate.handle(data);

    if (response.m) {
      client.emit(Constants.Events.MESSAGE_CREATE, response.m);

      var awaitID = client._awaitingResponse[`${response.m.channel.id}/${response.m.author.id}`]
      if (awaitID) {
          awaitID(response.m);
          delete client._awaitingResponse[`${response.m.channel.id}/${response.m.author.id}`];
      };
    }
  }

}

/**
* Emitted whenever a message is created
*
* @event Client#message
* @param {Message} message The created message
*/

module.exports = MessageCreateHandler;
