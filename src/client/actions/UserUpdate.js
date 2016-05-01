'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const CloneObject = require('../../util/CloneObject');
const Message = require('../../structures/Message');

class UserUpdateAction extends Action {

	constructor(client) {
		super(client);
	}

	handle(data) {

		let client = this.client;

		if (client.store.user) {
			if (client.store.user.equals(data)) {
				return {
					old: client.store.user,
					updated: client.store.user,
				};
			}

			let oldUser = CloneObject(client.store.user);
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
};

module.exports = UserUpdateAction;
