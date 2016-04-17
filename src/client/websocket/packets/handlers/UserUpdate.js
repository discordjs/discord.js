'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const CloneObject = name => require(`../../../../util/CloneObject`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');
const DMChannel = Structure('DMChannel');

class UserUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let user = client.store.user;

		if (!user) {
			return;
		}

		let oldUser = CloneObject(user);

		user.username = data.username || user.username;
		user.id = data.id || user.id;
		user.avatar = data.avatar || user.avatar;
		user.discriminator = data.discriminator || user.discriminator;
		user.email = data.email || user.email;
		user.verified = data.verified || user.verified;

		client.emit(Constants.Events.USER_UPDATE, oldUser, user);

	}

};

module.exports = UserUpdateHandler;
