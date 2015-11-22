"use strict";

var Equality = require("../Util/Equality.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");
var reg = require("../Util/ArgumentRegulariser.js").reg;

class Channel extends Equality {

	constructor(data, client) {
		super();
		this.id = data.id;
		this.client = client;
	}

	get isPrivate() {
		return !!this.server;
	}

	delete() {
		return this.client.deleteChannel.apply(this.client, reg(this, arguments));
	}

}

module.exports = Channel;