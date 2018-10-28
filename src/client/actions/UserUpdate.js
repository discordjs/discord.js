const Action = require('./Action');
const { Events } = require('../../util/Constants');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const oldUser = client.users.get(data.user.id)._update(data.user);
    const newUser = client.users.get(data.user.id);

    if (!oldUser.equals(newUser)) {
      client.emit(Events.USER_UPDATE, oldUser, newUser);
      return {
        old: oldUser,
        updated: newUser,
      };
    }

    if (client.user) {
      if (client.user.equals(data)) {
        return {
          old: client.user,
          updated: client.user,
        };
      }
      const oldClient = client.user._update(data);
      return {
        old: oldClient,
        updated: client.user,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = UserUpdateAction;
