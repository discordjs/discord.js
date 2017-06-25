const Constants = require('../util/Constants');
const Util = require('../util/Util');

class ClientDataManager {
  constructor(client) {
    this.client = client;
  }

  updateEmoji(currentEmoji, newData) {
    const oldEmoji = Util.cloneObject(currentEmoji);
    currentEmoji.setup(newData);
    this.client.emit(Constants.Events.GUILD_EMOJI_UPDATE, oldEmoji, currentEmoji);
    return currentEmoji;
  }
}

module.exports = ClientDataManager;
