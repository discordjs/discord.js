"use strict";

var Channel = require("./Channel.js");
var Equality = require("../Util/Equality.js");

class PMChannel extends Equality{
	constructor(data, client){
		super();
		this.client = client;
		
		this.type = data.type || "text";
		this.id = data.id;
		this.lastMessageId = data.last_message_id;
		this.recipient = this.client.internal.users.add(data.recipient);
	}
	
	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}
}

module.exports = PMChannel;