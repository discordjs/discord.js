'use strict';

const Constants = require('../../../util/Constants');

class WebSocketPacketManager {

	constructor(websocketManager) {
		this.ws = websocketManager;
		this.handlers = {};

		this.register(Constants.WSEvents.READY, 'Ready');
		this.register(Constants.WSEvents.GUILD_CREATE, 'GuildCreate');
		this.register(Constants.WSEvents.GUILD_DELETE, 'GuildDelete');
		this.register(Constants.WSEvents.GUILD_UPDATE, 'GuildUpdate');
		this.register(Constants.WSEvents.GUILD_BAN_ADD, 'GuildBanAdd');
		this.register(Constants.WSEvents.GUILD_BAN_REMOVE, 'GuildBanRemove');
		this.register(Constants.WSEvents.GUILD_MEMBER_ADD, 'GuildMemberAdd');
		this.register(Constants.WSEvents.GUILD_MEMBER_REMOVE, 'GuildMemberRemove');
		this.register(Constants.WSEvents.GUILD_MEMBER_UPDATE, 'GuildMemberUpdate');
		this.register(Constants.WSEvents.GUILD_ROLE_CREATE, 'GuildRoleCreate');
		this.register(Constants.WSEvents.GUILD_ROLE_DELETE, 'GuildRoleDelete');
		this.register(Constants.WSEvents.GUILD_ROLE_UPDATE, 'GuildRoleUpdate');
		this.register(Constants.WSEvents.CHANNEL_CREATE, 'ChannelCreate');
		this.register(Constants.WSEvents.CHANNEL_DELETE, 'ChannelDelete');
		this.register(Constants.WSEvents.CHANNEL_UPDATE, 'ChannelUpdate');
	}

	get client() {
		return this.ws.client;
	}

	register(event, handle) {
		let Handler = require(`./handlers/${handle}`);
		this.handlers[event] = new Handler(this);
	}

	handle(packet) {
		if (this.handlers[packet.t]) {
			return this.handlers[packet.t].handle(packet);
		}

		return false;
	}

}

module.exports = WebSocketPacketManager;
