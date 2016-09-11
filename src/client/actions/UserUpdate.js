const Action = require('./Action');
const Constants = require('../../util/Constants');
const cloneObject = require('../../util/CloneObject');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    if (client.user) {
      if (client.user.equals(data)) {
        return {
          old: client.user,
          updated: client.user,
        };
      }

      const oldUser = cloneObject(client.user);
      client.user.patch(data);
      client.emit(Constants.Events.USER_UPDATE, oldUser, client.user);
      return {
        old: oldUser,
        updated: client.user,
      };
    }

    return {
      old: null,
      updated: null,
    };
  }
}

/**
 * Emitted whenever a detail of the logged in User changes - e.g. username.
 * @event Client#userUpdate
 * @param {ClientUser} oldClientUser The client user before the update.
 * @param {ClientUser} newClientUser The client user after the update.
 */

module.exports = UserUpdateAction;
