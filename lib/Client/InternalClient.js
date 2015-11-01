"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require("events");
var request = require("superagent");
var WebSocket = require("ws");
var ConnectionState = require("./ConnectionState.js");

var Constants = require("../Constants.js"),
    Endpoints = Constants.Endpoints,
    PacketType = Constants.PacketType;

var Cache = require("../Util/Cache.js");
var Resolver = require("./Resolver/Resolver.js");

var User = require("../Structures/User.js"),
    Channel = require("../Structures/Channel.js"),
    TextChannel = require("../Structures/TextChannel.js"),
    VoiceChannel = require("../Structures/VoiceChannel.js"),
    PMChannel = require("../Structures/PMChannel.js"),
    Server = require("../Structures/Server.js"),
    Message = require("../Structures/Message.js");

var zlib;

var InternalClient = (function () {
	function InternalClient(discordClient) {
		_classCallCheck(this, InternalClient);

		this.client = discordClient;
		this.state = ConnectionState.IDLE;
		this.websocket = null;

		if (this.client.options.compress) {
			zlib = require("zlib");
		}

		// creates 4 caches with discriminators based on ID
		this.users = new Cache();
		this.channels = new Cache();
		this.servers = new Cache();
		this.private_channels = new Cache();
		this.resolver = new Resolver(this);
	}

	// def createServer

	InternalClient.prototype.createServer = function createServer(name) {
		var region = arguments.length <= 1 || arguments[1] === undefined ? "london" : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {
			name = self.resolver.resolveString(name);

			request.post(Endpoints.SERVERS).set("authorization", self.token).send({ name: name, region: region }).end(function (err, res) {
				if (err) {
					reject(new Error(err.response.text));
				} else {
					// valid server, wait until it is cached
					var inter = setInterval(function () {
						if (self.servers.get("id", res.body.id)) {
							clearInterval(inter);
							resolve(self.servers.get("id", res.body.id));
						}
					}, 20);
				}
			});
		});
	};

	//def leaveServer

	InternalClient.prototype.leaveServer = function leaveServer(srv) {
		var self = this;
		return new Promise(function (resolve, reject) {
			var server = self.resolver.resolveServer(srv);
			if (server) {

				request.del(Endpoints.SERVER(server.id)).set("authorization", self.token).end(function (err, res) {
					if (err) {
						reject(new Error(err.response.text));
					} else {
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

							self.channels.remove(chan);
						}
						// remove server
						self.servers.remove(server);
						resolve();
					}
				});
			} else {
				reject(new Error("server did not resolve"));
			}
		});
	};

	// def login

	InternalClient.prototype.login = function login(email, password) {
		var self = this;
		var client = self.client;
		return new Promise(function (resolve, reject) {
			if (self.state === ConnectionState.DISCONNECTED || self.state === ConnectionState.IDLE) {

				self.state = ConnectionState.LOGGING_IN;

				request.post(Endpoints.LOGIN).send({ email: email, password: password }).end(function (err, res) {

					if (err) {
						self.state = ConnectionState.DISCONNECTED;
						self.websocket = null;
						client.emit("disconnected");
						reject(new Error(err.response.text));
					} else {
						var token = res.body.token;
						self.state = ConnectionState.LOGGED_IN;
						self.token = token;
						self.email = email;
						self.password = password;

						self.getGateway().then(function (url) {

							self.createWS(url);
							resolve(token);
						})["catch"](function (e) {
							self.state = ConnectionState.DISCONNECTED;
							client.emit("disconnected");
							reject(new Error(err.response.text));
						});
					}
				});
			} else {
				reject(new Error("already logging in/logged in/ready!"));
			}
		});
	};

	// def logout

	InternalClient.prototype.logout = function logout() {
		var _this = this;

		var self = this;
		return new Promise(function (resolve, reject) {

			if (self.state === ConnectionState.DISCONNECTED || self.state === ConnectionState.IDLE) {
				reject(new Error("Client is not logged in!"));
				return;
			}

			request.post(Endpoints.LOGOUT).set("authorization", self.token).end(function (err, res) {
				if (err) {
					reject(new Error(err.response.text));
				} else {
					if (_this.websocket) {
						_this.websocket.close();
						_this.websocket = null;
					}
					self.token = null;
					self.email = null;
					self.password = null;
					self.state = ConnectionState.DISCONNECTED;
					resolve();
				}
			});
		});
	};

	// def startPM

	InternalClient.prototype.startPM = function startPM(resUser) {
		var self = this;
		return new Promise(function (resolve, reject) {
			var user = self.resolver.resolveUser(resUser);

			if (user) {

				// start the PM
				request.post("" + Endpoints.USER_CHANNELS(user.id)).set("authorization", self.token).send({
					recipient_id: user.id
				}).end(function (err, res) {
					if (err) {
						reject(new Error(err.response.text));
					} else {
						resolve(self.private_channels.add(new PMChannel(res.body, self.client)));
					}
				});
			} else {
				reject(new Error("Unable to resolve resUser to a User"));
			}
		});
	};

	// def getGateway

	InternalClient.prototype.getGateway = function getGateway() {
		var self = this;
		return new Promise(function (resolve, reject) {

			request.get(Endpoints.GATEWAY).set("authorization", self.token).end(function (err, res) {
				if (err) reject(err);else resolve(res.body.url);
			});
		});
	};

	// def sendMessage

	InternalClient.prototype.sendMessage = function sendMessage(where, _content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.resolver.resolveChannel(where).then(next)["catch"](function (e) {
				return reject(new Error("Error resolving destination - " + e));
			});

			function next(destination) {
				//var destination;
				var content = self.resolver.resolveString(_content);
				var mentions = self.resolver.resolveMentions(content);

				request.post(Endpoints.CHANNEL_MESSAGES(destination.id)).set("authorization", self.token).send({
					content: content,
					mentions: mentions,
					tts: options.tts
				}).end(function (err, res) {
					if (err) {
						reject(new Error(err.response.text));
					} else {

						resolve(destination.messages.add(new Message(res.body, destination, self.client)));
					}
				});
			}
		});
	};

	// def deleteMessage

	InternalClient.prototype.deleteMessage = function deleteMessage(_message) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		var self = this;
		return new Promise(function (resolve, reject) {

			var message = self.resolver.resolveMessage(_message);

			if (message) {
				var deleteMsg = function deleteMsg() {
					request.del(Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id)).set("authorization", self.token).end(function (err, res) {
						if (err) {
							reject(new Error(err.response.text));
						} else {
							message.channel.messages.remove(message);
							resolve();
						}
					});
				};

				if (options.wait) {
					setTimeout(deleteMsg, options.wait);
				} else {
					deleteMsg();
				}
			} else {
				reject(new Error("Supplied message did not resolve to a message!"));
			}
		});
	};

	// def updateMessage

	InternalClient.prototype.updateMessage = function updateMessage(msg, _content) {
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			var message = self.resolver.resolveMessage(msg);

			if (message) {

				var content = self.resolver.resolveString(_content);
				var mentions = self.resolver.resolveMentions(content);

				request.patch(Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id)).set("authorization", self.token).send({
					content: content,
					tts: options.tts,
					mentions: mentions
				}).end(function (err, res) {
					if (err) {
						reject(new Error(err.response.text));
					} else {
						resolve(message.channel.messages.update(message, new Message(res.body, message.channel, self.client)));
					}
				});
			} else {
				reject(new Error("Supplied message did not resolve to a message!"));
			}
		});
	};

	// def sendFile

	InternalClient.prototype.sendFile = function sendFile(where, _file) {
		var name = arguments.length <= 2 || arguments[2] === undefined ? "image.png" : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {
			self.resolver.resolveChannel(where).then(next)["catch"](function (e) {
				return reject(new Error("couldn't resolve to channel - " + e));
			});

			function next(channel) {

				var file = self.resolver.resolveFile(_file);

				request.post(Endpoints.CHANNEL_MESSAGES(channel.id)).set("authorization", self.token).attach("file", file, name).end(function (err, res) {

					if (err) {
						reject(new Error(err.response.text));
					} else {
						resolve(channel.messages.add(new Message(res.body, channel, self.client)));
					}
				});
			}
		});
	};

	// def getChannelLogs

	InternalClient.prototype.getChannelLogs = function getChannelLogs(_channel) {
		var limit = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var self = this;
		return new Promise(function (resolve, reject) {

			self.resolver.resolveChannel(_channel).then(next)["catch"](function (e) {
				return reject(new Error("couldn't resolve to channel - " + e));
			});

			function next(channel) {

				if (options.before) options.before = self.resolver.resolveMessage(options.before);
				if (options.after) options.after = self.resolver.resolveMessage(options.after);

				var params = [];
				if (options.before) params.push("before=" + options.before.id);
				if (options.after) params.push("after=" + options.after.id);

				var joinedParams = params.join();
				if (joinedParams !== "") joinedParams = "&" + params.join();

				request.get(Endpoints.CHANNEL_MESSAGES(channel.id) + "?limit=" + limit + joinedParams).set("authorization", self.token).end(function (err, res) {
					if (err) {
						reject(new Error(err.response.text));
					} else {
						var logs = [];
						res.body.forEach(function (msg) {
							logs.push(channel.messages.add(new Message(msg, channel, self.client)));
						});
						resolve(logs);
					}
				});
			}
		});
	};

	InternalClient.prototype.sendWS = function sendWS(object) {
		this.websocket.send(JSON.stringify(object));
	};

	InternalClient.prototype.createWS = function createWS(url) {
		var self = this;
		var client = self.client;

		if (this.websocket) return false;

		this.websocket = new WebSocket(url);

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
			self.state = ConnectionState.DISCONNECTED;
			client.emit("disconnected");
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

				case PacketType.READY:
					var startTime = Date.now();
					self.users.add(new User(data.user, client));
					data.guilds.forEach(function (server) {
						self.servers.add(new Server(server, client));
					});
					data.private_channels.forEach(function (pm) {
						self.private_channels.add(new PMChannel(pm, client));
					});
					self.state = ConnectionState.READY;

					setInterval(function () {
						return self.sendWS({ op: 1, d: Date.now() });
					}, data.heartbeat_interval);

					client.emit("ready");
					client.emit("debug", "ready packet took " + (Date.now() - startTime) + "ms to process");
					client.emit("debug", "ready with " + self.servers.length + " servers, " + self.channels.length + " channels and " + self.users.length + " users cached.");
					break;

				case PacketType.MESSAGE_CREATE:
					// format: https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
					var channel = self.channels.get("id", data.channel_id);
					if (channel) {
						var msg = channel.messages.add(new Message(data, channel, client));
						client.emit("message", msg);
					} else {
						client.emit("warn", "message created but channel is not cached");
					}
					break;
				case PacketType.MESSAGE_DELETE:
					// format https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-delete
					var channel = self.channels.get("id", data.channel_id);
					if (channel) {
						// potentially blank
						var msg = channel.messages.get("id", data.id);
						client.emit("messageDeleted", msg);
						if (msg) {
							channel.messages.remove(msg);
						}
					} else {
						client.emit("warn", "message was deleted but channel is not cached");
					}
					break;
				case PacketType.MESSAGE_UPDATE:
					// format https://discordapi.readthedocs.org/en/latest/reference/channels/messages.html#message-format
					var channel = self.channels.get("id", data.channel_id);
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
							var nmsg = channel.messages.update(msg, new Message(data, channel, client));
							client.emit("messageUpdated", nmsg, msg);
						}
					} else {
						client.emit("warn", "message was updated but channel is not cached");
					}
					break;
				case PacketType.SERVER_CREATE:
					var server = self.servers.get("id", data.id);
					if (!server) {
						self.servers.add(new Server(data, client));
						client.emit("serverCreated", server);
					}
					break;
				case PacketType.SERVER_DELETE:
					var server = self.servers.get("id", data.id);
					if (server) {

						for (var _iterator2 = server.channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
							var _ref2;

							if (_isArray2) {
								if (_i2 >= _iterator2.length) break;
								_ref2 = _iterator2[_i2++];
							} else {
								_i2 = _iterator2.next();
								if (_i2.done) break;
								_ref2 = _i2.value;
							}

							var channel = _ref2;

							self.channels.remove(channel);
						}

						self.servers.remove(server);
						client.emit("serverDeleted", server);
					} else {
						client.emit("warn", "server was deleted but it was not in the cache");
					}
					break;
				case PacketType.SERVER_UPDATE:
					var server = self.servers.get("id", data.id);
					if (server) {
						// server exists
						data.members = data.members || [];
						data.channels = data.channels || [];
						var newserver = new Server(data, self);
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
						self.servers.add(new Server(data, self));
						client.emit("serverCreated", server);
					}
					break;
				case PacketType.CHANNEL_CREATE:

					var channel = self.channels.get("id", data.id);

					if (!channel) {

						var server = self.servers.get("id", data.guild_id);
						if (server) {
							if (data.is_private) {
								client.emit("channelCreated", self.private_channels.add(new PMChannel(data, client)));
							} else {
								var chan = null;
								if (data.type === "text") {
									chan = self.channels.add(new TextChannel(data, client, server));
								} else {
									chan = self.channels.add(new VoiceChannel(data, client, server));
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
				case PacketType.CHANNEL_DELETE:
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
				case PacketType.CHANNEL_UPDATE:
					var channel = self.channels.get("id", data.id) || self.private_channels.get("id", data.id);
					if (channel) {

						if (channel instanceof PMChannel) {
							//PM CHANNEL
							client.emit("channelUpdated", self.private_channels.update(channel, new PMChannel(data, client)));
						} else {
							if (channel.server) {
								if (channel.type === "text") {
									//TEXT CHANNEL
									var chan = new TextChannel(data, client, channel.server);
									chan.messages = channel.messages;
									channel.server.channels.update(channel, chan);
									self.channels.update(channel, chan);
									client.emit("channelUpdated", channel, chan);
								} else {
									//VOICE CHANNEL
									var chan = new VoiceChannel(data, client, channel.server);
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
			}
		};
	};

	return InternalClient;
})();

module.exports = InternalClient;