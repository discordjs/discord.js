const AbstractDataStore = require('./AbstractDataStore');

class GuildDataStore extends AbstractDataStore {
  constructor() {
    super();

    this.register('members');
    this.register('channels');
  }
}

module.exports = GuildDataStore;
