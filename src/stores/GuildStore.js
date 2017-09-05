const DataStore = require('./DataStore');
const Guild = require('../structures/Guild');
/**
 * Stores guilds.
 * @private
 * @extends {DataStore}
 */
class GuildStore extends DataStore {
  constructor(client, iterable) {
    super(client, iterable, Guild);
  }
}

module.exports = GuildStore;
