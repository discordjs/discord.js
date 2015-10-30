class ChannelPermissions {
	constructor(data, channel) {

		var self = this;

		function getBit(x) {
			return ((self.packed >>> x) & 1) === 1;
		}

		this.type = data.type; //either member or role
		this.id = data.id;

		if (this.type === "member") {
			this.packed = channel.server.getMember("id", data.id).evalPerms.packed;
		} else {
			this.packed = channel.server.getRole("id", data.id).packed;
		}

		this.packed = this.packed & ~data.deny;
		this.packed = this.packed | data.allow;

		this.deny = data.deny;
		this.allow = data.allow;

	}

	serialise() {
		return {
			createInstantInvite: this.createInstantInvite,
			manageRoles: this.manageRoles,
			manageChannels: this.manageChannels,
			readMessages: this.readMessages,
			sendMessages: this.sendMessage,
			sendTTSMessages: this.sendTTSMessages,
			manageMessages: this.manageMessages,
			embedLinks: this.embedLinks,
			attachFiles: this.attachFiles,
			readMessageHistory: this.readMessageHistory,
			mentionEveryone: this.mentionEveryone,
			voiceConnect: this.voiceConnect,
			voiceSpeak: this.voiceSpeak,
			voiceMuteMembers: this.voiceMuteMembers,
			voiceDeafenMembers: this.voiceDeafenMembers,
			voiceMoveMember: this.voiceMoveMembers,
			voiceUseVoiceActivation: this.voiceUseVoiceActivation
		}
	}
	
	serialize(){
		return this.serialise();
	}

	get asAllowDisallow() {

		var allow = 0, disallow = 0;

		function ad(value, position) {
			if (value) {
				allow |= (1 << position);
			} else {
				disallow |= (1 << position);
			}
		}

		ad(this.createInstantInvite, 0);
		ad(this.manageRoles, 3);
		ad(this.manageChannels, 4);
		ad(this.readMessages, 10);
		ad(this.sendMessages, 11);
		ad(this.sendTTSMessages, 12);
		ad(this.manageMessages, 13);
		ad(this.embedLinks, 14);
		ad(this.attachFiles, 15);
		ad(this.readMessageHistory, 16);
		ad(this.mentionEveryone, 17);
		ad(this.voiceConnect, 20);
		ad(this.voiceSpeak, 21);
		ad(this.voiceMuteMembers, 22);
		ad(this.voiceDeafenMembers, 23);
		ad(this.voiceMoveMembers, 24);
		ad(this.voiceUseVoiceActivation, 25);


		return {
			allow : allow,
			deny : disallow
		};
	}

	get createInstantInvite() { return this.getBit(0); }
	set createInstantInvite(val) { this.setBit(0, val); }

	get manageRoles() { return this.getBit(3); }
	set manageRoles(val) { this.setBit(3, val); }

	get manageChannels() { return this.getBit(4); }
	set manageChannels(val) { this.setBit(4, val); }

	get readMessages() { return this.getBit(10); }
	set readMessages(val) { this.setBit(10, val); }

	get sendMessages() { return this.getBit(11); }
	set sendMessages(val) { this.setBit(11, val); }

	get sendTTSMessages() { return this.getBit(12); }
	set sendTTSMessages(val) { this.setBit(12, val); }

	get manageMessages() { return this.getBit(13); }
	set manageMessages(val) { this.setBit(13, val); }

	get embedLinks() { return this.getBit(14); }
	set embedLinks(val) { this.setBit(14, val); }

	get attachFiles() { return this.getBit(15); }
	set attachFiles(val) { this.setBit(15, val); }

	get readMessageHistory() { return this.getBit(16); }
	set readMessageHistory(val) { this.setBit(16, val); }

	get mentionEveryone() { return this.getBit(17); }
	set mentionEveryone(val) { this.setBit(17, val); }

	get voiceConnect() { return this.getBit(20); }
	set voiceConnect(val) { this.setBit(20, val); }

	get voiceSpeak() { return this.getBit(21); }
	set voiceSpeak(val) { this.setBit(21, val); }

	get voiceMuteMembers() { return this.getBit(22); }
	set voiceMuteMembers(val) { this.setBit(22, val); }

	get voiceDeafenMembers() { return this.getBit(23); }
	set voiceDeafenMembers(val) { this.setBit(23, val); }

	get voiceMoveMembers() { return this.getBit(24); }
	set voiceMoveMembers(val) { this.setBit(24, val); }

	get voiceUseVoiceActivation() { return this.getBit(25); }
	set voiceUseVoiceActivation(val) { this.setBit(25, val); }

	getBit(x) {
		if (((this.packed >>> 3) & 1) === 1) {
			return true;
		}
		return ((this.packed >>> x) & 1) === 1;
	}

	setBit(location, value) {

		if (value) {
			// allow that permission
			this.packed |= (1 << location);

		} else {
			// not allowed
			this.packed &= (1 << location);
		}

	}
}

module.exports = ChannelPermissions;