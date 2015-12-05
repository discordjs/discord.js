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

function errCB(callback) {
	return function (error) {
		callback(error);
		throw error;
	};
}

var Client = (function (_EventEmitter) {
	_inherits(Client, _EventEmitter);

	/*
 	this class is an interface for the internal
 	client.
 */

	function Client(options) {
		_classCallCheck(this, Client);

		_EventEmitter.call(this);
		this.options = options || {};
		this.internal = new _InternalClient2["default"](this);
	}

	// def login

	Client.prototype.login = function login(email, password) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, token*/{} : arguments[2];

		return this.internal.login(email, password).then(function (token) {
			callback(null, token);
			return token;
		}, errCB(callback));
	};

	// def logout

	Client.prototype.logout = function logout() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err*/{} : arguments[0];

		return this.internal.logout().then(callback, errCB(callback));
	};

	// def sendMessage

	Client.prototype.sendMessage = function sendMessage(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*e, m*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.sendMessage(where, content, options).then(function (m) {
			callback(null, m);
			return m;
		}, errCB(callback));
	};

	// def sendTTSMessage

	Client.prototype.sendTTSMessage = function sendTTSMessage(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*e, m*/{} : arguments[2];

		return this.sendMessage(where, content, { tts: true }).then(function (m) {
			callback(null, m);
			return m;
		}, errCB(callback));
	};

	// def reply

	Client.prototype.reply = function reply(where, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*e, m*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		var msg = this.internal.resolver.resolveMessage(where);
		if (msg) {
			content = msg.author + ", " + content;
			return this.internal.sendMessage(msg, content, options).then(function (m) {
				callback(null, m);
				return m;
			}, errCB(callback));
		}
		var err = new Error("Destination not resolvable to a message!");
		callback(err);
		return Promise.reject(err);
	};

	// def replyTTS

	Client.prototype.replyTTS = function replyTTS(where, content) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /**/{} : arguments[2];

		return this.reply(where, content, { tts: true }).then(function (m) {
			callback(null, m);
			return m;
		}, errCB(callback));
	};

	// def deleteMessage

	Client.prototype.deleteMessage = function deleteMessage(msg) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*e*/{} : arguments[2];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.deleteMessage(msg, options).then(callback, errCB(callback));
	};

	//def updateMessage

	Client.prototype.updateMessage = function updateMessage(msg, content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, msg*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.updateMessage(msg, content, options).then(function (msg) {
			callback(null, msg);
			return msg;
		}, errCB(callback));
	};

	// def getChannelLogs

	Client.prototype.getChannelLogs = function getChannelLogs(where) {
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, logs*/{} : arguments[3];

		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}

		return this.internal.getChannelLogs(where, limit, options).then(function (logs) {
			callback(null, logs);
			return logs;
		}, errCB(callback));
	};

	// def getBans

	Client.prototype.getBans = function getBans(where) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, bans*/{} : arguments[1];

		return this.internal.getBans(where).then(function (bans) {
			callback(null, bans);
			return bans;
		}, errCB(callback));
	};

	// def sendFile

	Client.prototype.sendFile = function sendFile(where, attachment) {
		var name = arguments.length <= 2 || arguments[2] === undefined ? "image.png" : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, m*/{} : arguments[3];

		return this.internal.sendFile(where, attachment, name).then(function (m) {
			callback(null, m);
			return m;
		}, errCB(callback));
	};

	// def joinServer

	Client.prototype.joinServer = function joinServer(invite) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err, srv*/{} : arguments[1];

		return this.internal.joinServer(invite).then(function (srv) {
			callback(null, srv);
			return srv;
		}, errCB(callback));
	};

	// def createServer

	Client.prototype.createServer = function createServer(name) {
		var region = arguments.length <= 1 || arguments[1] === undefined ? "london" : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, srv*/{} : arguments[2];

		return this.internal.createServer(name, region).then(function (srv) {
			callback(null, srv);
			return srv;
		}, errCB(callback));
	};

	// def leaveServer

	Client.prototype.leaveServer = function leaveServer(server) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.leaveServer(server).then(callback, errCB(callback));
	};

	// def deleteServer

	Client.prototype.deleteServer = function deleteServer(server) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.leaveServer(server).then(callback, errCB(callback));
	};

	// def createChannel

	Client.prototype.createChannel = function createChannel(server, name) {
		var type = arguments.length <= 2 || arguments[2] === undefined ? "text" : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err, channel*/{} : arguments[3];

		if (typeof type === "function") {
			// options is the callback
			callback = type;
		}
		return this.internal.createChannel(server, name, type).then(function (channel) {
			callback(channel);
			return channel;
		}, errCB(callback));
	};

	// def deleteChannel

	Client.prototype.deleteChannel = function deleteChannel(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.deleteChannel(channel).then(callback, errCB(callback));
	};

	//def banMember

	Client.prototype.banMember = function banMember(user, server) {
		var length = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err*/{} : arguments[3];

		if (typeof length === "function") {
			// length is the callback
			callback = length;
		}
		return this.internal.banMember(user, server, length).then(callback, errCB(callback));
	};

	//def unbanMember

	Client.prototype.unbanMember = function unbanMember(user, server) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.unbanMember(user, server).then(callback, errCB(callback));
	};

	//def kickMember

	Client.prototype.kickMember = function kickMember(user, server) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.kickMember(user, server).then(callback, errCB(callback));
	};

	//def createRole

	Client.prototype.createRole = function createRole(server) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, res*/{} : arguments[2];

		if (typeof data === "function") {
			// data is the callback
			callback = data;
		}
		return this.internal.createRole(server, data).then(function (role) {
			callback(null, role);
			return role;
		}, errCB(callback));
	};

	//def updateRole

	Client.prototype.updateRole = function updateRole(role) {
		var data = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, res*/{} : arguments[2];

		if (typeof data === "function") {
			// data is the callback
			callback = data;
		}
		return this.internal.updateRole(role, data).then(function (role) {
			callback(null, role);
			return role;
		}, errCB(callback));
	};

	//def deleteRole

	Client.prototype.deleteRole = function deleteRole(role) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.deleteRole(role).then(callback, errCB(callback));
	};

	//def addMemberToRole

	Client.prototype.addMemberToRole = function addMemberToRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.addMemberToRole(member, role).then(callback, errCB(callback));
	};

	// def addUserToRole

	Client.prototype.addUserToRole = function addUserToRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.addMemberToRole(member, role, callback);
	};

	// def removeMemberFromRole

	Client.prototype.removeMemberFromRole = function removeMemberFromRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.removeMemberFromRole(member, role).then(callback, errCB(callback));
	};

	// def removeUserFromRole

	Client.prototype.removeUserFromRole = function removeUserFromRole(member, role) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.removeMemberFromRole(member, role, callback);
	};

	// def createInvite

	Client.prototype.createInvite = function createInvite(chanServ, options) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err, invite*/{} : arguments[2];

		if (typeof options === "function") {
			// length is the callback
			callback = options;
		}

		return this.internal.createInvite(chanServ, options).then(function (invite) {
			callback(null, invite);
		}, errCB(callback));
	};

	// def deleteInvite

	Client.prototype.deleteInvite = function deleteInvite(invite) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.deleteInvite(invite).then(callback, errCB(callback));
	};

	// def overwritePermissions

	Client.prototype.overwritePermissions = function overwritePermissions(channel, role) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err*/{} : arguments[3];

		return this.internal.overwritePermissions(channel, role, options).then(callback, errCB(callback));
	};

	//def setStatus

	Client.prototype.setStatus = function setStatus(idleStatus, gameID) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		if (typeof gameID === "function") {
			// gameID is the callback
			callback = gameID;
		} else if (typeof idleStatus === "function") {
			// idleStatus is the callback
			callback = idleStatus;
		}

		return this.internal.setStatus(idleStatus, gameID).then(callback, errCB(callback));
	};

	//def sendTyping

	Client.prototype.sendTyping = function sendTyping(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.sendTyping(channel).then(callback, errCB(callback));
	};

	// def setTopic

	Client.prototype.setTopic = function setTopic(channel, topic) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.setTopic(channel, topic).then(callback, errCB(callback));
	};

	//def setChannelName

	Client.prototype.setChannelName = function setChannelName(channel, name) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.setChannelName(channel, name).then(callback, errCB(callback));
	};

	//def setChannelNameAndTopic

	Client.prototype.setChannelNameAndTopic = function setChannelNameAndTopic(channel, name, topic) {
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*err*/{} : arguments[3];

		return this.internal.setChannelNameAndTopic(channel, name, topic).then(callback, errCB(callback));
	};

	//def updateChannel

	Client.prototype.updateChannel = function updateChannel(channel, data) {
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function () /*err*/{} : arguments[2];

		return this.internal.updateChannel(channel, data).then(callback, errCB(callback));
	};

	//def startTyping

	Client.prototype.startTyping = function startTyping(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.startTyping(channel).then(callback, errCB(callback));
	};

	//def stopTyping

	Client.prototype.stopTyping = function stopTyping(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.stopTyping(channel).then(callback, errCB(callback));
	};

	//def updateDetails

	Client.prototype.updateDetails = function updateDetails(details) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.updateDetails(details).then(callback, errCB(callback));
	};

	//def setUsername

	Client.prototype.setUsername = function setUsername(name) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.setUsername(name).then(callback, errCB(callback));
	};

	//def setAvatar

	Client.prototype.setAvatar = function setAvatar(avatar) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.setAvatar(avatar).then(callback, errCB(callback));
	};

	//def joinVoiceChannel

	Client.prototype.joinVoiceChannel = function joinVoiceChannel(channel) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function () /*err*/{} : arguments[1];

		return this.internal.joinVoiceChannel(channel).then(function (chan) {
			callback(null, chan);
			return chan;
		}, errCB(callback));
	};

	// def leaveVoiceChannel

	Client.prototype.leaveVoiceChannel = function leaveVoiceChannel() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err*/{} : arguments[0];

		return this.internal.leaveVoiceChannel().then(callback, errCB(callback));
	};

	// def awaitResponse

	Client.prototype.awaitResponse = function awaitResponse(msg) {
		var toSend = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

		var _this = this;

		var options = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
		var callback = arguments.length <= 3 || arguments[3] === undefined ? function () /*e, newMsg*/{} : arguments[3];

		var ret;

		if (toSend) {
			if (typeof toSend === "function") {
				// (msg, callback)
				callback = toSend;
			} else {
				// (msg, toSend, ...)
				if (options) {
					if (typeof options === "function") {
						//(msg, toSend, callback)
						callback = options;
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
			return _this.internal.awaitResponse(msg);
		}).then(function (newMsg) {
			callback(null, newMsg);
			return newMsg;
		}, errCB(callback));
	};

	Client.prototype.setStatusIdle = function setStatusIdle() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err*/{} : arguments[0];

		return this.internal.setStatus("idle").then(callback, errCB(callback));
	};

	Client.prototype.setStatusOnline = function setStatusOnline() {
		var callback = arguments.length <= 0 || arguments[0] === undefined ? function () /*err*/{} : arguments[0];

		return this.internal.setStatus("online").then(callback, errCB(callback));
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
		return this.setStatus(null, game);
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
	}]);

	return Client;
})(_events2["default"]);

exports["default"] = Client;
module.exports = exports["default"];