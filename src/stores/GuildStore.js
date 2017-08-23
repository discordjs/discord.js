const DataStore = require('./DataStore');
const Guild = require('../structures/Guild');

class GuildStore extends DataStore {
  create(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const guild = new Guild(this.client, data);
    this.set(guild.id, guild);

    return guild;
  }

  remove(id) {
    this.delete(id);
  }
}

module.exports = GuildStore;
