const Message = require('../structures/Message');

function StaticMessage(client, channel, id) {
  return {
    id, client, channel,
    delete() {
      return client.api.channels(channel.id).messages(id).delete();
    },
    fetch() {
      return client.api.channels(channel.id).messages(id).get()
        .then(d => new Message(this.channel, d));
    },
  };
}

module.exports = StaticMessage;
