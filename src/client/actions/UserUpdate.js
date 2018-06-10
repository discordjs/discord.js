const Action = require('./Action');
const { Events } = require('../../util/Constants');
const User = require('../../structures/User');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const newUser = new User(client, data.user);
    const oldUser = new User(client, client.users.get(data.user.id));
    client.users.set(newUser.id, newUser);

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
