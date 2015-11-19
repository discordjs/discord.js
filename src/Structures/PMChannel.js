"use strict";

var Channel = require("./Channel.js");
var User = require("./User.js");
var Equality = require("../Util/Equality.js");
var Cache = require("../Util/Cache.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;

class PMChannel extends Equality{
	constructor(data, client){
		super();
		this.client = client;

		this.type = data.type || "text";
		this.id = data.id;
		this.lastMessageId = data.last_message_id;
		this.messages = new Cache("id", 1000);
		this.recipient = this.client.internal.users.add(new User(data.recipient, this.client));
	}

	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}

	toString(){
		return this.recipient.toString();
	}

	sendMessage(){
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}

	sendTTSMessage(){
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}
}

module.exports = PMChannel;