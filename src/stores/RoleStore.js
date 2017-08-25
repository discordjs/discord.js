const DataStore = require('./DataStore');
const Role = require('../structures/Role');
/**
 * Stores roles.
 * @private
 * @extends {DataStore}
 */
class RoleStore extends DataStore {
  constructor(guild, iterable) {
    super(guild.client, iterable);
    this.guild = guild;
  }

  create(data) {
    const existing = this.get(data.id);
    if (existing) return existing;

    const role = new Role(this.guild, data);
    this.set(role.id, role);

    return role;
  }
}

module.exports = RoleStore;
