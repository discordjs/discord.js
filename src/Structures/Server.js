"use strict";

var Equality = require("../Util/Equality.js");
var Endpoints = require("../Constants.js").Endpoints;
var Cache = require("../Util/Cache.js");
var User = require("./User.js");
var TextChannel = require("./TextChannel.js");
var VoiceChannel = require("./VoiceChannel.js");
var Role = require("./Role.js");

var strictKeys = [
	"region", "ownerID", "name", "id", "icon", "afkTimeout", "afkChannelID"
];

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
		this.memberMap = {};
		
		var self = this;
		
		data.roles.forEach( (dataRole) => {
			this.roles.add( new Role(dataRole, this, client) );
		} );
		
		data.members.forEach( (dataUser) => {
			this.memberMap[dataUser.user.id] = {
				roles : dataUser.roles.map((pid) => self.roles.get("id", pid)),
				mute : dataUser.mute,
				deaf : dataUser.deaf,
				joinedAt : Date.parse(dataUser.joined_at)	
			};
			var user = client.internal.users.add(new User(dataUser.user, client));
			this.members.add( user );
		} );
		
		data.channels.forEach( (dataChannel) => {
			if(dataChannel.type === "text"){
				var channel = client.internal.channels.add(new TextChannel(dataChannel, client, this));
				this.channels.add(channel);
			}else{
				var channel = client.internal.channels.add(new VoiceChannel(dataChannel, client, this));
				this.channels.add(channel);
			}
		} );
	}
	
	rolesOfUser(user){
		user = this.client.internal.resolver.resolveUser(user);
		if(user){
			return (this.memberMap[user.id] ? this.memberMap[user.id].roles : []);
		}else{
			return null;
		}
	}
	
	rolesOf(user){
		return this.rolesOfUser(user);
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
	
	equalsStrict(obj){
		if(obj instanceof Server){
			for(var key of strictKeys){
				if(obj[key] !== this[key]){
					return false;
				}
			}	
		}else{
			return false;
		}
		return true;
	}
	
}

module.exports = Server;