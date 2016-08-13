const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class UserUpdateAction extends Action {

  handle(data) {
    const client = this.client;

    if (client.store.user) {
      if (client.store.user.equals(data)) {
        return {
          old: client.store.user,
          updated: client.store.user,
        };
      }

      const oldUser = cloneObject(client.store.user);
      client.store.user.setup(data);

      client.emit(Constants.Events.USER_UPDATE, oldUser, client.store.user);

      return {
        old: oldUser,
        updated: client.store.user,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

module.exports = UserUpdateAction;
