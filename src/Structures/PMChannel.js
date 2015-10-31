"use strict";

var Channel = require("./Channel.js");
var Equality = require("../Util/Equality.js");

class PMChannel extends Channel{
	constructor(data, client){
		super(data, client);
	}
}

module.exports = PMChannel;