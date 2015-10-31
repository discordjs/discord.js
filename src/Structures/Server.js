"use strict";

var Equality = require("../Util/Equality.js");
var Endpoints = require("../Constants.js").Endpoints;
var Cache = require("../Util/Cache.js");
var User = require("./User.js");
var Member = require("./Member.js");
var TextChannel = require("./TextChannel.js");
var VoiceChannel = require("./VoiceChannel.js");

class Server extends Equality {
	constructor(data, client) {
		
		super();

		var self = this;
		this.client = client;

		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = new Cache();
		this.channels = new Cache();
		this.roles = new Cache();
		this.icon = data.icon;
		this.afkTimeout = data.afkTimeout;
		this.afkChannelID = data.afk_channel_id;
		
		data.members.forEach( (dataUser) => {
			var user = client.internal.users.add(new User(dataUser, client));
			this.members.add( new Member(dataUser, client, self) );
		} );
		
		data.channels.forEach( (dataChannel) => {
			
			if(dataChannel.type === "text"){
				var channel = client.internal.channels.add(new TextChannel(dataChannel, client));
				this.channels.add(channel);
			}else{
				var channel = client.internal.channels.add(new VoiceChannel(dataChannel, client));
				this.channels.add(channel);
			}
			
		} );
	}

	get iconURL() {
		if (!this.icon) {
			return null;
		} else {
			return Endpoints.SERVER_ICON(this.id, this.icon);
		}
	}
	
	get afkChannel() {
		return this.channels.get("id", this.afkChannelID);
	}
	
	get defaultChannel() {
		return this.channels.get("id", this.id);
	}
	
	get owner() {
		return this.members.get("id", this.ownerID);
	}
	
	toString() {
		return this.name;
	}
	
}

module.exports = Server;