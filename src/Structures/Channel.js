"use strict";

var Equality = require("../Util/Equality.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");

class Channel extends Equality{

	constructor(data, client){
		super();
		this.id = data.id;
		this.client = client;
	}

	delete(){
		return this.client.internal.deleteChannel(this);
	}

}

module.exports = Channel;