"use strict";

var Channel = require("./Channel.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");

class TextChannel extends Channel{
	constructor(data, client){
		super(data, client);
		
		this.name = data.name;
		this.topic = data.topic;
		this.position = data.position;
		this.lastMessageID = data.last_message_id;
		this.messages = new Cache("id", client.options.maximumMessages);
		
		this.permissionOverwrites = new Cache();
		data.permission_overwrites.forEach((permission) => {
			this.permissionOverwrites.add( new PermissionOverwrite(permission) );
		});
	}
	
	/* warning! may return null */
	get lastMessage(){
		return this.messages.get("id", this.lastMessageID);
	}
}

module.exports = TextChannel;