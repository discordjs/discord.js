"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = require("../../Structures/User.js"),
    Channel = require("../../Structures/Channel.js"),
    TextChannel = require("../../Structures/TextChannel.js"),
    VoiceChannel = require("../../Structures/VoiceChannel.js"),
    ServerChannel = require("../../Structures/ServerChannel.js"),
    PMChannel = require("../../Structures/PMChannel.js"),
    Server = require("../../Structures/Server.js"),
    Message = require("../../Structures/Message.js");

var Resolver = (function () {
	function Resolver(client) {
		_classCallCheck(this, Resolver);

		this.client = client;
	}

	Resolver.prototype.resolveMentions = function resolveMentions(resource) {
		// resource is a string
		var _mentions = [];
		for (var _iterator = resource.match(/<@[^>]*>/g) || [], _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var mention = _ref;

			_mentions.push(mention.substring(2, mention.length - 1));
		}
		return _mentions;
	};

	Resolver.prototype.resolveString = function resolveString(resource) {

		// accepts Array, Channel, Server, User, Message, String and anything
		// toString()-able

		var final = resource;
		if (resource instanceof Array) {
			final = resource.join("\n");
		}

		return final.toString();
	};

	Resolver.prototype.resolveUser = function resolveUser(resource) {
		/*
  	accepts a Message, Channel, Server, String ID, User, PMChannel
  */
		var found = null;
		if (resource instanceof Message) {
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
	};

	Resolver.prototype.resolveMessage = function resolveMessage(resource) {
		// accepts a Message, PMChannel & TextChannel
		var found = null;

		if (resource instanceof TextChannel || resource instanceof PMChannel) {
			found = resource.lastMessage;
		} else if (resource instanceof Message) {
			found = resource;
		}

		return found;
	};

	Resolver.prototype.resolveChannel = function resolveChannel(resource) {
		/*
  	accepts a Message, Channel, Server, String ID, User
   */
		var self = this;

		return new Promise(function (resolve, reject) {
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
				for (var _iterator2 = self.client.internal.private_channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
					var _ref2;

					if (_isArray2) {
						if (_i2 >= _iterator2.length) break;
						_ref2 = _iterator2[_i2++];
					} else {
						_i2 = _iterator2.next();
						if (_i2.done) break;
						_ref2 = _i2.value;
					}

					var pmchat = _ref2;

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
					self.client.internal.startPM(resource).then(function (pmchannel) {
						return resolve(pmchannel);
					})["catch"](function (e) {
						return reject(e);
					});
					return;
				}
			}
			if (found) resolve(found);else reject();
		});
	};

	return Resolver;
})();

module.exports = Resolver;