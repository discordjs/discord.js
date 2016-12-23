"use strict";
/* global Buffer */

/**
 * Resolves supplied data type to a Channel. If a String, it should be a Channel ID.
 * @typedef {(Channel|Server|Message|User|String)} ChannelResolvable
*/
/**
 * Resolves supplied data type to a TextChannel or PMChannel. If a String, it should be a Channel ID.
 * @typedef {(TextChannel|PMChannel|Server|Message|User|String)} TextChannelResolvable
*/
/**
 * If given an array, turns it into a newline-separated string.
 * @typedef {(String|Array)} StringResolvable
*/
/**
 * Resolves supplied data type to a Message. If a channel, it is the latest message from that channel.
 * @typedef {(Message|TextChannel|PMChannel)} MessageResolvable
*/
/**
 * Resolves supplied data type to a Server. If a String, it should be the server's ID.
 * @typedef {(Server|ServerChannel|Message|String)} ServerResolvable
 */
/**
 * Resolves supplied data type to something that can be attached to a message. If a String, it can be an URL or a path to a local file.
 * @typedef {(String|ReadableStream|Buffer)} FileResolvable
 */
/**
 * Resolves supplied data type to an invite ID. If a String, it should be an ID or a direct URL to the invite.
 * @typedef {(Invite|String)} InviteIDResolvable
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _User = require("../../Structures/User");

var _User2 = _interopRequireDefault(_User);

var _Channel = require("../../Structures/Channel");

var _Channel2 = _interopRequireDefault(_Channel);

var _TextChannel = require("../../Structures/TextChannel");

var _TextChannel2 = _interopRequireDefault(_TextChannel);

var _VoiceChannel = require("../../Structures/VoiceChannel");

var _VoiceChannel2 = _interopRequireDefault(_VoiceChannel);

var _ServerChannel = require("../../Structures/ServerChannel");

var _ServerChannel2 = _interopRequireDefault(_ServerChannel);

var _PMChannel = require("../../Structures/PMChannel");

var _PMChannel2 = _interopRequireDefault(_PMChannel);

var _Role = require("../../Structures/Role");

var _Role2 = _interopRequireDefault(_Role);

var _Server = require("../../Structures/Server");

var _Server2 = _interopRequireDefault(_Server);

var _Message = require("../../Structures/Message");

var _Message2 = _interopRequireDefault(_Message);

var _Invite = require("../../Structures/Invite");

var _Invite2 = _interopRequireDefault(_Invite);

var _Webhook = require("../../Structures/Webhook");

var _Webhook2 = _interopRequireDefault(_Webhook);

var _VoiceConnection = require("../../Voice/VoiceConnection");

var _VoiceConnection2 = _interopRequireDefault(_VoiceConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Resolver {
	constructor(internal) {
		this.internal = internal;
	}

	resolveToBase64(resource) {
		if (resource instanceof Buffer) {
			resource = resource.toString("base64");
			resource = "data:image/jpg;base64," + resource;
		}
		return resource;
	}

	resolveInviteID(resource) {
		if (resource instanceof _Invite2.default) {
			return resource.id;
		}
		if (typeof resource === "string" || resource instanceof String) {
			if (resource.indexOf("http") === 0) {
				var split = resource.split("/");
				return split.pop();
			}
			return resource;
		}
		return null;
	}

	resolveServer(resource) {
		if (resource instanceof _Server2.default) {
			return resource;
		}
		if (resource instanceof _ServerChannel2.default) {
			return resource.server;
		}
		if (resource instanceof String || typeof resource === "string") {
			return this.internal.servers.get("id", resource);
		}
		if (resource instanceof _Message2.default) {
			if (resource.channel instanceof _TextChannel2.default) {
				return resource.channel.server;
			}
		}
		return null;
	}

	resolveRole(resource) {
		if (resource instanceof _Role2.default) {
			return resource;
		}
		if (resource instanceof String || typeof resource === "string") {
			var role = null;
			for (var server of this.internal.servers) {
				if (role = server.roles.get("id", resource)) {
					return role;
				}
			}
		}
		return null;
	}

	resolveFile(resource) {
		if (typeof resource === "string" || resource instanceof String) {
			if (/^https?:\/\//.test(resource)) {
				return new Promise((resolve, reject) => {
					_superagent2.default.get(resource).buffer().parse((res, cb) => {
						res.setEncoding("binary");
						res.data = "";
						res.on("data", chunk => {
							res.data += chunk;
						});
						res.on("end", () => {
							cb(null, new Buffer(res.data, "binary"));
						});
					}).end((err, res) => {
						if (err) {
							return reject(err);
						}
						return resolve(res.body);
					});
				});
			} else {
				return Promise.resolve(resource);
			}
		}
		return Promise.resolve(resource);
	}

	resolveMentions(resource, channel) {
		var _mentions = [];
		var changed = resource;
		for (var mention of resource.match(/<@\!?[0-9]+>/g) || []) {
			// username mention
			if (mention[2] === '!') {
				var user = this.internal.users.get("id", mention.substring(3, mention.length - 1));
				if (user) {
					_mentions.push(user);
					var details = channel.server && channel.server.detailsOf(user);
					if (details) {
						changed = changed.replace(new RegExp(mention, "g"), `@${ details.nick || user.username + "#" + user.discriminator }`);
					}
				}
			} else {
				var user = this.internal.users.get("id", mention.substring(2, mention.length - 1));
				if (user) {
					_mentions.push(user);
					changed = changed.replace(new RegExp(mention, "g"), `@${ user.username + "#" + user.discriminator }`);
				}
			}
		}
		if (channel && channel.server && channel.server.roles) {
			for (var mention of resource.match(/<@&[0-9]+>/g) || []) {
				// role mention
				var role = channel.server.roles.get("id", mention.substring(3, mention.length - 1));
				if (role) {
					changed = changed.replace(new RegExp(mention, "g"), `@${ role.name }`);
				}
			}
		}
		for (var mention of resource.match(/<#[0-9]+>/g) || []) {
			// channel mention
			var channel = this.internal.channels.get("id", mention.substring(2, mention.length - 1));
			if (channel) {
				changed = changed.replace(new RegExp(mention, "g"), `#${ channel.name }`);
			}
		}
		return [_mentions, changed];
	}

	resolveString(resource) {

		// accepts Array, Channel, Server, User, Message, String and anything
		// toString()-able

		if (resource instanceof Array) {
			resource = resource.join("\n");
		}

		return resource.toString();
	}

	resolveUser(resource) {
		/*
  	accepts a Message, Channel, Server, String ID, User, PMChannel
  */
		if (resource instanceof _User2.default) {
			return resource;
		}
		if (resource instanceof _Message2.default) {
			return resource.author;
		}
		if (resource instanceof _TextChannel2.default) {
			var lmsg = resource.lastMessage;
			if (lmsg) {
				return lmsg.author;
			}
		}
		if (resource instanceof _Server2.default) {
			return resource.owner;
		}
		if (resource instanceof _PMChannel2.default) {
			return resource.recipient;
		}
		if (resource instanceof String || typeof resource === "string") {
			return this.internal.users.get("id", resource);
		}

		return null;
	}

	resolveWebhook(resource) {
		/*
   accepts a Webhook
   */
		if (resource instanceof _Webhook2.default) {
			return Promise.resolve(resource);
		}
		if (resource instanceof String || typeof resource === "string") {
			let server = this.internal.servers.find(s => s.webhooks.has("id", resource));
			if (server) {
				return Promise.resolve(server.webhooks.get("id", resource));
			}
		}
		if (typeof resource === "object" && resource.hasOwnProperty("id") && resource.hasOwnProperty("token")) {
			return Promise.resolve(resource);
		}

		var error = new Error("Could not resolve webhook");
		error.resource = resource;
		return Promise.reject(error);
	}

	resolveMessage(resource) {
		// accepts a Message, PMChannel & TextChannel

		if (resource instanceof _TextChannel2.default || resource instanceof _PMChannel2.default) {
			return resource.lastMessage;
		}
		if (resource instanceof _Message2.default) {
			return resource;
		}

		return null;
	}

	resolveChannel(resource) {
		/*
  	accepts a Message, Channel, VoiceConnection, Server, String ID, User
  */

		if (resource instanceof _Message2.default) {
			return Promise.resolve(resource.channel);
		}
		if (resource instanceof _Channel2.default) {
			return Promise.resolve(resource);
		}
		if (resource instanceof _VoiceConnection2.default) {
			return Promise.resolve(resource.voiceChannel);
		}
		if (resource instanceof _Server2.default) {
			return Promise.resolve(resource.defaultChannel);
		}
		if (resource instanceof String || typeof resource === "string") {
			var user = this.internal.users.get("id", resource);
			if (user) {
				resource = user;
			} else {
				return Promise.resolve(this.internal.channels.get("id", resource) || this.internal.private_channels.get("id", resource));
			}
		}
		if (resource instanceof _User2.default) {
			// see if a PM exists
			for (var pmchat of this.internal.private_channels) {
				if (pmchat.recipients.length === 1 && pmchat.recipient && pmchat.recipient.equals(resource)) {
					return Promise.resolve(pmchat);
				}
			}

			// PM does not exist :\
			return this.internal.startPM(resource);
		}
		var error = new Error("Could not resolve channel");
		error.resource = resource;
		return Promise.reject(error);
	}
}
exports.default = Resolver;
//# sourceMappingURL=Resolver.js.map
