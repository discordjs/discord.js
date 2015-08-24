var User = require( "./user.js" ).User;
var List = require( "./list.js" ).List;
var PMChannel = require( "./PMChannel.js" ).PMChannel;

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
		this.author = author;
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
}

/*exports.Message.prototype.isPM = function() {
	return ( this.channel instanceof PMChannel );
}*/

module.exports = Message;