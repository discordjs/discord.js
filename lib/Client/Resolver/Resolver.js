"use strict";
/* global Buffer */

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _StructuresUser = require("../../Structures/User");

var _StructuresUser2 = _interopRequireDefault(_StructuresUser);

var _StructuresChannel = require("../../Structures/Channel");

var _StructuresChannel2 = _interopRequireDefault(_StructuresChannel);

var _StructuresTextChannel = require("../../Structures/TextChannel");

var _StructuresTextChannel2 = _interopRequireDefault(_StructuresTextChannel);

var _StructuresVoiceChannel = require("../../Structures/VoiceChannel");

var _StructuresVoiceChannel2 = _interopRequireDefault(_StructuresVoiceChannel);

var _StructuresServerChannel = require("../../Structures/ServerChannel");

var _StructuresServerChannel2 = _interopRequireDefault(_StructuresServerChannel);

var _StructuresPMChannel = require("../../Structures/PMChannel");

var _StructuresPMChannel2 = _interopRequireDefault(_StructuresPMChannel);

var _StructuresServer = require("../../Structures/Server");

var _StructuresServer2 = _interopRequireDefault(_StructuresServer);

var _StructuresMessage = require("../../Structures/Message");

var _StructuresMessage2 = _interopRequireDefault(_StructuresMessage);

var _StructuresInvite = require("../../Structures/Invite");

var _StructuresInvite2 = _interopRequireDefault(_StructuresInvite);

var _refGameMap = require("../../../ref/gameMap");

var _refGameMap2 = _interopRequireDefault(_refGameMap);

var Resolver = (function () {
	function Resolver(internal) {
		_classCallCheck(this, Resolver);

		this.internal = internal;
	}

	Resolver.prototype.resolveGameID = function resolveGameID(resource) {
		if (!isNaN(resource) && parseInt(resource) % 1 === 0) {
			return resource;
		}
		if (typeof resource === "string" || resource instanceof String) {
			var gameName = resource.toLowerCase();
			var found = _refGameMap2["default"].find(function (game) {
				return game.name.toLowerCase() === gameName;
			});
			if (found) {
				return found.id;
			}
		}

		return null;
	};

	Resolver.prototype.resolveToBase64 = function resolveToBase64(resource) {
		if (resource instanceof Buffer) {
			resource = resource.toString("base64");
			resource = "data:image/jpg;base64," + resource;
		}
		return resource;
	};

	Resolver.prototype.resolveInviteID = function resolveInviteID(resource) {
		if (resource instanceof _StructuresInvite2["default"]) {
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
	};

	Resolver.prototype.resolveServer = function resolveServer(resource) {
		if (resource instanceof _StructuresServer2["default"]) {
			return resource;
		}
		if (resource instanceof _StructuresServerChannel2["default"]) {
			return resource.server;
		}
		if (resource instanceof String || typeof resource === "string") {
			return this.internal.servers.get("id", resource);
		}
		if (resource instanceof _StructuresMessage2["default"]) {
			if (resource.channel instanceof _StructuresTextChannel2["default"]) {
				return resource.server;
			}
		}
		return null;
	};

	Resolver.prototype.resolveFile = function resolveFile(resource) {
		if (typeof resource === "string" || resource instanceof String) {
			return _fs2["default"].createReadStream(resource);
		}
		return resource;
	};

	Resolver.prototype.resolveMentions = function resolveMentions(resource) {
		// resource is a string
		var _mentions = [];
		var changed = resource;
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

			var userID = mention.substring(2, mention.length - 1);
			_mentions.push(userID);
			changed = changed.replace(new RegExp(mention, "g"), "@" + this.internal.client.users.get("id", userID).username);
		}
		return [_mentions, changed];
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
		if (resource instanceof _StructuresUser2["default"]) {
			return resource;
		}
		if (resource instanceof _StructuresMessage2["default"]) {
			return resource.author;
		}
		if (resource instanceof _StructuresTextChannel2["default"]) {
			var lmsg = resource.lastMessage;
			if (lmsg) {
				return lmsg.author;
			}
		}
		if (resource instanceof _StructuresServer2["default"]) {
			return resource.owner;
		}
		if (resource instanceof _StructuresPMChannel2["default"]) {
			return resource.recipient;
		}
		if (resource instanceof String || typeof resource === "string") {
			return this.internal.users.get("id", resource);
		}

		return null;
	};

	Resolver.prototype.resolveMessage = function resolveMessage(resource) {
		// accepts a Message, PMChannel & TextChannel

		if (resource instanceof _StructuresTextChannel2["default"] || resource instanceof _StructuresPMChannel2["default"]) {
			return resource.lastMessage;
		}
		if (resource instanceof _StructuresMessage2["default"]) {
			return resource;
		}

		return null;
	};

	Resolver.prototype.resolveVoiceChannel = function resolveVoiceChannel(resource) {
		// resolveChannel will also work but this is more apt
		if (resource instanceof _StructuresVoiceChannel2["default"]) {
			return resource;
		}
		return null;
	};

	Resolver.prototype.resolveChannel = function resolveChannel(resource) {
		/*
  	accepts a Message, Channel, Server, String ID, User
  */

		if (resource instanceof _StructuresMessage2["default"]) {
			return Promise.resolve(resource.channel);
		}
		if (resource instanceof _StructuresChannel2["default"]) {
			return Promise.resolve(resource);
		}
		if (resource instanceof _StructuresServer2["default"]) {
			return Promise.resolve(resource.channels.get("id", resource.id));
		}
		if (resource instanceof String || typeof resource === "string") {
			return Promise.resolve(this.internal.channels.get("id", resource));
		}
		if (resource instanceof _StructuresUser2["default"]) {
			// see if a PM exists
			var chatFound = this.internal.private_channels.find(function (pmchat) {
				return pmchat.recipient.equals(resource);
			});
			if (chatFound) {
				// a PM already exists!
				return Promise.resolve(chatFound);
			}
			// PM does not exist :\
			return this.internal.startPM(resource);
		}
		var error = new Error("Could not resolve channel");
		error.resource = resource;
		return Promise.reject(error);
	};

	return Resolver;
})();

exports["default"] = Resolver;
module.exports = exports["default"];
