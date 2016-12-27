const Action = require('./Action');

class UserGetAction extends Action {
  handle(data, cache) {
    const client = this.client;
    const user = client.dataManager.newUser(data, cache);
    return {
      user,
    };
  }
}

module.exports = UserGetAction;
