"use strict";

var Equality = require("../Util/Equality.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;

class Channel extends Equality{

	constructor(data, client){
		super();
		this.id = data.id;
		this.client = client;
	}

	delete(){
		return this.client.deleteChannel.apply(this.client, reg(this, arguments));
	}
	
	sendMessage(){
		return this.client.sendMessage.apply(this.client, reg(this, arguments));
	}
	
	sendTTSMessage(){
		return this.client.sendTTSMessage.apply(this.client, reg(this, arguments));
	}

}

module.exports = Channel;