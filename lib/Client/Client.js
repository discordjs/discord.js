"use strict";

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _InternalClient = require("./InternalClient");

var _InternalClient2 = _interopRequireDefault(_InternalClient);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _StructuresPMChannel = require("../Structures/PMChannel");

var _StructuresPMChannel2 = _interopRequireDefault(_StructuresPMChannel);

// This utility function creates an anonymous error handling wrapper function
// for a given callback. It is used to allow error handling inside the callback
// and using other means.
function errorCallback(callback) {
	return function (error) {
		callback(error);
		throw error;
	};
}

// This utility function creates an anonymous handler function to separate the
// error and the data arguments inside a callback and return the data if it is
// eventually done (for promise propagation).
function dataCallback(callback) {
	return function (data) {
		callback(null, data);
		return data;
	};
}

var Client = (function (_EventEmitter) {
	_inherits(Client, _EventEmitter);

	/*
 	this class is an interface for the internal
 	client.
 */

	function Client() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, Client);

		_EventEmitter.call(this);
		this.options = options || {};
		this.options.compress = options.compress || !process.browser;
		this.options.revive = options.revive || false;
		this.options.rate_limit_as_error = options.rate_limit_as_error || false;
		this.internal = new _InternalClient2["default"](this);
	}

	// def loginWithToken

	Client.prototype.loginWithToken = function loginWithToken(token) {
		var email = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var password = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, token*/{} : arguments[3];

		if (typeof email === "function") {
			// email is the callback
			callback = email;
			email = null;
			password = null;
		}

		return this.internal.loginWithToken(token, email, password).then(dataCallback(callback), errorCallback(callback));
	};

	// def login

	Client.prototype.login = function login(email, password) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, token*/{} : arguments[2];

		return this.internal.login(email, password).then(dataCallback(callback), errorCallback(callback));
	};

	// def logout

	Client.prototype.logout = function logout() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err, {}*/{} : arguments[0];

		return this.internal.logout().then(dataCallback(callback), errorCallback(callback));
	};

	// def destroy

	Client.prototype.destroy = function destroy() {
		var _this = this;

		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err, {}*/{} : arguments[0];

		return this.internal.logout().then(function () {
			return _this.internal.disconnected(true);
		}).then(dataCallback(callback), errorCallback(callback));
	};

	// def sendMessage

	Client.prototype.sendMessage = function sendMessage(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, msg*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.sendMessage(where, content, options).then(dataCallback(callback), errorCallback(callback));
	};

	// def sendTTSMessage

	Client.prototype.sendTTSMessage = function sendTTSMessage(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, msg*/{} : arguments[2];

		return this.sendMessage(where, content, { tts: true }).then(dataCallback(callback), errorCallback(callback));
	};

	// def reply

	Client.prototype.reply = function reply(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, msg*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		var msg = this.internal.resolver.resolveMessage(where);
		if (msg) {
			if (!(msg.channel instanceof _StructuresPMChannel2["default"])) {
				content = msg.author + ", " + content;
			}
			return this.internal.sendMessage(msg, content, options).then(dataCallback(callback), errorCallback(callback));
		}
		var err = new Error("Destination not resolvable to a message!");
		callback(err);
		return Promise.reject(err);
	};

	// def replyTTS

	Client.prototype.replyTTS = function replyTTS(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, msg*/{} : arguments[2];

		return this.reply(where, content, { tts: true }).then(dataCallback(callback), errorCallback(callback));
	};

	// def deleteMessage

	Client.prototype.deleteMessage = function deleteMessage(msg) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.deleteMessage(msg, options).then(dataCallback(callback), errorCallback(callback));
	};

	//def updateMessage

	Client.prototype.updateMessage = function updateMessage(msg, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, msg*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}

		return this.internal.updateMessage(msg, content, options).then(dataCallback(callback), errorCallback(callback));
	};

	// def getChannelLogs

	Client.prototype.getChannelLogs = function getChannelLogs(where) {
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 50 : arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, logs*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		} else if (typeof limit === "function") {
			// options is the callback
			callback = limit;
			limit = 50;
		}

		return this.internal.getChannelLogs(where, limit, options).then(dataCallback(callback), errorCallback(callback));
	};

	// def getBans

	Client.prototype.getBans = function getBans(where) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, bans*/{} : arguments[1];

		return this.internal.getBans(where).then(dataCallback(callback), errorCallback(callback));
	};

	// def sendFile

	Client.prototype.sendFile = function sendFile(where, attachment, name) {
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, m*/{} : arguments[3];

		if (typeof name === "function") {
			// name is the callback
			callback = name;
			name = undefined; // Will get resolved into original filename in internal
		}

		return this.internal.sendFile(where, attachment, name).then(dataCallback(callback), errorCallback(callback));
	};

	// def joinServer

	Client.prototype.joinServer = function joinServer(invite) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, srv*/{} : arguments[1];

		return this.internal.joinServer(invite).then(dataCallback(callback), errorCallback(callback));
	};

	// def createServer

	Client.prototype.createServer = function createServer(name) {
		var region = arguments.length <= 1 || arguments[1] === undefined ? "london" : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, srv*/{} : arguments[2];

		return this.internal.createServer(name, region).then(dataCallback(callback), errorCallback(callback));
	};

	// def leaveServer

	Client.prototype.leaveServer = function leaveServer(server) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.leaveServer(server).then(dataCallback(callback), errorCallback(callback));
	};

	// def updateServer

	Client.prototype.updateServer = function updateServer(server, name, region) {
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, srv*/{} : arguments[3];

		if (typeof region === "function") {
			// region is the callback
			callback = region;
			region = undefined;
		}

		return this.internal.updateServer(server, name, region).then(dataCallback(callback), errorCallback(callback));
	};

	// def deleteServer

	Client.prototype.deleteServer = function deleteServer(server) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.leaveServer(server).then(dataCallback(callback), errorCallback(callback));
	};

	// def createChannel

	Client.prototype.createChannel = function createChannel(server, name) {
		var type = arguments.length <= 2 || arguments[2] === undefined ? "text" : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, channel*/{} : arguments[3];

		if (typeof type === "function") {
			// options is the callback
			callback = type;
			type = "text";
		}

		return this.internal.createChannel(server, name, type).then(dataCallback(callback), errorCallback(callback));
	};

	// def deleteChannel

	Client.prototype.deleteChannel = function deleteChannel(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.deleteChannel(channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def banMember

	Client.prototype.banMember = function banMember(user, server) {
		var length = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, {}*/{} : arguments[3];

		if (typeof length === "function") {
			// length is the callback
			callback = length;
			length = 1;
		}

		return this.internal.banMember(user, server, length).then(dataCallback(callback), errorCallback(callback));
	};

	// def unbanMember

	Client.prototype.unbanMember = function unbanMember(user, server) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.unbanMember(user, server).then(dataCallback(callback), errorCallback(callback));
	};

	// def kickMember

	Client.prototype.kickMember = function kickMember(user, server) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.kickMember(user, server).then(dataCallback(callback), errorCallback(callback));
	};

	// def moveMember

	Client.prototype.moveMember = function moveMember(user, channel) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.moveMember(user, channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def createRole

	Client.prototype.createRole = function createRole(server) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, role*/{} : arguments[2];

		if (typeof data === "function") {
			// data is the callback
			callback = data;
			data = null;
		}

		return this.internal.createRole(server, data).then(dataCallback(callback), errorCallback(callback));
	};

	// def updateRole

	Client.prototype.updateRole = function updateRole(role) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, role*/{} : arguments[2];

		if (typeof data === "function") {
			// data is the callback
			callback = data;
			data = null;
		}
		return this.internal.updateRole(role, data).then(dataCallback(callback), errorCallback(callback));
	};

	// def deleteRole

	Client.prototype.deleteRole = function deleteRole(role) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.deleteRole(role).then(dataCallback(callback), errorCallback(callback));
	};

	// def addMemberToRole

	Client.prototype.addMemberToRole = function addMemberToRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.addMemberToRole(member, role).then(dataCallback(callback), errorCallback(callback));
	};

	// def addUserToRole

	Client.prototype.addUserToRole = function addUserToRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.addMemberToRole(member, role, callback);
	};

	// def addUserToRole

	Client.prototype.memberHasRole = function memberHasRole(member, role) {
		return this.internal.memberHasRole(member, role);
	};

	// def addUserToRole

	Client.prototype.userHasRole = function userHasRole(member, role) {
		return this.memberHasRole(member, role);
	};

	// def removeMemberFromRole

	Client.prototype.removeMemberFromRole = function removeMemberFromRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.removeMemberFromRole(member, role).then(dataCallback(callback), errorCallback(callback));
	};

	// def removeUserFromRole

	Client.prototype.removeUserFromRole = function removeUserFromRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.removeMemberFromRole(member, role, callback);
	};

	// def createInvite

	Client.prototype.createInvite = function createInvite(chanServ, options) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, invite*/{} : arguments[2];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = undefined;
		}

		return this.internal.createInvite(chanServ, options).then(dataCallback(callback), errorCallback(callback));
	};

	// def deleteInvite

	Client.prototype.deleteInvite = function deleteInvite(invite) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.deleteInvite(invite).then(dataCallback(callback), errorCallback(callback));
	};

	// def getInvite

	Client.prototype.getInvite = function getInvite(invite) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, inv*/{} : arguments[1];

		return this.internal.getInvite(invite).then(dataCallback(callback), errorCallback(callback));
	};

	// def getInvites

	Client.prototype.getInvites = function getInvites(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, inv*/{} : arguments[1];

		return this.internal.getInvites(channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def overwritePermissions

	Client.prototype.overwritePermissions = function overwritePermissions(channel, role) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, {}*/{} : arguments[3];

		return this.internal.overwritePermissions(channel, role, options).then(dataCallback(callback), errorCallback(callback));
	};

	// def setStatus

	Client.prototype.setStatus = function setStatus(idleStatus, game) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		if (typeof game === "function") {
			// game is the callback
			callback = game;
			game = null;
		} else if (typeof idleStatus === "function") {
			// idleStatus is the callback
			callback = idleStatus;
			game = null;
		}

		return this.internal.setStatus(idleStatus, game).then(dataCallback(callback), errorCallback(callback));
	};

	// def sendTyping

	Client.prototype.sendTyping = function sendTyping(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.sendTyping(channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def setChannelTopic

	Client.prototype.setChannelTopic = function setChannelTopic(channel, topic) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.setChannelTopic(channel, topic).then(dataCallback(callback), errorCallback(callback));
	};

	// def setChannelName

	Client.prototype.setChannelName = function setChannelName(channel, name) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.setChannelName(channel, name).then(dataCallback(callback), errorCallback(callback));
	};

	// def setChannelNameAndTopic

	Client.prototype.setChannelNameAndTopic = function setChannelNameAndTopic(channel, name, topic) {
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, {}*/{} : arguments[3];

		return this.internal.setChannelNameAndTopic(channel, name, topic).then(dataCallback(callback), errorCallback(callback));
	};

	// def setChannelPosition

	Client.prototype.setChannelPosition = function setChannelPosition(channel, position) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.setChannelPosition(channel, position).then(dataCallback(callback), errorCallback(callback));
	};

	// def updateChannel

	Client.prototype.updateChannel = function updateChannel(channel, data) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, {}*/{} : arguments[2];

		return this.internal.updateChannel(channel, data).then(dataCallback(callback), errorCallback(callback));
	};

	// def startTyping

	Client.prototype.startTyping = function startTyping(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.startTyping(channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def stopTyping

	Client.prototype.stopTyping = function stopTyping(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.stopTyping(channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def updateDetails

	Client.prototype.updateDetails = function updateDetails(details) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.updateDetails(details).then(dataCallback(callback), errorCallback(callback));
	};

	// def setUsername

	Client.prototype.setUsername = function setUsername(name) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.setUsername(name).then(dataCallback(callback), errorCallback(callback));
	};

	// def setAvatar

	Client.prototype.setAvatar = function setAvatar(avatar) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.internal.setAvatar(avatar).then(dataCallback(callback), errorCallback(callback));
	};

	// def joinVoiceChannel

	Client.prototype.joinVoiceChannel = function joinVoiceChannel(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, channel*/{} : arguments[1];

		return this.internal.joinVoiceChannel(channel).then(dataCallback(callback), errorCallback(callback));
	};

	// def leaveVoiceChannel

	Client.prototype.leaveVoiceChannel = function leaveVoiceChannel() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err, {}*/{} : arguments[0];

		return this.internal.leaveVoiceChannel().then(dataCallback(callback), errorCallback(callback));
	};

	// def awaitResponse

	Client.prototype.awaitResponse = function awaitResponse(msg) {
		var toSend = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

		var _this2 = this;

		var options = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, newMsg*/{} : arguments[3];

		var ret;

		if (toSend) {
			if (typeof toSend === "function") {
				// (msg, callback)
				callback = toSend;
				toSend = null;
				options = null;
			} else {
				// (msg, toSend, ...)
				if (options) {
					if (typeof options === "function") {
						//(msg, toSend, callback)
						callback = options;
						options = null;
						ret = this.sendMessage(msg, toSend);
					} else {
						//(msg, toSend, options, callback)
						ret = this.sendMessage(msg, toSend, options);
					}
				} else {
					// (msg, toSend) promise
					ret = this.sendMessage(msg, toSend);
				}
			}
		}

		if (!ret) {
			ret = Promise.resolve();
		}
		// (msg) promise
		return ret.then(function () {
			return _this2.internal.awaitResponse(msg);
		}).then(dataCallback(callback), errorCallback(callback));
	};

	Client.prototype.setStatusIdle = function setStatusIdle() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err, {}*/{} : arguments[0];

		return this.internal.setStatus("idle").then(dataCallback(callback), errorCallback(callback));
	};

	Client.prototype.setStatusOnline = function setStatusOnline() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err, {}*/{} : arguments[0];

		return this.internal.setStatus("online").then(dataCallback(callback), errorCallback(callback));
	};

	Client.prototype.setStatusActive = function setStatusActive(callback) {
		return this.setStatusOnline(callback);
	};

	Client.prototype.setStatusHere = function setStatusHere(callback) {
		return this.setStatusOnline(callback);
	};

	Client.prototype.setStatusAvailable = function setStatusAvailable(callback) {
		return this.setStatusOnline(callback);
	};

	Client.prototype.setStatusAway = function setStatusAway(callback) {
		return this.setStatusIdle(callback);
	};

	Client.prototype.setPlayingGame = function setPlayingGame(game) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, {}*/{} : arguments[1];

		return this.setStatus(null, game, callback);
	};

	_createClass(Client, [{
		key: "users",
		get: function get() {
			return this.internal.users;
		}
	}, {
		key: "channels",
		get: function get() {
			return this.internal.channels;
		}
	}, {
		key: "servers",
		get: function get() {
			return this.internal.servers;
		}
	}, {
		key: "privateChannels",
		get: function get() {
			return this.internal.private_channels;
		}
	}, {
		key: "voiceConnection",
		get: function get() {
			return this.internal.voiceConnection;
		}
	}, {
		key: "readyTime",
		get: function get() {
			return this.internal.readyTime;
		}
	}, {
		key: "uptime",
		get: function get() {
			return this.internal.uptime;
		}
	}, {
		key: "user",
		get: function get() {
			return this.internal.user;
		}
	}, {
		key: "userAgent",
		get: function get() {
			return this.internal.userAgent;
		},
		set: function set(userAgent) {
			this.internal.userAgent = userAgent;
		}
	}]);

	return Client;
})(_events2["default"]);

exports["default"] = Client;
module.exports = exports["default"];
