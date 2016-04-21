'use strict';

class Message {
	constructor(channel, data, client) {
		this.channel = channel;

		if (channel.guild) {
			this.guild = channel.guild;
		}

		this.client = client;
		if (data) {
			this.setup(data);
		}
	}

	setup(data) {
		this.author = this.client.store.NewUser(data.author);
		this.content = data.content;
		this.timestamp = new Date(data.timestamp);
		this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
		this.tts = data.tts;
		this.mentionEveryone = data.mention_everyone;
		this.nonce = data.nonce;
		this.embeds = data.embeds;
		this.attachments = data.attachments;
		this.mentions = [];
		this.id = data.id;
		for (let mention of data.mentions) {
			let user = this.client.store.get('users', mention.id);
			if (user) {
				this.mentions.push(user);
			} else {
				user = this.client.store.NewUser(mention);
				this.mentions.push(user);
			}
		}
	}

	patch(data) {
		if (data.author)
			this.author = this.client.store.get('users', data.author.id);
		if (data.content)
			this.content = data.content;
		if (data.timestamp)
			this.timestamp = new Date(data.timestamp);
		if (data.edited_timestamp)
			this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
		if (data.tts)
			this.tts = data.tts;
		if (data.mention_everyone)
			this.mentionEveryone = data.mention_everyone;
		if (data.nonce)
			this.nonce = data.nonce;
		if (data.embeds)
			this.embeds = data.embeds;
		if (data.attachments)
			this.attachments = data.attachments;
		if (data.mentions) {
			for (let mention of data.mentions) {
				let user = this.client.store.get('users', mention.id);
				if (user) {
					this.mentions.push(user);
				} else {
					user = this.client.store.NewUser(mention);
					this.mentions.push(user);
				}
			}
		}

		if (data.id)
			this.id = data.id;
	}

	delete() {
		return this.client.rest.methods.DeleteMessage(this.channel, this);
	}
}

module.exports = Message;
