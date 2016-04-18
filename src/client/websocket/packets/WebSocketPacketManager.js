'use strict';

const Constants = require('../../../util/Constants');

const BeforeReadyWhitelist = [
	Constants.WSEvents.READY,
	Constants.WSEvents.GUILD_CREATE,
	Constants.WSEvents.GUILD_DELETE,
];

var amount = 0;

class WebSocketPacketManager {

	constructor(websocketManager) {
		this.ws = websocketManager;
		this.handlers = {};
		this.queue = [];

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
		this.register(Constants.WSEvents.GUILD_MEMBERS_CHUNK, 'GuildMembersChunk');
		this.register(Constants.WSEvents.CHANNEL_CREATE, 'ChannelCreate');
		this.register(Constants.WSEvents.CHANNEL_DELETE, 'ChannelDelete');
		this.register(Constants.WSEvents.CHANNEL_UPDATE, 'ChannelUpdate');
		this.register(Constants.WSEvents.PRESENCE_UPDATE, 'PresenceUpdate');
		this.register(Constants.WSEvents.USER_UPDATE, 'UserUpdate');
		this.register(Constants.WSEvents.VOICE_STATE_UPDATE, 'VoiceStateUpdate');
		this.register(Constants.WSEvents.TYPING_START, 'TypingStart');
	}

	get client() {
		return this.ws.client;
	}

	register(event, handle) {
		let Handler = require(`./handlers/${handle}`);
		this.handlers[event] = new Handler(this);
	}

	handleQueue() {
		for (let packetIndex in this.queue) {
			this.handle(this.queue[packetIndex]);
			this.queue.splice(packetIndex, 1);
		}
	}

	handle(packet) {
		amount++;
		if (!this.ws.emittedReady) {
			if (BeforeReadyWhitelist.indexOf(packet.t) === -1) {
				this.queue.push(packet);
				return;
			}
		}

		if (this.handlers[packet.t]) {
			return this.handlers[packet.t].handle(packet);
		}

		return false;
	}

}

module.exports = WebSocketPacketManager;
