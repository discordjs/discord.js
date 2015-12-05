"use strict";

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _superagent = require("superagent");

var _superagent2 = _interopRequireDefault(_superagent);

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _ConnectionState = require("./ConnectionState");

var _ConnectionState2 = _interopRequireDefault(_ConnectionState);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _Constants = require("../Constants");

var _UtilCache = require("../Util/Cache");

var _UtilCache2 = _interopRequireDefault(_UtilCache);

var _ResolverResolver = require("./Resolver/Resolver");

var _ResolverResolver2 = _interopRequireDefault(_ResolverResolver);

var _StructuresUser = require("../Structures/User");

var _StructuresUser2 = _interopRequireDefault(_StructuresUser);

var _StructuresChannel = require("../Structures/Channel");

var _StructuresChannel2 = _interopRequireDefault(_StructuresChannel);

var _StructuresTextChannel = require("../Structures/TextChannel");

var _StructuresTextChannel2 = _interopRequireDefault(_StructuresTextChannel);

var _StructuresVoiceChannel = require("../Structures/VoiceChannel");

var _StructuresVoiceChannel2 = _interopRequireDefault(_StructuresVoiceChannel);

var _StructuresPMChannel = require("../Structures/PMChannel");

var _StructuresPMChannel2 = _interopRequireDefault(_StructuresPMChannel);

var _StructuresServer = require("../Structures/Server");

var _StructuresServer2 = _interopRequireDefault(_StructuresServer);

var _StructuresMessage = require("../Structures/Message");

var _StructuresMessage2 = _interopRequireDefault(_StructuresMessage);

var _StructuresRole = require("../Structures/Role");

var _StructuresRole2 = _interopRequireDefault(_StructuresRole);

var _StructuresInvite = require("../Structures/Invite");

var _StructuresInvite2 = _interopRequireDefault(_StructuresInvite);

var _VoiceVoiceConnection = require("../Voice/VoiceConnection");

var _VoiceVoiceConnection2 = _interopRequireDefault(_VoiceVoiceConnection);

var zlib;

//todo: move this somewhere else
var originalEnd = _superagent2["default"].Request.prototype.end;
_superagent2["default"].Request.prototype.end = function (callback) {
	var _this = this;

	return new Promise(function (resolve, reject) {
		originalEnd.call(_this, function (err, response) {
			if (callback) {
				callback(err, response);
			}

			if (err) {
				return reject(err);
			}
			resolve(response);
		});
	});
};

function waitFor(condition) {
	var value = arguments.length <= 1 || arguments[1] === undefined ? condition : arguments[1];
	var interval = arguments.length <= 2 || arguments[2] === undefined ? 20 : arguments[2];
	return (function () {
		return new Promise(function (resolve) {
			var int = setInterval(function () {
				var isDone = condition();
				if (isDone) {
					if (condition === value) {
						resolve(isDone);
					} else {
						resolve(value(isDone));
					}
					return clearInterval(int);
				}
			}, interval);
		});
	})();
}

function delay(ms) {
	return new Promise(function (resolve) {
		return setTimeout(resolve, ms);
	});
}

