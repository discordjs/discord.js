const DataStore = require('./DataStore');
const Collection = require('../util/Collection');
let Message;

class MessageStore extends DataStore {
  constructor(channel, iterable) {
    super(channel.client, iterable);
    this.channel = channel;
    Message = require('../structures/Message');
  }

  create(data) {
    super.create();
    const existing = this.get(data.id);
    if (existing) return existing;

    const message = new Message(this.client.channels.get(data.channel_id), data, this.client);

    this.set(message.id, message);
    return message;
  }

  set(key, value) {
    super.set(key, value);
    const maxSize = this.client.options.messageCacheMaxSize;
    if (maxSize === 0) this.delete(key);
    if (this.size >= maxSize && maxSize > 0) this.delete(this.firstKey());
  }

  remove(id) {
    super.remove();
    this.delete(id);
  }

  fetch(message) {
    return typeof message === 'string' ? this._fetchId(message) : this._fetchMany(message);
  }

  _fetchId(messageID) {
    if (!this.client.user.bot) {
      return this._fetchMany({ limit: 1, around: messageID })
        .then(messages => {
          const msg = messages.get(messageID);
          if (!msg) throw new Error('MESSAGE_MISSING');
          return msg;
        });
    }
    return this.client.api.channels[this.channel.id].messages[messageID].get()
      .then(data => this.create(data));
  }

  _fetchMany(options = {}) {
    return this.client.api.channels[this.channel.id].messages.get({ query: options })
      .then(data => {
        const messages = new Collection();
        for (const message of data) messages.set(message.id, this.create(message));
        return messages;
      });
  }
}

module.exports = MessageStore;
