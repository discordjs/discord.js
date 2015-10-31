"use strict";

var User = require("../../Structures/User.js"),
	Channel = require("../../Structures/Channel.js"),
	TextChannel = require("../../Structures/TextChannel.js"),
	VoiceChannel = require("../../Structures/VoiceChannel.js"),
	PMChannel = require("../../Structures/PMChannel.js"),
	Server = require("../../Structures/Server.js"),
	Message = require("../../Structures/Message.js");

class Resolver {
	constructor(client) {
		this.client = client;
	}
	
	resolveUser(resource) {
		/*
			accepts a Message, Channel, Server, String ID, User, PMChannel
		*/
		var found = null;
		if(resource instanceof Message){
			found = resource.author;
		}else if(resource instanceof TextChannel){
			var lmsg = resource.lastMessage;
			if(lmsg){
				found = lmsg.author;
			}
		}else if(resource instanceof Server){
			found = resource.owner;
		}else if(resource instanceof PMChannel){
			found = resource.recipient;
		}else if(resource instanceof String || typeof resource === "string"){
			found = this.client.internal.users.get("id", resource);
		}
		
		return found;
	}

	resolveChannel(resource) {
		/*
			accepts a Message, Channel, Server, String ID, User
		 */
		var self = this;

		return new Promise((resolve, reject) => {
			var found = null;
			if (resource instanceof Message) {
				found = resource.channel;
			} else if (resource instanceof Channel) {
				found = resource;
			} else if (resource instanceof Server) {
				found = resource.channels.get("id", resource.id);
			} else if (resource instanceof String || typeof resource === "string") {
				found = self.client.internal.channels.get("id", resource);
			} else if (resource instanceof User) {
				// see if a PM exists
				var chatFound = false;
				for(var pmchat of self.client.internal.private_channels){
					if(pmchat.recipient.equals(resource)){
						chatFound = pmchat;
						break;
					}
				}
				if(chatFound){
					// a PM already exists!
					found = chatFound;
				}else{
					// PM does not exist :\
					self.client.internal.startPM(resource)
						.then( pmchannel => resolve(pmchannel) )
						.catch( e => reject(e) );
					return;
				}
			}
			if(found)
				resolve(found);
			else
				reject();
		});

	}
}
module.exports = Resolver;