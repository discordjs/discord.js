"use strict";

var Channel = require("./Channel.js");
var Cache = require("../Util/Cache.js");
var PermissionOverwrite = require("./PermissionOverwrite.js");

class ServerChannel extends Channel{
	constructor(data, client){
		super(data, client);
		this.name = data.name;
		this.type = data.type;
		this.permissionOverwrites = new Cache();
		data.permission_overwrites.forEach((permission) => {
			this.permissionOverwrites.add( new PermissionOverwrite(permission) );
		});
	}
	
	toString(){
		return this.name;
	}
}

module.exports = ServerChannel;