var InternalClient = (function () {
	function InternalClient(discordClient) {
		_classCallCheck(this, InternalClient);

		this.client = discordClient;
		this.state = _ConnectionState2["default"].IDLE;
		this.websocket = null;

		if (this.client.options.compress) {
			zlib = require("zlib");
		}

		// creates 4 caches with discriminators based on ID
		this.users = new _UtilCache2["default"]();
		this.channels = new _UtilCache2["default"]();
		this.servers = new _UtilCache2["default"]();
		this.private_channels = new _UtilCache2["default"]();
		this.typingIntervals = [];
		this.voiceConnection = null;
		this.resolver = new _ResolverResolver2["default"](this);
		this.readyTime = null;

		this.messageAwaits = {};
	}

	//def leaveVoiceChannel

	InternalClient.prototype.leaveVoiceChannel = function leaveVoiceChannel() {
		if (this.voiceConnection) {
			this.voiceConnection.destroy();
			this.voiceConnection = null;
		}
		return Promise.resolve();
	};

	//def awaitResponse

	InternalClient.prototype.awaitResponse = function awaitResponse(msg) {
		var _this2 = this;

		return new Promise(function (resolve, reject) {

			msg = _this2.resolver.resolveMessage(msg);

			if (!msg) {
				reject(new Error("message undefined"));
				return;
			}

			var awaitID = msg.channel.id + msg.author.id;

			if (!_this2.messageAwaits[awaitID]) {
				_this2.messageAwaits[awaitID] = [];
			}

			_this2.messageAwaits[awaitID].push(resolve);
		});
	};

	//def joinVoiceChannel

	InternalClient.prototype.joinVoiceChannel = function joinVoiceChannel(chann) {
		var _this3 = this;

		var channel = this.resolver.resolveVoiceChannel(chann);

		if (!channel) {
			return Promise.reject(new Error("voice channel does not exist"));
		}
		return this.leaveVoiceChannel().then(function () {
			return new Promise(function (resolve, reject) {
				var session,
				    token,
				    server = channel.server,
				    endpoint;

				var check = function check(m) {
					var data = JSON.parse(m);
					if (data.t === "VOICE_STATE_UPDATE") {
						session = data.d.session_id;
					} else if (data.t === "VOICE_SERVER_UPDATE") {
						token = data.d.token;
						endpoint = data.d.endpoint;
						var chan = _this3.voiceConnection = new _VoiceVoiceConnection2["default"](channel, _this3.client, session, token, server, endpoint);

						chan.on("ready", function () {
							return resolve(chan);
						});
						chan.on("error", reject);

						_this3.client.emit("debug", "removed temporary voice websocket listeners");
						_this3.websocket.removeListener("message", check);
					}
				};

				_this3.websocket.on("message", check);
				_this3.sendWS({
					op: 4,
					d: {
						"guild_id": server.id,
						"channel_id": channel.id,
						"self_mute": false,
						"self_deaf": false
					}
				});
			});
		});
	};

	// def createServer

	InternalClient.prototype.createServer = function createServer(name) {
		var _this4 = this;

		var region = arguments.length <= 1 || arguments[1] === undefined ? "london" : arguments[1];

		name = this.resolver.resolveString(name);

		return _superagent2["default"].post(_Constants.Endpoints.SERVERS).set("authorization", this.token).send({ name: name, region: region }).end().then(function (res) {
			// valid server, wait until it is cached
			return waitFor(function () {
				return _this4.servers.get("id", res.body.id);
			});
		});
	};

	//def joinServer

	InternalClient.prototype.joinServer = function joinServer(invite) {
		var _this5 = this;

		invite = this.resolver.resolveInviteID(invite);
		if (!invite) {
			return Promise.reject(new Error("Not a valid invite"));
		}
		return _superagent2["default"].post(_Constants.Endpoints.INVITE(invite)).set("authorization", this.token).end().then(function (res) {
			// valid server, wait until it is received via ws and cached
			return waitFor(function () {
				return _this5.servers.get("id", res.body.guild.id);
			});
		});
	};

	//def leaveServer

	InternalClient.prototype.leaveServer = function leaveServer(srv) {
		var _this6 = this;

		var server = this.resolver.resolveServer(srv);
		if (!server) {
			return Promise.reject(new Error("server did not resolve"));
		}

		return _superagent2["default"].del(_Constants.Endpoints.SERVER(server.id)).set("authorization", this.token).end().then(function () {
			// remove channels of server then the server
			for (var _iterator = server.channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var chan = _ref;

				_this6.channels.remove(chan);
			}
			// remove server
			_this6.servers.remove(server);
		});
	};

	// def login

	InternalClient.prototype.login = function login(email, password) {
		var _this7 = this;

		var client = this.client;
		if (this.state !== _ConnectionState2["default"].DISCONNECTED && this.state !== _ConnectionState2["default"].IDLE) {
			return Promise.reject(new Error("already logging in/logged in/ready!"));
		}

		this.state = _ConnectionState2["default"].LOGGING_IN;

		return _superagent2["default"].post(_Constants.Endpoints.LOGIN).send({
			email: email,
			password: password
		}).end().then(function (res) {
			var token = res.body.token;
			_this7.state = _ConnectionState2["default"].LOGGED_IN;
			_this7.token = token;
			_this7.email = email;
			_this7.password = password;

			return _this7.getGateway().then(function (url) {
				_this7.createWS(url);
				return token;
			});
		}, function (error) {
			_this7.websocket = null;
			throw error;
		})["catch"](function (error) {
			_this7.state = _ConnectionState2["default"].DISCONNECTED;
			client.emit("disconnected");
			throw error;
		});
	};

	// def logout

	InternalClient.prototype.logout = function logout() {
		var _this8 = this;

		if (this.state === _ConnectionState2["default"].DISCONNECTED || this.state === _ConnectionState2["default"].IDLE) {
			return Promise.reject(new Error("Client is not logged in!"));
		}

		return _superagent2["default"].post(_Constants.Endpoints.LOGOUT).set("authorization", this.token).end().then(function () {
			if (_this8.websocket) {
				_this8.websocket.close();
				_this8.websocket = null;
			}
			_this8.token = null;
			_this8.email = null;
			_this8.password = null;
			_this8.state = _ConnectionState2["default"].DISCONNECTED;
		});
	};

	// def startPM

	InternalClient.prototype.startPM = function startPM(resUser) {
		var _this9 = this;

		var user = this.resolver.resolveUser(resUser);
		if (!user) {
			return Promise.reject(new Error("Unable to resolve resUser to a User"));
		}
		// start the PM
		return _superagent2["default"].post("" + _Constants.Endpoints.USER_CHANNELS(user.id)).set("authorization", this.token).send({
			recipient_id: user.id
		}).end().then(function (res) {
			return _this9.private_channels.add(new _StructuresPMChannel2["default"](res.body, _this9.client));
		});
	};

	// def getGateway

	InternalClient.prototype.getGateway = function getGateway() {
		return _superagent2["default"].get(_Constants.Endpoints.GATEWAY).set("authorization", this.token).end().then(function (res) {
			return res.body.url;
		});
	};

	// def sendMessage

	InternalClient.prototype.sendMessage = function sendMessage(where, _content) {
		var _this10 = this;

		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		return this.resolver.resolveChannel(where).then(function (destination) {
			//var destination;
			var content = _this10.resolver.resolveString(_content);
			var mentions = _this10.resolver.resolveMentions(content);

			return _superagent2["default"].post(_Constants.Endpoints.CHANNEL_MESSAGES(destination.id)).set("authorization", _this10.token).send({
				content: content,
				mentions: mentions,
				tts: options.tts
			}).end().then(function (res) {
				return destination.messages.add(new _StructuresMessage2["default"](res.body, destination, _this10.client));
			});
		});
	};

	// def deleteMessage

	InternalClient.prototype.deleteMessage = function deleteMessage(_message) {
		var _this11 = this;

		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		var message = this.resolver.resolveMessage(_message);
		if (!message) {
			return Promise.reject(new Error("Supplied message did not resolve to a message!"));
		}

		var chain = options.wait ? delay(options.wait) : Promise.resolve();
		return chain.then(function () {
			return _superagent2["default"].del(_Constants.Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id)).set("authorization", _this11.token).end();
		}).then(function () {
			return message.channel.messages.remove(message);
		});
	};

	// def updateMessage

	InternalClient.prototype.updateMessage = function updateMessage(msg, _content) {
		var _this12 = this;

		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var message = this.resolver.resolveMessage(msg);

		if (!message) {
			return Promise.reject(new Error("Supplied message did not resolve to a message!"));
		}

		var content = this.resolver.resolveString(_content);
		var mentions = this.resolver.resolveMentions(content);

		return _superagent2["default"].patch(_Constants.Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id)).set("authorization", this.token).send({
			content: content,
			tts: options.tts,
			mentions: mentions
		}).end().then(function (res) {
			return message.channel.messages.update(message, new _StructuresMessage2["default"](res.body, message.channel, _this12.client));
		});
	};

	// def sendFile

	InternalClient.prototype.sendFile = function sendFile(where, _file) {
		var _this13 = this;

		var name = arguments.length <= 2 || arguments[2] === undefined ? "image.png" : arguments[2];

		return this.resolver.resolveChannel(where).then(function (channel) {
			return _superagent2["default"].post(_Constants.Endpoints.CHANNEL_MESSAGES(channel.id)).set("authorization", _this13.token).attach("file", _this13.resolver.resolveFile(_file), name).end().then(function (res) {
				return channel.messages.add(new _StructuresMessage2["default"](res.body, channel, _this13.client));
			});
		});
	};

	// def getChannelLogs

	InternalClient.prototype.getChannelLogs = function getChannelLogs(_channel) {
		var _this14 = this;

		var limit = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		return this.resolver.resolveChannel(_channel).then(function (channel) {
			var qsObject = { limit: limit };
			if (options.before) {
				var res = _this14.resolver.resolveMessage(options.before);
				if (res) {
					qsObject.before = res;
				}
			}
			if (options.after) {
				var res = _this14.resolver.resolveMessage(options.after);
				if (res) {
					qsObject.after = res;
				}
			}

			return _superagent2["default"].get(_Constants.Endpoints.CHANNEL_MESSAGES(channel.id) + "?" + _querystring2["default"].stringify(qsObject)).set("authorization", _this14.token).end().then(function (res) {
				return res.body.map(function (msg) {
					return channel.messages.add(new _StructuresMessage2["default"](msg, channel, _this14.client));
				});
			});
		});
	};

	// def getBans

	InternalClient.prototype.getBans = function getBans(server) {
		var _this15 = this;

		server = this.resolver.resolveServer(server);

		return _superagent2["default"].get("" + _Constants.Endpoints.SERVER_BANS(server.id)).set("authorization", this.token).end().then(function (res) {
			res.body.map(function (ban) {
				return _this15.users.add(new _StructuresUser2["default"](ban.user, _this15.client));
			});
		});
	};

	// def createChannel

	InternalClient.prototype.createChannel = function createChannel(server, name) {
		var _this16 = this;

		var type = arguments.length <= 2 || arguments[2] === undefined ? "text" : arguments[2];

		server = this.resolver.resolveServer(server);

		return _superagent2["default"].post(_Constants.Endpoints.SERVER_CHANNELS(server.id)).set("authorization", this.token).send({
			name: name,
			type: type
		}).end().then(function (res) {
			var channel;
			if (res.body.type === "text") {
				channel = new _StructuresTextChannel2["default"](res.body, _this16.client, server);
			} else {
				channel = new _StructuresVoiceChannel2["default"](res.body, _this16.client, server);
			}
			return server.channels.add(_this16.channels.add(channel));
		});
	};

	// def deleteChannel

	InternalClient.prototype.deleteChannel = function deleteChannel(_channel) {
		var _this17 = this;

		return this.resolver.resolveChannel(_channel).then(function (channel) {
			return _superagent2["default"].del(_Constants.Endpoints.CHANNEL(channel.id)).set("authorization", _this17.token).end().then(function () {
				channel.server.channels.remove(channel);
				_this17.channels.remove(channel);
			});
		}, function (error) {
			error.message = "Couldn't resolve to channel - " + error.toString();
			throw error;
		});
	};

	// def banMember

	InternalClient.prototype.banMember = function banMember(user, server) {
		var length = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);

		return _superagent2["default"].put(_Constants.Endpoints.SERVER_BANS(server.id) + "/" + user.id + "?delete-message-days=" + length).set("authorization", this.token).end(); //will expose api result, probably not bad tho
	};

	// def unbanMember

	InternalClient.prototype.unbanMember = function unbanMember(user, server) {

		server = this.resolver.resolveServer(server);
		user = this.resolver.resolveUser(user);

		return _superagent2["default"].del(_Constants.Endpoints.SERVER_BANS(server.id) + "/" + user.id).set("authorization", this.token).end(); //will expose api result, probably not bad tho
	};

	// def kickMember

	InternalClient.prototype.kickMember = function kickMember(user, server) {
		user = this.resolver.resolveUser(user);
		server = this.resolver.resolveServer(server);

		return _superagent2["default"].del(_Constants.Endpoints.SERVER_MEMBERS(server.id) + "/" + user.id).set("authorization", this.token).end();
	};

	// def createRole

	InternalClient.prototype.createRole = function createRole(server, data) {
		var _this18 = this;

		server = this.resolver.resolveServer(server);

		return _superagent2["default"].post(_Constants.Endpoints.SERVER_ROLES(server.id)).set("authorization", this.token).end().then(function (res) {
			var role = server.roles.add(new _StructuresRole2["default"](res.body, server, _this18.client));

			if (data) {
				return _this18.updateRole(role, data);
			}
			return role;
		});
	};

	// def updateRole

	InternalClient.prototype.updateRole = function updateRole(role, data) {
		var _this19 = this;

		var server = this.resolver.resolveServer(role.server);

		var newData = {
			color: data.color || role.color,
			hoist: data.hoist || role.hoist,
			name: data.name || role.name,
			permissions: role.permissions || 0
		};

		if (data.permissions) {
			newData.permissions = 0;
			for (var _iterator2 = data.permissions, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var perm = _ref2;

				if (perm instanceof String || typeof perm === "string") {
					newData.permissions |= _Constants.Permissions[perm] || 0;
				} else {
					newData.permissions |= perm;
				}
			}
		}

		return _superagent2["default"].patch(_Constants.Endpoints.SERVER_ROLES(server.id) + "/" + role.id).set("authorization", this.token).send(newData).end().then(function (res) {
			return server.roles.update(role, new _StructuresRole2["default"](res.body, server, _this19.client));
		});
	};

	// def deleteRole

	InternalClient.prototype.deleteRole = function deleteRole(role) {
		return _superagent2["default"].del(_Constants.Endpoints.SERVER_ROLES(role.server.id) + "/" + role.id).set("authorization", this.token).end();
	};

	//def addMemberToRole

	InternalClient.prototype.addMemberToRole = function addMemberToRole(member, role) {
		member = this.resolver.resolveUser(member);

		if (!member || !role) {
			return Promise.reject(new Error("member/role not in server"));
		}

		if (!role.server.memberMap[member.id]) {
			return Promise.reject(new Error("member not in server"));
		}

		var roleIDS = role.server.memberMap[member.id].roles.map(function (r) {
			return r.id;
		}).concat(role.id);

		return _superagent2["default"].patch(_Constants.Endpoints.SERVER_MEMBERS(role.server.id) + "/" + member.id).set("authorization", this.token).send({
			roles: roleIDS
		}).end();
	};

	//def removeMemberFromRole

	InternalClient.prototype.removeMemberFromRole = function removeMemberFromRole(member, role) {
		member = this.resolver.resolveUser(member);

		if (!member || !role) {
			return Promise.reject(new Error("member/role not in server"));
		}

		if (!role.server.memberMap[member.id]) {
			return Promise.reject(new Error("member not in server"));
		}

		var roleIDS = role.server.memberMap[member.id].roles.map(function (r) {
			return r.id;
		});

		for (var item in roleIDS) {
			if (roleIDS[item] === role.id) {
				roleIDS.splice(item, 1);
				//missing break?
			}
		}

		return _superagent2["default"].patch(_Constants.Endpoints.SERVER_MEMBERS(role.server.id) + "/" + member.id).set("authorization", this.token).send({
			roles: roleIDS
		}).end();
	};

	// def createInvite

	InternalClient.prototype.createInvite = function createInvite(chanServ, options) {
		var _this20 = this;

		if (chanServ instanceof _StructuresChannel2["default"]) {
			// do something
		} else if (chanServ instanceof _StructuresServer2["default"]) {
				// do something
			} else {
					chanServ = this.resolver.resolveServer(chanServ) || this.resolver.resolveChannel(chanServ);
				}

		if (!chanServ) {
			throw new Error("couldn't resolve where");
		}

		if (!options) {
			options = {
				validate: null
			};
		} else {
			options.max_age = options.maxAge || 0;
			options.max_uses = options.maxUses || 0;
			options.temporary = options.temporary || false;
			options.xkcdpass = options.xkcd || false;
		}

		var epoint;
		if (chanServ instanceof _StructuresChannel2["default"]) {
			epoint = _Constants.Endpoints.CHANNEL_INVITES(chanServ.id);
		} else {
			epoint = _Constants.Endpoints.SERVER_INVITES(chanServ.id);
		}

		return _superagent2["default"].post(epoint).set("authorization", this.token).send(options).end().then(function (res) {
			return new _StructuresInvite2["default"](res.body, _this20.channels.get("id", res.body.channel.id), _this20.client);
		});
	};

	//def deleteInvite

	InternalClient.prototype.deleteInvite = function deleteInvite(invite) {

		invite = this.resolver.resolveInviteID(invite);
		if (!invite) {
			throw new Error("Not a valid invite");
		}
		return _superagent2["default"].del(_Constants.Endpoints.INVITE(invite)).set("authorization", this.token).end();
	};

	//def overwritePermissions

	InternalClient.prototype.overwritePermissions = function overwritePermissions(channel, role, updated) {
		var _this21 = this;

		return this.resolver.resolveChannel(channel).then(function (channel) {
			var user;
			if (role instanceof _StructuresUser2["default"]) {
				user = role;
			}

			var data = {};
			data.allow = 0;
			data.deny = 0;

			updated.allow = updated.allow || [];
			updated.deny = updated.deny || [];

			if (role instanceof _StructuresRole2["default"]) {
				data.id = role.id;
				data.type = "role";
			} else if (user) {
				data.id = user.id;
				data.type = "member";
			} else {
				throw new Error("role incorrect");
			}

			for (var perm in updated) {
				if (updated[perm]) {
					if (perm instanceof String || typeof perm === "string") {
						data.allow |= _Constants.Permissions[perm] || 0;
					} else {
						data.allow |= perm;
					}
				} else {
					if (perm instanceof String || typeof perm === "string") {
						data.deny |= _Constants.Permissions[perm] || 0;
					} else {
						data.deny |= perm;
					}
				}
			}

			return _superagent2["default"].put(_Constants.Endpoints.CHANNEL_PERMISSIONS(channel.id) + "/" + data.id).set("authorization", _this21.token).send(data).end();
		});
	};

	//def setStatus

	InternalClient.prototype.setStatus = function setStatus(idleStatus, gameID) {

		this.idleStatus = idleStatus || this.idleStatus || null;
		if (idleStatus) {
			if (idleStatus === "online" || idleStatus === "here" || idleStatus === "available") {
				this.idleStatus = null;
			}
		}
		this.gameID = this.resolver.resolveGameID(gameID) || this.gameID || null;

		var packet = {
			op: 3,
			d: {
				idle_since: this.idleStatus,
				game_id: this.gameID
			}
		};

		if (this.idleStatus === "idle" || this.idleStatus === "away") {
			packet.d.idle_since = Date.now();
		}

		this.sendWS(packet);

		return Promise.resolve(); //why?
	};

	//def sendTyping

	InternalClient.prototype.sendTyping = function sendTyping(channel) {
		var _this22 = this;

		return this.resolver.resolveChannel(channel).then(function (channel) {
			return _superagent2["default"].post(_Constants.Endpoints.CHANNEL(channel.id) + "/typing").set("authorization", _this22.token).end();
		});
	};

	//def startTyping

	InternalClient.prototype.startTyping = function startTyping(channel) {
		var _this23 = this;

		return this.resolver.resolveChannel(channel).then(function (channel) {

			if (_this23.typingIntervals[channel.id]) {
				// typing interval already exists, leave it alone
				throw new Error("Already typing in that channel");
			}

			_this23.typingIntervals[channel.id] = setInterval(function () {
				return _this23.sendTyping(channel)["catch"](function (error) {
					return _this23.emit("error", error);
				});
			}, 4000);

			return _this23.sendTyping(channel);
		});
	};

	//def stopTyping

	InternalClient.prototype.stopTyping = function stopTyping(channel) {
		var _this24 = this;

		return this.resolver.resolveChannel(channel).then(function (channel) {

			if (!_this24.typingIntervals[channel.id]) {
				// typing interval doesn't exist
				throw new Error("Not typing in that channel");
			}

			clearInterval(_this24.typingIntervals[channel.id]);
			_this24.typingIntervals[channel.id] = false;
		});
	};

	//def updateDetails

	InternalClient.prototype.updateDetails = function updateDetails(data) {
		return _superagent2["default"].patch(_Constants.Endpoints.ME).set("authorization", this.token).send({
			avatar: this.resolver.resolveToBase64(data.avatar) || this.user.avatar,
			email: data.email || this.email,
			new_password: data.newPassword || null,
			password: data.password || this.password,
			username: data.username || this.user.username
		}).end();
	};

	//def setAvatar

	InternalClient.prototype.setAvatar = function setAvatar(avatar) {
		return this.updateDetails({ avatar: avatar });
	};

	//def setUsername

	InternalClient.prototype.setUsername = function setUsername(username) {
		return this.updateDetails({ username: username });
	};

	//def setTopic

	InternalClient.prototype.setTopic = function setTopic(chann) {
		var _this25 = this;

		var topic = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

		return this.resolver.resolveChannel(chann).then(function (channel) {
			return _superagent2["default"].patch(_Constants.Endpoints.CHANNEL(channel.id)).set("authorization", _this25.token).send({
				name: channel.name,
				position: channel.position,
				topic: topic
			}).end().then(function (res) {
				return channel.topic = res.body.topic;
			});
		});
	};

	//def setChannelName

	InternalClient.prototype.setChannelName = function setChannelName(chann) {
		var _this26 = this;

		var name = arguments.length <= 1 || arguments[1] === undefined ? "discordjs_is_the_best" : arguments[1];

		return this.resolver.resolveChannel(chann).then(function (channel) {
			return _superagent2["default"].patch(_Constants.Endpoints.CHANNEL(channel.id)).set("authorization", _this26.token).send({
				name: name,
				position: channel.position,
				topic: channel.topic
			}).end().then(function (res) {
				return channel.name = res.body.name;
			});
		});
	};

	//def setChannelNameAndTopic

	InternalClient.prototype.setChannelNameAndTopic = function setChannelNameAndTopic(chann) {
		var _this27 = this;

		var name = arguments.length <= 1 || arguments[1] === undefined ? "discordjs_is_the_best" : arguments[1];
		var topic = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

		return this.resolver.resolveChannel(chann).then(function (channel) {
			return _superagent2["default"].patch(_Constants.Endpoints.CHANNEL(channel.id)).set("authorization", _this27.token).send({
				name: name,
				position: channel.position,
				topic: topic
			}).end().then(function (res) {
				channel.name = res.body.name;
				channel.topic = res.body.topic;
			});
		});
	};

	//def updateChannel

	InternalClient.prototype.updateChannel = function updateChannel(chann, data) {
		return this.setChannelNameAndTopic(chann, data.name, data.topic);
	};

	//def ack

	InternalClient.prototype.ack = function ack(msg) {
		msg = this.resolver.resolveMessage(msg);

		if (!msg) {
			Promise.reject(new Error("Message does not exist"));
		}

		return _superagent2["default"].post(_Constants.Endpoints.CHANNEL_MESSAGE(msg.channel.id, msg.id) + "/ack").set("authorization", this.token).end();
	};

	InternalClient.prototype.sendWS = function sendWS(object) {
		if (this.websocket) {
			this.websocket.send(JSON.stringify(object));
		}
	};

	InternalClient.prototype.createWS = function createWS(url) {
		var self = this;
		var client = self.client;

		if (this.websocket) {
			return false;
		}

		this.websocket = new _ws2["default"](url);

		this.websocket.onopen = function () {

			self.sendWS({
				op: 2,
				d: {
					token: self.token,
					v: 3,
					compress: self.client.options.compress,
					properties: {
						"$os": "discord.js",
						"$browser": "discord.js",
						"$device": "discord.js",
						"$referrer": "discord.js",
						"$referring_domain": "discord.js"
					}
				}
			});
		};

		this.websocket.onclose = function () {
			self.websocket = null;
			self.state = _ConnectionState2["default"].DISCONNECTED;
			client.emit("disconnected");
		};

		this.websocket.onerror = function (e) {
			client.emit("error", e);
		};

		this.websocket.onmessage = function (e) {
			if (e.type === "Binary") {
				if (!zlib) zlib = require("zlib");
				e.data = zlib.inflateSync(e.data).toString();
			}

			var packet, data;
			try {
				packet = JSON.parse(e.data);
				data = packet.d;
			} catch (e) {
				client.emit("error", e);
				return;
			}

			client.emit("raw", packet);
			switch (packet.t) {

				case _Constants.PacketType.READY:
					var startTime = Date.now();
					self.user = self.users.add(new _StructuresUser2["default"](data.user, client));
					data.guilds.forEach(function (server) {
						self.servers.add(new _StructuresServer2["default"](server, client));
					});
					data.private_channels.forEach(function (pm) {
						self.private_channels.add(new _StructuresPMChannel2["default"](pm, client));
					});
					self.state = _ConnectionState2["default"].READY;

					setInterval(function () {
						return self.sendWS({ op: 1, d: Date.now() });
					}, data.heartbeat_interval);

					client.emit("ready");
					client.emit("debug", "ready packet took " + (Date.now() - startTime) + "ms to process");
					client.emit("debug", "ready with " + self.servers.length + " servers, " + self.channels.length + " channels and " + self.users.length + " users cached.");

					self.readyTime = Date.now();
					break;

				case _Constants.PacketType.MESSAGE_CREATE:
					// format: https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
					var channel = self.channels.get("id", data.channel_id) || self.private_channels.get("id", data.channel_id);
					if (channel) {
						var msg = channel.messages.add(new _StructuresMessage2["default"](data, channel, client));

						if (self.messageAwaits[channel.id + msg.author.id]) {
							self.messageAwaits[channel.id + msg.author.id].map(function (fn) {
								return fn(msg);
							});
							self.messageAwaits[channel.id + msg.author.id] = null;
							client.emit("message", msg, true); //2nd param is isAwaitedMessage
						} else {
								client.emit("message", msg);
							}
						self.ack(msg);
					} else {
						client.emit("warn", "message created but channel is not cached");
					}
					break;
				case _Constants.PacketType.MESSAGE_DELETE:
					// format https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-delete
					var channel = self.channels.get("id", data.channel_id) || self.private_channels.get("id", data.channel_id);
					if (channel) {
						// potentially blank
						var msg = channel.messages.get("id", data.id);
						client.emit("messageDeleted", msg, channel);
						if (msg) {
							channel.messages.remove(msg);
						}
					} else {
						client.emit("warn", "message was deleted but channel is not cached");
					}
					break;
				case _Constants.PacketType.MESSAGE_UPDATE:
					// format https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
					var channel = self.channels.get("id", data.channel_id) || self.private_channels.get("id", data.channel_id);
					if (channel) {
						// potentially blank
						var msg = channel.messages.get("id", data.id);

						if (msg) {
							// old message exists
							data.nonce = data.nonce || msg.nonce;
							data.attachments = data.attachments || msg.attachments;
							data.tts = data.tts || msg.tts;
							data.embeds = data.embeds || msg.embeds;
							data.timestamp = data.timestamp || msg.timestamp;
							data.mention_everyone = data.mention_everyone || msg.everyoneMentioned;
							data.content = data.content || msg.content;
							data.mentions = data.mentions || msg.mentions;
							data.author = data.author || msg.author;
							var nmsg = channel.messages.update(msg, new _StructuresMessage2["default"](data, channel, client));
							client.emit("messageUpdated", nmsg, msg);
						}
					} else {
						client.emit("warn", "message was updated but channel is not cached");
					}
					break;
				case _Constants.PacketType.SERVER_CREATE:
					var server = self.servers.get("id", data.id);
					if (!server) {
						server = new _StructuresServer2["default"](data, client);
						self.servers.add(server);
						client.emit("serverCreated", server);
					}
					break;
				case _Constants.PacketType.SERVER_DELETE:
					var server = self.servers.get("id", data.id);
					if (server) {

						for (var _iterator3 = server.channels, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
							var _ref3;

							if (_isArray3) {
								if (_i3 >= _iterator3.length) break;
								_ref3 = _iterator3[_i3++];
							} else {
								_i3 = _iterator3.next();
								if (_i3.done) break;
								_ref3 = _i3.value;
							}

							var channel = _ref3;

							self.channels.remove(channel);
						}

						self.servers.remove(server);
						client.emit("serverDeleted", server);
					} else {
						client.emit("warn", "server was deleted but it was not in the cache");
					}
					break;
				case _Constants.PacketType.SERVER_UPDATE:
					var server = self.servers.get("id", data.id);
					if (server) {
						// server exists
						data.members = data.members || [];
						data.channels = data.channels || [];
						var newserver = new _StructuresServer2["default"](data, self);
						newserver.members = server.members;
						newserver.memberMap = server.memberMap;
						newserver.channels = server.channels;
						if (newserver.equalsStrict(server)) {
							// already the same don't do anything
							client.emit("debug", "received server update but server already updated");
						} else {
							self.servers.update(server, newserver);
							client.emit("serverUpdated", server, newserver);
						}
					} else if (!server) {
						client.emit("warn", "server was updated but it was not in the cache");
						self.servers.add(new _StructuresServer2["default"](data, self));
						client.emit("serverCreated", server);
					}
					break;
				case _Constants.PacketType.CHANNEL_CREATE:

					var channel = self.channels.get("id", data.id);

					if (!channel) {

						var server = self.servers.get("id", data.guild_id);
						if (server) {
							if (data.is_private) {
								client.emit("channelCreated", self.private_channels.add(new _StructuresPMChannel2["default"](data, client)));
							} else {
								var chan = null;
								if (data.type === "text") {
									chan = self.channels.add(new _StructuresTextChannel2["default"](data, client, server));
								} else {
									chan = self.channels.add(new _StructuresVoiceChannel2["default"](data, client, server));
								}
								client.emit("channelCreated", server.channels.add(chan));
							}
						} else {
							client.emit("warn", "channel created but server does not exist");
						}
					} else {
						client.emit("warn", "channel created but already in cache");
					}

					break;
				case _Constants.PacketType.CHANNEL_DELETE:
					var channel = self.channels.get("id", data.id);
					if (channel) {

						if (channel.server) // accounts for PMs
							channel.server.channels.remove(channel);

						self.channels.remove(channel);
						client.emit("channelDeleted", channel);
					} else {
						client.emit("warn", "channel deleted but already out of cache?");
					}
					break;
				case _Constants.PacketType.CHANNEL_UPDATE:
					var channel = self.channels.get("id", data.id) || self.private_channels.get("id", data.id);
					if (channel) {

						if (channel instanceof _StructuresPMChannel2["default"]) {
							//PM CHANNEL
							client.emit("channelUpdated", channel, self.private_channels.update(channel, new _StructuresPMChannel2["default"](data, client)));
						} else {
							if (channel.server) {
								if (channel.type === "text") {
									//TEXT CHANNEL
									var chan = new _StructuresTextChannel2["default"](data, client, channel.server);
									chan.messages = channel.messages;
									channel.server.channels.update(channel, chan);
									self.channels.update(channel, chan);
									client.emit("channelUpdated", channel, chan);
								} else {
									//VOICE CHANNEL
									var chan = new _StructuresVoiceChannel2["default"](data, client, channel.server);
									channel.server.channels.update(channel, chan);
									self.channels.update(channel, chan);
									client.emit("channelUpdated", channel, chan);
								}
							} else {
								client.emit("warn", "channel updated but server non-existant");
							}
						}
					} else {
						client.emit("warn", "channel updated but not in cache");
					}
					break;
				case _Constants.PacketType.SERVER_ROLE_CREATE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						client.emit("serverRoleCreated", server.roles.add(new _StructuresRole2["default"](data.role, server, client)), server);
					} else {
						client.emit("warn", "server role made but server not in cache");
					}
					break;
				case _Constants.PacketType.SERVER_ROLE_DELETE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						var role = server.roles.get("id", data.role_id);
						if (role) {
							server.roles.remove(role);
							client.emit("serverRoleDeleted", role);
						} else {
							client.emit("warn", "server role deleted but role not in cache");
						}
					} else {
						client.emit("warn", "server role deleted but server not in cache");
					}
					break;
				case _Constants.PacketType.SERVER_ROLE_UPDATE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						var role = server.roles.get("id", data.role.id);
						if (role) {
							var newRole = new _StructuresRole2["default"](data.role, server, client);
							server.roles.update(role, newRole);
							client.emit("serverRoleUpdated", role, newRole);
						} else {
							client.emit("warn", "server role updated but role not in cache");
						}
					} else {
						client.emit("warn", "server role updated but server not in cache");
					}
					break;
				case _Constants.PacketType.SERVER_MEMBER_ADD:
					var server = self.servers.get("id", data.guild_id);
					if (server) {

						server.memberMap[data.user.id] = {
							roles: data.roles.map(function (pid) {
								return server.roles.get("id", pid);
							}),
							mute: false,
							deaf: false,
							joinedAt: Date.parse(data.joined_at)
						};

						client.emit("serverNewMember", server, server.members.add(self.users.add(new _StructuresUser2["default"](data.user, client))));
					} else {
						client.emit("warn", "server member added but server doesn't exist in cache");
					}
					break;
				case _Constants.PacketType.SERVER_MEMBER_REMOVE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						var user = self.users.get("id", data.user.id);
						if (user) {
							server.memberMap[data.user.id] = null;
							server.members.remove(user);
							client.emit("serverMemberRemoved", server, user);
						} else {
							client.emit("warn", "server member removed but user doesn't exist in cache");
						}
					} else {
						client.emit("warn", "server member removed but server doesn't exist in cache");
					}
					break;
				case _Constants.PacketType.SERVER_MEMBER_UPDATE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						var user = self.users.get("id", data.user.id);
						if (user) {
							server.memberMap[data.user.id].roles = data.roles.map(function (pid) {
								return server.roles.get("id", pid);
							});
							server.memberMap[data.user.id].mute = data.mute;
							server.memberMap[data.user.id].deaf = data.deaf;
							client.emit("serverMemberUpdated", server, user);
						} else {
							client.emit("warn", "server member removed but user doesn't exist in cache");
						}
					} else {
						client.emit("warn", "server member updated but server doesn't exist in cache");
					}
					break;
				case _Constants.PacketType.PRESENCE_UPDATE:

					var user = self.users.get("id", data.user.id);

					if (user) {

						data.user.username = data.user.username || user.username;
						data.user.id = data.user.id || user.id;
						data.user.avatar = data.user.avatar || user.avatar;
						data.user.discriminator = data.user.discriminator || user.discriminator;

						var presenceUser = new _StructuresUser2["default"](data.user, client);

						if (presenceUser.equals(user)) {
							// a real presence update
							client.emit("presence", user, data.status, data.game_id);
							user.status = data.status;
							user.gameID = data.game_id;
						} else {
							// a name change or avatar change
							client.emit("userUpdated", user, presenceUser);
							self.users.update(user, presenceUser);
						}
					} else {
						client.emit("warn", "presence update but user not in cache");
					}

					break;
				case _Constants.PacketType.TYPING:

					var user = self.users.get("id", data.user_id);
					var channel = self.channels.get("id", data.channel_id) || self.private_channels.get("id", data.channel_id);

					if (user && channel) {
						if (user.typing.since) {
							user.typing.since = Date.now();
							user.typing.channel = channel;
						} else {
							user.typing.since = Date.now();
							user.typing.channel = channel;
							client.emit("userTypingStarted", user, channel);
						}
						setTimeout(function () {
							if (Date.now() - user.typing.since > 5500) {
								// they haven't typed since
								user.typing.since = null;
								user.typing.channel = null;
								client.emit("userTypingStopped", user, channel);
							}
						}, 6000);
					} else {
						client.emit("warn", "user typing but user or channel not existant in cache");
					}
					break;
				case _Constants.PacketType.SERVER_BAN_ADD:
					var user = self.users.get("id", data.user.id);
					var server = self.servers.get("id", data.guild_id);

					if (user && server) {
						client.emit("userBanned", user, server);
					} else {
						client.emit("warn", "user banned but user/server not in cache.");
					}
					break;
				case _Constants.PacketType.SERVER_BAN_REMOVE:
					var user = self.users.get("id", data.user.id);
					var server = self.servers.get("id", data.guild_id);

					if (user && server) {
						client.emit("userUnbanned", user, server);
					} else {
						client.emit("warn", "user unbanned but user/server not in cache.");
					}
					break;
			}
		};
	};

	_createClass(InternalClient, [{
		key: "uptime",
		get: function get() {
			return this.readyTime ? Date.now() - this.readyTime : null;
		}
	}]);

	return InternalClient;
})();

exports["default"] = InternalClient;
module.exports = exports["default"];
