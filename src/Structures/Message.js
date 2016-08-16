"use strict";

/**
 * Options that can be applied to a message before sending it.
 * @typedef {(object)} MessageOptions
 * @property {boolean} [tts=false] Whether or not the message should be sent as text-to-speech.
*/

import Cache from "../Util/Cache";
import User from "./User";
import {reg} from "../Util/ArgumentRegulariser";
import Equality from "../Util/Equality";

export default class Message extends Equality{
	constructor(data, channel, client) {
		super();
		this.channel = channel;
		this.server = channel.server;
		this.client = client;
		this.nonce = data.nonce;
		this.attachments = data.attachments;
		this.tts = data.tts;
		this.embeds = data.embeds;
		this.timestamp = Date.parse(data.timestamp);
		this.everyoneMentioned = data.mention_everyone !== undefined ? data.mention_everyone : data.everyoneMentioned;
		this.pinned = data.pinned;
		this.id = data.id;

		if(data.edited_timestamp) {
			this.editedTimestamp = Date.parse(data.edited_timestamp);
		}

		if(data.author instanceof User) {
			this.author = data.author;
		} else if(data.author) {
			this.author = client.internal.users.add(new User(data.author, client));
		}

		this.content = data.content;

		var mentionData = client.internal.resolver.resolveMentions(data.content, channel);
		this.cleanContent = mentionData[1];
		this.mentions = [];

		mentionData[0].forEach((mention) => {
			// this is .add and not .get because it allows the bot to cache
			// users from messages from logs who may have left the server and were
			// not previously cached.
			if(mention instanceof User) {
				this.mentions.push(mention);
			} else {
				this.mentions.push(client.internal.users.add(new User(mention, client)));
			}
		});
	}

	get sender(){
		return this.author;
	}

	toObject() {
		let keys = ['id', 'timestamp', 'everyoneMentioned', 'pinned', 'editedTimestamp', 'content', 'cleanContent', 'tts', 'attachments', 'embeds'],
			obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		obj.channelID = this.channel ? this.channel.id : null;
		obj.serverID = this.server ? this.server.id : null;
		obj.author = this.author.toObject();
		obj.mentions = this.mentions.map(m => m.toObject());

		return obj;
	}

	isMentioned(user){
		user = this.client.internal.resolver.resolveUser(user);
		if (!user) {
			return false
		}
		for (var mention of this.mentions) {
			if (mention.id == user.id) {
				return true;
			}
		}
		return false;
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

	pin() {
		return this.client.pinMessage.apply(this.client, reg(this, arguments));
	}

	unpin() {
		return this.client.unpinMessage.apply(this.client, req(this, arguments));
	}
}
