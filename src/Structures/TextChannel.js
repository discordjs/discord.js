"use strict";

var Channel = require("./Channel.js");
var Cache = require("../Util/Cache.js");

class TextChannel extends Channel{
	constructor(data, client){
		
		super(data, client);
		this.messages = new Cache("id", client.options.maximumMessages);
	
	}
}

module.exports = TextChannel;