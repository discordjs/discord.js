const DataStore = require('./DataStore');
const User = require('../structures/User');

class UserStore extends DataStore {
  create(data) {
    super.create();
    if (this.has(data.id)) return this.get(data.id);
    const user = new User(this.client, data);
    return user;
  }

  remove(id) {
    this.delete(id);
  }
}

module.exports = UserStore;
