"use strict";

var fs = require("fs");

var User = require("../../Structures/User.js"),
	Channel = require("../../Structures/Channel.js"),
	TextChannel = require("../../Structures/TextChannel.js"),
	VoiceChannel = require("../../Structures/VoiceChannel.js"),
	ServerChannel = require("../../Structures/ServerChannel.js"),
	PMChannel = require("../../Structures/PMChannel.js"),
	Server = require("../../Structures/Server.js"),
	Message = require("../../Structures/Message.js");

class Resolver {
	constructor(internal) {
		this.internal = internal;
	}
	
	resolveServer(resource){
		if(resource instanceof Server){
			return resource;
		}else if(resource instanceof ServerChannel){
			return resource.server;
		}else if(resource instanceof String || typeof resource === "string"){
			return this.internal.servers.get("id", resource);
		}else if(resource instanceof Message){
			if(resource.channel instanceof TextChannel){
				return resource.server;
			}
		}
		return null;
	}

	resolveFile(resource) {
		if (typeof resource === "string" || resource instanceof String) {
			return fs.createReadStream(resource);
		} else {
			return resource;
		}
	}

	resolveMentions(resource) {
		// resource is a string
		var _mentions = [];
		for (var mention of (resource.match(/<@[^>]*>/g) || [])) {
			_mentions.push(mention.substring(2, mention.length - 1));
		}
		return _mentions;
	}

	resolveString(resource) {
		
		// accepts Array, Channel, Server, User, Message, String and anything
		// toString()-able
		
		var final = resource;
		if (resource instanceof Array) {
			final = resource.join("\n");
		}

		return final.toString();
	}

	resolveUser(resource) {
		/*
			accepts a Message, Channel, Server, String ID, User, PMChannel
		*/
		var found = null;
		if (resource instanceof User) {
			found = resource;
		} else if (resource instanceof Message) {
			found = resource.author;
		} else if (resource instanceof TextChannel) {
			var lmsg = resource.lastMessage;
			if (lmsg) {
				found = lmsg.author;
			}
		} else if (resource instanceof Server) {
			found = resource.owner;
		} else if (resource instanceof PMChannel) {
			found = resource.recipient;
		} else if (resource instanceof String || typeof resource === "string") {
			found = this.client.internal.users.get("id", resource);
		}

		return found;
	}

	resolveMessage(resource) {
		// accepts a Message, PMChannel & TextChannel
		var found = null;

		if (resource instanceof TextChannel || resource instanceof PMChannel) {
			found = resource.lastMessage;
		} else if (resource instanceof Message) {
			found = resource;
		}

		return found;
	}
	
	resolveVoiceChannel(resource) {
		// resolveChannel will also work but this is more apt
		if(resource instanceof VoiceChannel){
			return resource;
		}
		return null;
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
				found = self.internal.channels.get("id", resource);
			} else if (resource instanceof User) {
				// see if a PM exists
				var chatFound = false;
				for (var pmchat of self.internal.private_channels) {
					if (pmchat.recipient.equals(resource)) {
						chatFound = pmchat;
						break;
					}
				}
				if (chatFound) {
					// a PM already exists!
					found = chatFound;
				} else {
					// PM does not exist :\
					self.internal.startPM(resource)
						.then(pmchannel => resolve(pmchannel))
						.catch(e => reject(e));
					return;
				}
			}
			if (found)
				resolve(found);
			else
				reject();
		});

	}
}
module.exports = Resolver;