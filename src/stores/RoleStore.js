const DataStore = require('./DataStore');
const Role = require('../structures/Role');
/**
 * Stores roles.
 * @private
 * @extends {DataStore}
 */
class RoleStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable, Role);
    this.guild = guild;
  }

  create(data, cache) {
    super.create(data, cache, this.guild);
  }
}

module.exports = RoleStore;
