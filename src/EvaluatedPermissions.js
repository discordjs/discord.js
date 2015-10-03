class EvaluatedPermissions{
	constructor(data){
		
		var self = this;
		
		function getBit(x) {
			return ((self.packed >>> x) & 1) === 1;
		}
	
		this.packed = data;
		
		this.createInstantInvite = getBit(0);
		//this.banMembers = getBit(1);
		//this.kickMembers = getBit(2);
		this.managePermissions = getBit(3);
		this.manageChannels = getBit(4);
		//this.manageServer = getBit(5);
		this.readMessages = getBit(10);
		this.sendMessages = getBit(11);
		this.sendTTSMessages = getBit(12);
		this.manageMessages = getBit(13);
		this.embedLinks = getBit(14);
		this.attachFiles = getBit(15);
		this.readMessageHistory = getBit(16);
		this.mentionEveryone = getBit(17);
		
		this.voiceConnect = getBit(20);
		this.voiceSpeak = getBit(21);
		this.voiceMuteMembers = getBit(22);
		this.voiceDeafenMembers = getBit(23);
		this.voiceMoveMembers = getBit(24);
		this.voiceUseVoiceActivation = getBit(25);
		
	}
	
	getBit(x) {
		return ((this.packed >>> x) & 1) === 1;
	}
}

module.exports = EvaluatedPermissions;