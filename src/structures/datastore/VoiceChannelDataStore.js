const AbstractDataStore = require('./AbstractDataStore');

class VoiceChannelDataStore extends AbstractDataStore {
  constructor() {
    super();
    this.register('members');
  }
}

module.exports = VoiceChannelDataStore;
