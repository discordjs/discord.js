const AbstractHandler = require('./AbstractHandler');

const Constants = require('../../../../util/Constants');

class ChannelDeleteHandler extends AbstractHandler {

  handle(packet) {
    const data = packet.d;
    const client = this.packetManager.client;

    const response = client.actions.ChannelDelete.handle(data);

    if (response.channel) {
      client.emit(Constants.Events.CHANNEL_DELETE, response.channel);
    }
  }

}

module.exports = ChannelDeleteHandler;
