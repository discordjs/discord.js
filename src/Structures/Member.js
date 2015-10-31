"use strict";

var User = require("./User.js");

class Member extends User{
	constructor(data, client, server){
		super(data, client);
		this.serverID = server;
	}
	
	get server(){
		return this.client.internal.servers.get("id", this.serverID);
	}
}

module.exports = Member;