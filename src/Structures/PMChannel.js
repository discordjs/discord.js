"use strict";

import Channel from "./Channel";
import User from "./User";
import Cache from "../Util/Cache";
import {reg} from "../Util/ArgumentRegulariser";

export default class PMChannel extends Channel {
	constructor(data, client){
		super(data, client);

		this.type = data.type || "text";
		this.lastMessageID = data.last_message_id || data.lastMessageID;
		this.messages = new Cache("id", client.options.maxCachedMessages);
		this.recipient = this.client.internal.users.add(new User(data.recipient, this.client));
	}

	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}

	toString(){
		return this.recipient.toString();
	}

	toObject() {
		let keys = ['type', 'lastMessageID', 'recipient'],
			obj = {};

		for (let k of keys) {
			obj[k] = this[k];
		}

		return obj;
	}

	sendMessage(){
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	send() {
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	sendTTSMessage(){
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

	sendTTS() {
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

	sendFile() {
		return this.client.sendFile.apply(this.client, reg(this, arguments));
	}

	startTyping() {
		return this.client.startTyping.apply(this.client, reg(this, arguments));
	}

	stopTyping() {
		return this.client.stopTyping.apply(this.client, reg(this, arguments));
	}

	getLogs() {
		return this.client.getChannelLogs.apply(this.client, reg(this, arguments));
	}

	getMessage() {
		return this.client.getMessage.apply(this.client, reg(this, arguments));
	}
}
