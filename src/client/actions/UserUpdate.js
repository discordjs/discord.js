const Action = require('./Action');
const { Events } = require('../../util/Constants');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const newUser = client.users.get(data.user.id);
    const oldUser = newUser._update(data.user);

    if (!oldUser.equals(newUser)) {
      client.emit(Events.USER_UPDATE, oldUser, newUser);
      return {
        old: oldUser,
        updated: newUser,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = UserUpdateAction;
