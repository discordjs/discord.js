'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

const Role = Structure('User');

class PresenceUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;
		let user = client.store.get('users', data.user.id);
		let guild = client.store.get('guilds', data.guild_id);

		function makeUser(user) {
			return client.store.NewUser(user);
		}

		// step 1
		if (!user) {
			if (data.user.username) {
				user = makeUser(data.user);
			}else {
				return;
			}
		}

		if (guild) {
			let memberInGuild = guild.store.get('members', user.id);
			if (!memberInGuild) {
				let member = guild._addMember({
					user,
					roles: data.roles,
					deaf: false,
					mute: false,
				}, true);
				client.emit(Constants.Events.GUILD_MEMBER_AVAILABLE, guild, member);
			}
		}

		data.user.username = data.user.username || user.username;
		data.user.id = data.user.id || user.id;
		data.user.discriminator = data.user.discriminator || user.discriminator;

		// comment out avatar patching as it causes bugs (see #297)
		// data.user.avatar = data.user.avatar || user.avatar;
		data.user.status = data.status || user.status;
		data.user.game = data.game;

		let same = (
			data.user.username === user.username &&
			data.user.id === user.id &&
			data.user.discriminator === user.discriminator &&
			data.user.avatar === user.avatar &&
			data.user.status === user.status &&
			!(
				(data.user.game && !user.game) ||
				(!data.user.game && user.game) ||
				(data.user.game && user.game && data.user.game.name !== user.game.name)
			)
		);

		if (!same) {
			let oldUser = CloneObject(user);
			user.setup(data.user);
			client.emit(Constants.Events.PRESENCE_UPDATE, oldUser, user);
		}
	}

};

module.exports = PresenceUpdateHandler;
