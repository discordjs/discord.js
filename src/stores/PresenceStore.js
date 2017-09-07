const DataStore = require('./DataStore');
const { Presence } = require('../structures/Presence');

class PresenceStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Presence);
  }

  create(data, cache) {
    const existing = this.get(data.user.id);
    return existing ? existing.patch(data) : super.create(data, cache);
  }
}

module.exports = PresenceStore;
