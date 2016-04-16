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

		if (guild) {
			let member = guild.store.get('members', data.user.id);
			if (member) {
				guild._updateMember(member, data);
			}
		}
	}

};

module.exports = GuildMemberUpdateHandler;
