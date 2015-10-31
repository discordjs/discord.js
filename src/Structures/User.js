"use strict";

var Equality = require("../Util/Equality.js");
var Endpoints = require("../Constants.js").Endpoints;

class User extends Equality{
	constructor(data, client){
		super();
		this.client = client;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.id = data.id;
		this.avatar = data.avatar;
		this.status = data.status || "offline";
		this.gameID = data.game_id || null;
	}
	
	get avatarURL(){
		if(!this.avatar){
			return null;
		}else{
			return Endpoints.AVATAR(this.id, this.avatar);
		}
	}
	
	mention(){
		return `<@${this.id}>`;
	}
	
	toString(){
		return this.mention();
	}
}

module.exports = User;