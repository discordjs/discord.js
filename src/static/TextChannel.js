const Shared = require('../structures/Shared');
const Channel = require('../structures/Channel');

const StaticMessage = require('./Message');

function StaticTextChannel(client, id) {
  return {
    id, client,
    send(content, options) {
      if (content && typeof content === 'object') {
        options = content;
        content = null;
      }
      return Shared.sendMessage(this, Object.assign({ content }, options));
    },
    delete() {
      return client.api.channels(id).delete();
    },
    fetch() {
      return client.api.channels(id).get()
        .then(d => Channel.create(client, d));
    },
    Message: messageID => StaticMessage(client, id, messageID),
  };
}

module.exports = StaticTextChannel;
