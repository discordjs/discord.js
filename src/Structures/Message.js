"use strict";

import Cache from "../Util/Cache";
import User from "./User";
import {reg} from "../Util/ArgumentRegulariser";
import Equality from "../Util/Equality";

export default class Message extends Equality{
	constructor(data, channel, client) {
		super();
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

	isMentioned(user){
		user = this.client.internal.resolver.resolveUser(user);
		if (user) {
			return this.mentions.has("id", user.id);
		} else {
			return false;
		}
	}

	toString(){
		return this.content;
	}

	delete(){
		return this.client.deleteMessage.apply(this.client, reg(this, arguments));
	}

	update(){
		return this.client.updateMessage.apply(this.client, reg(this, arguments));
	}

	edit() {
		return this.client.updateMessage.apply(this.client, reg(this, arguments));
	}

	reply(){
		return this.client.reply.apply(this.client, reg(this, arguments));
	}

	replyTTS(){
		return this.client.replyTTS.apply(this.client, reg(this, arguments));
	}

	get sender(){
		return this.author;
	}
}
