"use strict";

var Equality = require("../Util/Equality.js");

class Channel extends Equality{
	
	constructor(data, client){
		super();
		this.type = data.type || "text";
		this.id = data.id;
		this.client = client;	
	}
	
}

module.exports = Channel;