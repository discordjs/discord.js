'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const ClientUser = require('../../structures/ClientUser');

class UserUpdateAction extends Action {
  handle(data) {
    const client = this.client;

    const newUser = client.users.cache.get(data.id);
    const oldUser = newUser._update(data);

    if (!oldUser.equals(newUser)) {
      /**
       * Emitted whenever the client user's details (e.g. username) are changed.
       * @event Client#userUpdate
       * @param {ClientUser} oldUser The user before the update
       * @param {ClientUser} newUser The user after the update
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
