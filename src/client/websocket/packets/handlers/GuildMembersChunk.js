'use strict';

// ##untested##

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

class GuildMembersChunkHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;
		let guild = client.store.get('guilds', data.guild_id);

		let members = [];
		if (guild) {
			for (let member of guild.members) {
				members.push(guild._addMember(member, true));
			}
		}

		client.emit(Constants.Events.GUILD_MEMBERS_CHUNK, guild, members);
	}

};

module.exports = GuildMembersChunkHandler;
