const DataStore = require('./DataStore');
const Guild = require('../structures/Guild');
/**
 * Stores guilds.
 * @private
 * @extends {DataStore}
 */
class GuildStore extends DataStore {
  constructor(...args) {
    super(...args);
    Object.defineProperty(this, 'holds', { value: Guild });
  }
}

module.exports = GuildStore;
