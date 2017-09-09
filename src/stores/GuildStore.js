const DataStore = require('./DataStore');
const Guild = require('../structures/Guild');
/**
 * Stores guilds.
 * @private
 * @extends {DataStore}
 */
class GuildStore extends DataStore {
  create(data, cache = true) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const guild = new Guild(this.client, data);
    if (cache) this.set(guild.id, guild);

    return guild;
  }
}

module.exports = GuildStore;
