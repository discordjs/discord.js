const Action = require('./Action');

class UserGetAction extends Action {
  handle(data) {
    const client = this.client;
    const user = client.users.create(data);
    return { user };
  }
}

module.exports = UserGetAction;
