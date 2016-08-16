"use strict";

import ServerChannel from "./ServerChannel";
import Cache from "../Util/Cache";
import {reg} from "../Util/ArgumentRegulariser";

export default class TextChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);

		this.topic = data.topic;
		this.lastMessageID = data.last_message_id || data.lastMessageID;
		this.messages = new Cache("id", client.options.maxCachedMessages);
	}

	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}

	toObject() {
		let obj = super.toObject();
		
		obj.topic = this.topic;
		obj.lastMessageID = this.lastMessageID;

		return obj;
	}

	setTopic(){
		return this.client.setChannelTopic.apply(this.client, reg(this, arguments));
	}

	sendMessage(){
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	send(){
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	sendTTSMessage(){
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

	sendTTS(){
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

	sendFile(){
		return this.client.sendFile.apply(this.client, reg(this, arguments));
	}

	getLogs(){
		return this.client.getChannelLogs.apply(this.client, reg(this, arguments));
	}

	getMessage() {
		return this.client.getMessage.apply(this.client, reg(this, arguments));
	}

	startTyping(){
		return this.client.startTyping.apply(this.client, reg(this, arguments));
	}

	stopTyping(){
		return this.client.stopTyping.apply(this.client, reg(this, arguments));
	}
}
