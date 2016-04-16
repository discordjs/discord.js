'use strict';

// ##untested handler##

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');

const Constants = require('../../../../util/Constants');

class GuildMemberUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;

		let guild = client.store.get('guilds', data.guild_id);
		let user = client.store.get('users', data.user.id);

		if (guild) {
			guild._updateMember(user, data);
		}
	}

};

module.exports = GuildMemberUpdateHandler;
