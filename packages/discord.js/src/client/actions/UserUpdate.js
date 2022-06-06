'use strict';

const Action = require('./Action');
const Events = require('../../util/Events');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    if (data.user.id !== client.users.me.id) return { old: null, updated: null };

    const newUser = client.users.me;
    const oldUser = newUser._update(data);

    /**
     * Emitted whenever the client user's details (e.g. username) are changed.
     * @event Client#userUpdate
     * @param {ClientUser} oldUser The user before the update
     * @param {ClientUser} newUser The user after the update
     */
    client.emit(Events.UserUpdate, oldUser, newUser);
    return {
      old: oldUser,
      updated: newUser,
    };
  }
}

module.exports = UserUpdateAction;
