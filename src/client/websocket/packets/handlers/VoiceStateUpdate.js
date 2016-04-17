'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');

const Role = Structure('User');

class VoiceStateUpdateHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;
		let guild = client.store.get('guilds', data.guild_id);

		if (guild) {
			let member = guild.store.get('members', data.user_id);
			let channel = guild.store.get('channels', data.channel_id);
			if (member) {
				let oldVoiceChannelMember = CloneObject(member);
				if (member.voiceChannel && member.voiceChannel.id !== data.channel_id) {
					member.voiceChannel.store.remove('members', oldVoiceChannelMember);
				}

				member.serverMute = data.mute;
				member.serverDeaf = data.deaf;
				member.selfMute = data.self_mute;
				member.selfDeaf = data.self_deaf;
				member.voiceSessionID = data.session_id;
				member.voiceChannelID = data.channel_id;
				client.emit(Constants.Events.VOICE_STATE_UPDATE, oldVoiceChannelMember, member);
			}
		}
	}

};

module.exports = VoiceStateUpdateHandler;
