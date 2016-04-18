'use strict';

class Message {
	constructor(serverChannel, data) {
		this.channel = serverChannel;
		this.guild = serverChannel.guild;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.author = this.guild.client.store.get('users', data.author.id);
		this.content = data.content;
		this.timestamp = new Date(data.timestamp);
		this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
		this.tts = data.tts;
		this.mentionEveryone = data.mention_everyone;
		this.nonce = data.nonce;
		this.embeds = data.embeds;
		this.attachments = data.attachments;
		this.mentions = [];
		for (let mention of data.mentions) {
			let user = this.guild.client.store.get('users', mention.id);
			if (user) {
				this.mentions.push(user);
			}
		}
	}
}

module.exports = Message;
