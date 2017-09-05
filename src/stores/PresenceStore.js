const DataStore = require('./DataStore');
const { Presence } = require('../structures/Presence');

class PresenceStore extends DataStore {
  constructor(...args) {
    super(...args);
    this.maxSize = this.client.options.cacheLimits.presences;
  }

  create(data) {
    if (this.has(data.user.id)) {
      this.get(data.user.id).patch(data);
    } else {
      this.set(data.user.id, new Presence(this.client, data));
    }
    return this.get(data.user.id);
  }
}

module.exports = PresenceStore;
