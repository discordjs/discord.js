"use strict";

var Cache = require("../Util/Cache.js");
var User = require("./User.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;

class Message{
	constructor(data, channel, client){
		this.channel = channel;
		this.client = client;
		this.nonce = data.nonce;
		this.attachments = data.attachments;
		this.tts = data.tts;
		this.embeds = data.embeds;
		this.timestamp = Date.parse(data.timestamp);
		this.everyoneMentioned = data.mention_everyone;
		this.id = data.id;

		if(data.edited_timestamp)
			this.editedTimestamp = Date.parse(data.edited_timestamp);

		if(data.author instanceof User)
			this.author = data.author;
		else
			this.author = client.internal.users.add(new User(data.author, client));

		this.content = data.content;
		this.mentions = new Cache();

		data.mentions.forEach((mention) => {
			// this is .add and not .get because it allows the bot to cache
			// users from messages from logs who may have left the server and were
			// not previously cached.
			if(mention instanceof User)
				this.mentions.push(mention);
			else
				this.mentions.add(client.internal.users.add(new User(mention, client)));
		});
	}

	toString(){
		return this.content;
	}
}

module.exports = Message;