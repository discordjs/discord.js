class ServerPermissions {

	constructor(data) {

		var self = this;

		function getBit(x) {
			return ((self.packed >>> x) & 1) === 1;
		}

		this.packed = data.permissions;
		this.name = data.name;
		this.id = data.id;

	}
	
	get createInstantInvite(){return this.getBit(0);}
	set createInstantInvite(val){this.setBit(0, val);}
	
	get banMembers(){return this.getBit(1);}
	set banMembers(val){this.setBit(1, val);}
	
	get kickMembers(){return this.getBit(2);}
	set kickMembers(val){this.setBit(2, val);}
	
	get manageRoles(){return this.getBit(3);}
	set manageRoles(val){this.setBit(3, val);}
	
	get manageChannels(){return this.getBit(4);}
	set manageChannels(val){this.setBit(4, val);}
	
	get manageServer(){return this.getBit(5);}
	set manageServer(val){this.setBit(5, val);}
	
	get readMessages(){return this.getBit(10);}
	set readMessages(val){this.setBit(10, val);}
	
	get sendMessages(){return this.getBit(11);}
	set sendMessages(val){this.setBit(11, val);}
	
	get sendTTSMessages(){return this.getBit(12);}
	set sendTTSMessages(val){this.setBit(12, val);}
	
	get manageMessages(){return this.getBit(13);}
	set manageMessages(val){this.setBit(13, val);}
	
	get embedLinks(){return this.getBit(14);}
	set embedLinks(val){this.setBit(14, val);}
	
	get attachFiles(){return this.getBit(15);}
	set attachFiles(val){this.setBit(15, val);}
	
	get readMessageHistory(){return this.getBit(16);}
	set readMessageHistory(val){this.setBit(16, val);}
	
	get mentionEveryone(){return this.getBit(17);}
	set mentionEveryone(val){this.setBit(17, val);}
	
	get voiceConnect(){return this.getBit(20);}
	set voiceConnect(val){this.setBit(20, val);}
	
	get voiceSpeak(){return this.getBit(21);}
	set voiceSpeak(val){this.setBit(21, val);}
	
	get voiceMuteMembers(){return this.getBit(22);}
	set voiceMuteMembers(val){this.setBit(22, val);}
	
	get voiceDeafenMembers(){return this.getBit(23);}
	set voiceDeafenMembers(val){this.setBit(23, val);}
	
	get voiceMoveMembers(){return this.getBit(24);}
	set voiceMoveMembers(val){this.setBit(24, val);}
	
	get voiceUseVoiceActivation(){return this.getBit(25);}
	set voiceUseVoiceActivation(val){this.setBit(25, val);}

	getBit(x) {
		return ((this.packed >>> x) & 1) === 1;
	}
	
	setBit(){
		//dummy function for now
	}
	
	toString(){
		return this.name;
	}
}

module.exports = ServerPermissions;