"use strict";

var ServerChannel = require("./ServerChannel.js");
var Cache = require("../Util/Cache.js");

class TextChannel extends ServerChannel{
	constructor(data, client){
		super(data, client);
		
		this.name = data.name;
		this.topic = data.topic;
		this.position = data.position;
		this.lastMessageID = data.last_message_id;
		this.messages = new Cache("id", client.options.maximumMessages);
	}
	
	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}
}

module.exports = TextChannel;