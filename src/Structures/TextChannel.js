"use strict";

import ServerChannel from "./ServerChannel";
import Cache from "../Util/Cache";
import {reg} from "../Util/ArgumentRegulariser";

export default class TextChannel extends ServerChannel{
	constructor(data, client, server){
		super(data, client, server);

		this.topic = data.topic;
		this.lastMessageID = data.last_message_id;
		this.messages = new Cache("id", client.options.maximumMessages);
	}

	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}

	setTopic(){
		return this.client.setTopic.apply(this.client, reg(this, arguments));
	}

	setNameAndTopic(){
		return this.client.setChannelNameAndTopic.apply(this.client, reg(this, arguments));
	}

	update(){
		return this.client.updateChannel.apply(this.client, reg(this, arguments));
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
}
