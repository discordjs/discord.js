const DataStore = require('./DataStore');
let Message;

class MessageStore extends DataStore {
  constructor(...args) {
    super(...args);
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
}

module.exports = MessageStore;
