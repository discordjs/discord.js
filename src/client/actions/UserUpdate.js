const Action = require('./Action');
const { Events } = require('../../util/Constants');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const newUser = client.users.get(data.user.id);
    const oldUser = newUser._update(data.user);

    if (!oldUser.equals(newUser)) {
      /**
         * Emitted whenever a user's details (e.g. username) are changed.
         * @event Client#userUpdate
         * @param {User} oldUser The user before the update
         * @param {User} newUser The user after the update
         */
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
