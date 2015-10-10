var PMChannel = require("./PMChannel.js");

class Message{
	constructor(data, channel, mentions, author){
		this.tts = data.tts;
		this.timestamp = Date.parse(data.timestamp);
		this.nonce = data.nonce;
		this.mentions = mentions;
		this.everyoneMentioned = data.mention_everyone;
		this.id = data.id;
		this.embeds = data.embeds;
		this.editedTimestamp = data.edited_timestamp;
		this.content = data.content.trim();
		this.channel = channel;
		
		if(this.isPrivate){
			this.author = this.channel.client.getUser("id", author.id);
		}else{
			this.author = this.channel.server.getMember("id", author.id) || this.channel.client.getUser("id", author.id);
		}
		
		this.attachments = data.attachments;
	}
	
	isMentioned( user ){
		var id = (user.id ? user.id : user);
		for(var mention of this.mentions){
			if(mention.id === id){
				return true;
			}
		}
		return false;
	}
	
	get sender(){
		return this.author;
	}
	
	get isPrivate(){
		return this.channel.isPrivate;
	}
}

/*exports.Message.prototype.isPM = function() {
	return ( this.channel instanceof PMChannel );
}*/

module.exports = Message;