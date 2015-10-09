//discord.js modules
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Endpoints = require("./Endpoints.js");
var User = require("./user.js");
var Server = require("./server.js");
var Channel = require("./channel.js");
var Message = require("./message.js");
var Invite = require("./invite.js");
var PMChannel = require("./PMChannel.js");

var gameMap = require("../ref/gameMap.json");

//node modules
var request = require("superagent");
var WebSocket = require("ws");
var fs = require("fs");

var defaultOptions = {
	queue: false
};

var Client = (function () {
	function Client() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? defaultOptions : arguments[0];
		var token = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

		_classCallCheck(this, Client);

		/*
  	When created, if a token is specified the Client will
  	try connecting with it. If the token is incorrect, no
  	further efforts will be made to connect.
  */
		this.options = options;
		this.options.queue = this.options.queue;
		this.token = token;
		this.state = 0;
		this.websocket = null;
		this.events = {};
		this.user = null;
		this.alreadySentData = false;
		this.serverCreateListener = {};
		this.typingIntervals = {};
		this.email = "abc";
		this.password = "abc";

		/*
  	State values:
  	0 - idle
  	1 - logging in
  	2 - logged in
  	3 - ready
  	4 - disconnected
  */

		this.userCache = [];
		this.channelCache = [];
		this.serverCache = [];
		this.pmChannelCache = [];
		this.readyTime = null;
		this.checkingQueue = {};
		this.userTypingListener = {};
		this.queue = {};

		this.__idleTime = null;
		this.__gameId = null;
	}

	_createClass(Client, [{
		key: "sendPacket",
		value: function sendPacket(JSONObject) {
			if (this.websocket.readyState === 1) {
				this.websocket.send(JSON.stringify(JSONObject));
			}
		}

		//def debug
	}, {
		key: "debug",
		value: function debug(message) {
			this.trigger("debug", message);
		}
	}, {
		key: "on",
		value: function on(event, fn) {
			this.events[event] = fn;
		}
	}, {
		key: "off",
		value: function off(event) {
			this.events[event] = null;
		}
	}, {
		key: "keepAlive",
		value: function keepAlive() {
			this.debug("keep alive triggered");
			this.sendPacket({
				op: 1,
				d: Date.now()
			});
		}

		//def trigger
	}, {
		key: "trigger",
		value: function trigger(event) {
			var args = [];
			for (var arg in arguments) {
				args.push(arguments[arg]);
			}
			var evt = this.events[event];
			if (evt) {
				evt.apply(this, args.slice(1));
			}
		}

		//def login
	}, {
		key: "login",
		value: function login() {
			var email = arguments.length <= 0 || arguments[0] === undefined ? "foo@bar.com" : arguments[0];
			var password = arguments.length <= 1 || arguments[1] === undefined ? "pass1234" : arguments[1];
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, token) {} : arguments[2];

			var self = this;

			return new Promise(function (resolve, reject) {
				if (self.state === 0 || self.state === 4) {

					self.state = 1; //set the state to logging in

					self.email = email;
					self.password = password;

					request.post(Endpoints.LOGIN).send({
						email: email,
						password: password
					}).end(function (err, res) {

						if (err) {
							self.state = 4; //set state to disconnected
							self.trigger("disconnected");
							if (self.websocket) {
								self.websocket.close();
							}
							callback(err);
							reject(err);
						} else {
							self.state = 2; //set state to logged in (not yet ready)
							self.token = res.body.token; //set our token

							self.getGateway().then(function (url) {
								self.createws(url);
								callback(null, self.token);
								resolve(self.token);
							})["catch"](function (err) {
								callback(err);
								reject(err);
							});
						}
					});
				} else {
					reject(new Error("Client already logging in or ready"));
				}
			});
		}
	}, {
		key: "logout",
		value: function logout() {
			var callback = arguments.length <= 0 || arguments[0] === undefined ? function (err) {} : arguments[0];

			var self = this;

			return new Promise(function (resolve, reject) {

				request.post(Endpoints.LOGOUT).set("authorization", self.token).end(function (err, res) {

					if (err) {
						callback(err);
						reject(err);
					} else {
						self.websocket.close();
						self.state = 4;
						callback();
						resolve();
					}
				});
			});
		}
	}, {
		key: "createServer",
		value: function createServer(name, region) {
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, server) {} : arguments[2];

			var self = this;
			return new Promise(function (resolve, reject) {

				request.post(Endpoints.SERVERS).set("authorization", self.token).send({
					name: name,
					region: region
				}).end(function (err, res) {
					if (err) {
						callback(err);
						reject(err);
					} else {
						// potentially redundant in future
						// creating here does NOT give us the channels of the server
						// so we must wait for the guild_create event.
						self.serverCreateListener[res.body.id] = [resolve, callback];
						/*var srv = self.addServer(res.body);
      callback(null, srv);
      resolve(srv);*/
					}
				});
			});
		}
	}, {
		key: "createChannel",
		value: function createChannel(server, channelName, channelType) {
			var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, chann) {} : arguments[3];

			var self = this;

			return new Promise(function (resolve, reject) {

				request.post(Endpoints.SERVERS + "/" + self.resolveServerID(server) + "/channels").set("authorization", self.token).send({
					name: channelName,
					type: channelType
				}).end(function (err, res) {

					if (err) {
						callback(err);
						reject(err);
					} else {
						var server = self.getServer("id", res.body.guild_id);
						var chann = self.addChannel(res.body, res.body.guild_id);
						server.addChannel(chann);
						callback(null, chann);
						resolve(chann);
					}
				});
			});
		}
	}, {
		key: "leaveServer",
		value: function leaveServer(server) {
			var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err, server) {} : arguments[1];

			var self = this;

			return new Promise(function (resolve, reject) {

				request.del(Endpoints.SERVERS + "/" + self.resolveServerID(server)).set("authorization", self.token).end(function (err, res) {

					if (err) {
						callback(err);
						reject(err);
					} else {
						self.serverCache.splice(self.serverCache.indexOf(server), 1);
						callback(null);
						resolve();
					}
				});
			});
		}
	}, {
		key: "createInvite",
		value: function createInvite(serverOrChannel, options) {
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, invite) {} : arguments[2];

			var self = this;

			return new Promise(function (resolve, reject) {

				var destination;

				if (serverOrChannel instanceof Server) {
					destination = serverOrChannel.id;
				} else if (serverOrChannel instanceof Channel) {
					destination = serverOrChannel.id;
				} else {
					destination = serverOrChannel;
				}

				options = options || {};
				options.max_age = options.maxAge || 0;
				options.max_uses = options.maxUses || 0;
				options.temporary = options.temporary || false;
				options.xkcdpass = options.xkcd || false;

				request.post(Endpoints.CHANNELS + "/" + destination + "/invites").set("authorization", self.token).send(options).end(function (err, res) {
					if (err) {
						callback(err);
						reject(err);
					} else {
						var inv = new Invite(res.body, self);
						callback(null, inv);
						resolve(inv);
					}
				});
			});
		}
	}, {
		key: "startPM",
		value: function startPM(user) {

			var self = this;

			return new Promise(function (resolve, reject) {
				var userId = user;
				if (user instanceof User) {
					userId = user.id;
				}
				request.post(Endpoints.USERS + "/" + self.user.id + "/channels").set("authorization", self.token).send({
					recipient_id: userId
				}).end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(self.addPMChannel(res.body));
					}
				});
			});
		}
	}, {
		key: "reply",
		value: function reply(destination, message, tts) {
			var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, msg) {} : arguments[3];

			var self = this;

			return new Promise(function (response, reject) {

				if (typeof tts === "function") {
					// tts is a function, which means the developer wants this to be the callback
					callback = tts;
					tts = false;
				}

				var user = destination.sender;
				self.sendMessage(destination, message, tts, callback, user + ", ").then(response)["catch"](reject);
			});
		}
	}, {
		key: "deleteMessage",
		value: function deleteMessage(message, timeout) {
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, msg) {} : arguments[2];

			var self = this;

			return new Promise(function (resolve, reject) {
				if (timeout) {
					setTimeout(remove, timeout);
				} else {
					remove();
				}

				function remove() {
					request.del(Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id).set("authorization", self.token).end(function (err, res) {
						if (err) {
							bad();
						} else {
							good();
						}
					});
				}

				function good() {
					callback();
					resolve();
				}

				function bad(err) {
					callback(err);
					reject(err);
				}
			});
		}
	}, {
		key: "updateMessage",
		value: function updateMessage(message, content) {
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, msg) {} : arguments[2];

			var self = this;

			var prom = new Promise(function (resolve, reject) {

				content = content instanceof Array ? content.join("\n") : content;

				if (self.options.queue) {
					if (!self.queue[message.channel.id]) {
						self.queue[message.channel.id] = [];
					}
					self.queue[message.channel.id].push({
						action: "updateMessage",
						message: message,
						content: content,
						then: good,
						error: bad
					});

					self.checkQueue(message.channel.id);
				} else {
					self._updateMessage(message, content).then(good)["catch"](bad);
				}

				function good(msg) {
					prom.message = msg;
					callback(null, msg);
					resolve(msg);
				}

				function bad(error) {
					prom.error = error;
					callback(error);
					reject(error);
				}
			});

			return prom;
		}
	}, {
		key: "setUsername",
		value: function setUsername(newName) {
			var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

			var self = this;

			return new Promise(function (resolve, reject) {
				request.patch(Endpoints.API + "/users/@me").set("authorization", self.token).send({
					avatar: self.user.avatar,
					email: self.email,
					new_password: null,
					password: self.password,
					username: newName
				}).end(function (err) {
					callback(err);
					if (err) reject(err);else resolve();
				});
			});
		}
	}, {
		key: "getChannelLogs",
		value: function getChannelLogs(channel) {
			var amount = arguments.length <= 1 || arguments[1] === undefined ? 500 : arguments[1];
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, logs) {} : arguments[2];

			var self = this;

			return new Promise(function (resolve, reject) {

				var channelID = channel;
				if (channel instanceof Channel) {
					channelID = channel.id;
				}

				request.get(Endpoints.CHANNELS + "/" + channelID + "/messages?limit=" + amount).set("authorization", self.token).end(function (err, res) {

					if (err) {
						callback(err);
						reject(err);
					} else {
						var logs = [];

						var channel = self.getChannel("id", channelID);

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = res.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var message = _step.value;

								var mentions = [];
								var _iteratorNormalCompletion2 = true;
								var _didIteratorError2 = false;
								var _iteratorError2 = undefined;

								try {
									for (var _iterator2 = message.mentions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
										var mention = _step2.value;

										mentions.push(self.addUser(mention));
									}
								} catch (err) {
									_didIteratorError2 = true;
									_iteratorError2 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
											_iterator2["return"]();
										}
									} finally {
										if (_didIteratorError2) {
											throw _iteratorError2;
										}
									}
								}

								var author = self.addUser(message.author);

								logs.push(new Message(message, channel, mentions, author));
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator["return"]) {
									_iterator["return"]();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}

						callback(null, logs);
						resolve(logs);
					}
				});
			});
		}
	}, {
		key: "deleteChannel",
		value: function deleteChannel(channel) {
			var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

			var self = this;

			return new Promise(function (resolve, reject) {

				var channelID = channel;
				if (channel instanceof Channel) {
					channelID = channel.id;
				}

				request.del(Endpoints.CHANNELS + "/" + channelID).set("authorization", self.token).end(function (err) {
					if (err) {
						callback(err);
						reject(err);
					} else {
						callback(null);
						resolve();
					}
				});
			});
		}
	}, {
		key: "joinServer",
		value: function joinServer(invite) {
			var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err, server) {} : arguments[1];

			var self = this;

			return new Promise(function (resolve, reject) {

				var id = invite instanceof Invite ? invite.code : invite;

				request.post(Endpoints.API + "/invite/" + id).set("authorization", self.token).end(function (err, res) {
					if (err) {
						callback(err);
						reject(err);
					} else {
						if (self.getServer("id", res.body.guild.id)) {
							resolve(self.getServer("id", res.body.guild.id));
						} else {
							self.serverCreateListener[res.body.guild.id] = [resolve, callback];
						}
					}
				});
			});
		}
	}, {
		key: "sendFile",
		value: function sendFile(destination, file) {
			var fileName = arguments.length <= 2 || arguments[2] === undefined ? "image.png" : arguments[2];
			var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, msg) {} : arguments[3];

			var self = this;

			var prom = new Promise(function (resolve, reject) {

				var fstream;

				if (typeof file === "string" || file instanceof String) {
					fstream = fs.createReadStream(file);
					fileName = file;
				} else {
					fstream = file;
				}

				self.resolveDestination(destination).then(send)["catch"](bad);

				function send(destination) {
					if (self.options.queue) {
						//queue send file too
						if (!self.queue[destination]) {
							self.queue[destination] = [];
						}

						self.queue[destination].push({
							action: "sendFile",
							attachment: fstream,
							attachmentName: fileName,
							then: good,
							error: bad
						});

						self.checkQueue(destination);
					} else {
						//not queue
						self._sendFile(destination, fstream, fileName).then(good)["catch"](bad);
					}
				}

				function good(msg) {
					prom.message = msg;
					callback(null, msg);
					resolve(msg);
				}

				function bad(err) {
					prom.error = err;
					callback(err);
					reject(err);
				}
			});

			return prom;
		}
	}, {
		key: "sendMessage",
		value: function sendMessage(destination, message, tts) {
			var callback = arguments.length <= 3 || arguments[3] === undefined ? function (err, msg) {} : arguments[3];
			var premessage = arguments.length <= 4 || arguments[4] === undefined ? "" : arguments[4];

			var self = this;

			var prom = new Promise(function (resolve, reject) {

				if (typeof tts === "function") {
					// tts is a function, which means the developer wants this to be the callback
					callback = tts;
					tts = false;
				}

				message = premessage + resolveMessage(message);
				var mentions = resolveMentions();
				self.resolveDestination(destination).then(send)["catch"](error);

				function error(err) {
					callback(err);
					reject(err);
				}

				function send(destination) {
					if (self.options.queue) {
						//we're QUEUEING messages, so sending them sequentially based on servers.
						if (!self.queue[destination]) {
							self.queue[destination] = [];
						}

						self.queue[destination].push({
							action: "sendMessage",
							content: message,
							mentions: mentions,
							tts: !!tts, //incase it's not a boolean
							then: mgood,
							error: mbad
						});

						self.checkQueue(destination);
					} else {
						self._sendMessage(destination, message, tts, mentions).then(mgood)["catch"](mbad);
					}
				}

				function mgood(msg) {
					prom.message = msg;
					callback(null, msg);
					resolve(msg);
				}

				function mbad(error) {
					prom.error = error;
					callback(error);
					reject(error);
				}

				function resolveMessage() {
					var msg = message;
					if (message instanceof Array) {
						msg = message.join("\n");
					}
					return msg;
				}

				function resolveMentions() {
					var _mentions = [];
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = (message.match(/<@[^>]*>/g) || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var mention = _step3.value;

							_mentions.push(mention.substring(2, mention.length - 1));
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
								_iterator3["return"]();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					return _mentions;
				}
			});

			return prom;
		}

		//def createws
	}, {
		key: "createws",
		value: function createws(url) {
			if (this.websocket) return false;

			var self = this;

			//good to go
			this.websocket = new WebSocket(url);

			//open
			this.websocket.onopen = function () {
				self.trySendConnData(); //try connecting
			};

			//close
			this.websocket.onclose = function () {
				self.trigger("disconnected");
			};

			//message
			this.websocket.onmessage = function (e) {

				var dat = false,
				    data = {};

				try {
					dat = JSON.parse(e.data);
					data = dat.d;
				} catch (err) {
					self.trigger("error", err, e);
					return;
				}

				self.trigger("raw", dat);

				//valid message
				switch (dat.t) {

					case "READY":
						self.debug("received ready packet");

						self.user = self.addUser(data.user);

						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = data.guilds[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var _server = _step4.value;

								var server = self.addServer(_server);
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
									_iterator4["return"]();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}

						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = data.private_channels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var _pmc = _step5.value;

								var pmc = self.addPMChannel(_pmc);
							}
						} catch (err) {
							_didIteratorError5 = true;
							_iteratorError5 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
									_iterator5["return"]();
								}
							} finally {
								if (_didIteratorError5) {
									throw _iteratorError5;
								}
							}
						}

						self.trigger("ready");
						self.readyTime = Date.now();
						self.debug("cached " + self.serverCache.length + " servers, " + self.channelCache.length + " channels, " + self.pmChannelCache.length + " PMs and " + self.userCache.length + " users.");
						self.state = 3;
						setInterval(function () {
							self.keepAlive.apply(self);
						}, data.heartbeat_interval);

						break;
					case "MESSAGE_CREATE":
						self.debug("received message");

						var mentions = [];
						data.mentions = data.mentions || []; //for some reason this was not defined at some point?
						var _iteratorNormalCompletion6 = true;
						var _didIteratorError6 = false;
						var _iteratorError6 = undefined;

						try {
							for (var _iterator6 = data.mentions[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
								var mention = _step6.value;

								mentions.push(self.addUser(mention));
							}
						} catch (err) {
							_didIteratorError6 = true;
							_iteratorError6 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
									_iterator6["return"]();
								}
							} finally {
								if (_didIteratorError6) {
									throw _iteratorError6;
								}
							}
						}

						var channel = self.getChannel("id", data.channel_id);
						if (channel) {
							var msg = channel.addMessage(new Message(data, channel, mentions, self.addUser(data.author)));
							self.trigger("message", msg);
						}

						break;
					case "MESSAGE_DELETE":
						self.debug("message deleted");

						var channel = self.getChannel("id", data.channel_id);
						var message = channel.getMessage("id", data.id);
						if (message) {
							self.trigger("messageDelete", channel, message);
							channel.messages.splice(channel.messages.indexOf(message), 1);
						} else {
							//don't have the cache of that message ;(
							self.trigger("messageDelete", channel);
						}
						break;
					case "MESSAGE_UPDATE":
						self.debug("message updated");

						var channel = self.getChannel("id", data.channel_id);
						var formerMessage = channel.getMessage("id", data.id);

						if (formerMessage) {

							//new message might be partial, so we need to fill it with whatever the old message was.
							var info = {};

							for (var key in formerMessage) {
								info[key] = formerMessage[key];
							}

							for (var key in data) {
								info[key] = data[key];
							}

							var mentions = [];
							var _iteratorNormalCompletion7 = true;
							var _didIteratorError7 = false;
							var _iteratorError7 = undefined;

							try {
								for (var _iterator7 = info.mentions[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
									var mention = _step7.value;

									mentions.push(self.addUser(mention));
								}
							} catch (err) {
								_didIteratorError7 = true;
								_iteratorError7 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
										_iterator7["return"]();
									}
								} finally {
									if (_didIteratorError7) {
										throw _iteratorError7;
									}
								}
							}

							var newMessage = new Message(info, channel, mentions, formerMessage.author);

							self.trigger("messageUpdate", newMessage, formerMessage);

							channel.messages[channel.messages.indexOf(formerMessage)] = newMessage;
						}

						// message isn't in cache, and if it's a partial it could cause
						// all hell to break loose... best to just act as if nothing happened

						break;

					case "GUILD_DELETE":

						var server = self.getServer("id", data.id);

						if (server) {
							self.serverCache.splice(self.serverCache.indexOf(server), 1);
							self.trigger("serverDelete", server);
						}

						break;

					case "CHANNEL_DELETE":

						var channel = self.getChannel("id", data.id);

						if (channel) {

							var server = channel.server;

							if (server) {

								server.channels.splice(server.channels.indexOf(channel), 1);
							}

							self.trigger("channelDelete", channel);

							self.serverCache.splice(self.serverCache.indexOf(channel), 1);
						}

						break;

					case "GUILD_CREATE":

						var server = self.getServer("id", data.id);

						if (!server) {
							//if server doesn't already exist because duh
							server = self.addServer(data);
						} /*else if(server.channels.length === 0){
        
        var srv = new Server(data, self);
        for(channel of data.channels){
        	srv.channels.push(new Channel(channel, data.id));
        }
        self.serverCache[self.serverCache.indexOf(server)] = srv;
        
        }*/

						if (self.serverCreateListener[data.id]) {
							var cbs = self.serverCreateListener[data.id];
							cbs[0](server); //promise then callback
							cbs[1](null, server); //legacy callback
							self.serverCreateListener[data.id] = null;
						}

						self.trigger("serverCreate", server);

						break;

					case "CHANNEL_CREATE":

						var channel = self.getChannel("id", data.id);

						if (!channel) {

							var chann = self.addChannel(data, data.guild_id);
							var srv = self.getServer("id", data.guild_id);
							if (srv) {
								srv.addChannel(chann);
							}
							self.trigger("channelCreate", chann);
						}

						break;

					case "GUILD_MEMBER_ADD":

						var server = self.getServer("id", data.guild_id);

						if (server) {

							var user = self.addUser(data.user); //if for whatever reason it doesn't exist..

							self.trigger("serverNewMember", server.addMember(user, data.roles), server);
						}

						break;

					case "GUILD_MEMBER_REMOVE":

						var server = self.getServer("id", data.guild_id);

						if (server) {

							var user = self.addUser(data.user); //if for whatever reason it doesn't exist..

							server.removeMember("id", user.id);

							self.trigger("serverRemoveMember", user, server);
						}

						break;

					case "USER_UPDATE":

						if (self.user && data.id === self.user.id) {

							var newUser = new User(data); //not actually adding to the cache

							self.trigger("userUpdate", newUser, self.user);

							if (~self.userCache.indexOf(self.user)) {
								self.userCache[self.userCache.indexOf(self.user)] = newUser;
							}

							self.user = newUser;
						}

						break;

					case "PRESENCE_UPDATE":

						var userInCache = self.getUser("id", data.user.id);

						if (userInCache) {
							//user exists

							data.user.username = data.user.username || userInCache.username;
							data.user.id = data.user.id || userInCache.id;
							data.user.discriminator = data.user.discriminator || userInCache.discriminator;
							data.user.avatar = data.user.avatar || userInCache.avatar;

							var presenceUser = new User(data.user);
							if (presenceUser.equalsStrict(userInCache)) {
								//they're exactly the same, an actual presence update
								self.trigger("presence", {
									user: userInCache,
									oldStatus: userInCache.status,
									status: data.status,
									server: self.getServer("id", data.guild_id),
									gameId: data.game_id
								});
								userInCache.status = data.status;
							} else {
								//one of their details changed.
								self.userCache[self.userCache.indexOf(userInCache)] = presenceUser;
								self.trigger("userUpdate", userInCache, presenceUser);
							}
						}

						break;

					case "CHANNEL_UPDATE":

						var channelInCache = self.getChannel("id", data.id),
						    serverInCache = self.getServer("id", data.guild_id);

						if (channelInCache && serverInCache) {

							var newChann = new Channel(data, serverInCache);
							newChann.messages = channelInCache.messages;

							self.trigger("channelUpdate", channelInCache, newChann);

							self.channelCache[self.channelCache.indexOf(channelInCache)] = newChann;
						}

						break;

					case "TYPING_START":

						var userInCache = self.getUser("id", data.user_id);
						var channelInCache = self.getChannel("id", data.channel_id);

						if (!self.userTypingListener[data.user_id] || self.userTypingListener[data.user_id] === -1) {
							self.trigger("startTyping", userInCache, channelInCache);
						}

						self.userTypingListener[data.user_id] = Date.now();

						setTimeout(function () {
							if (self.userTypingListener[data.user_id] === -1) {
								return;
							}
							if (Date.now() - self.userTypingListener[data.user_id] > 6000) {
								// stopped typing
								self.trigger("stopTyping", userInCache, channelInCache);
								self.userTypingListener[data.user_id] = -1;
							}
						}, 6000);

						break;

					case "GUILD_ROLE_DELETE":

						var server = self.getServer("id", data.guild_id);
						var role = server.getRole(data.role_id);

						self.trigger("serverRoleDelete", server, role);

						server.removeRole(role.id);

						break;

					case "GUILD_ROLE_UPDATE":

						var server = self.getServer("id", data.guild_id);
						var role = server.getRole(data.role.id);
						var newRole = server.updateRole(data.role);

						self.trigger("serverRoleUpdate", server, role, newRole);

						break;

					default:
						self.debug("received unknown packet");
						self.trigger("unknown", dat);
						break;

				}
			};
		}

		//def addUser
	}, {
		key: "addUser",
		value: function addUser(data) {
			if (!this.getUser("id", data.id)) {
				this.userCache.push(new User(data));
			}
			return this.getUser("id", data.id);
		}

		//def addChannel
	}, {
		key: "addChannel",
		value: function addChannel(data, serverId) {
			if (!this.getChannel("id", data.id)) {
				this.channelCache.push(new Channel(data, this.getServer("id", serverId)));
			}
			return this.getChannel("id", data.id);
		}
	}, {
		key: "addPMChannel",
		value: function addPMChannel(data) {
			if (!this.getPMChannel("id", data.id)) {
				this.pmChannelCache.push(new PMChannel(data, this));
			}
			return this.getPMChannel("id", data.id);
		}
	}, {
		key: "setTopic",
		value: function setTopic(channel, topic) {
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err) {} : arguments[2];

			var self = this;

			return new Promise(function (resolve, reject) {

				self.resolveDestination(channel).then(next)["catch"](error);

				function error(e) {
					callback(e);
					reject(e);
				}

				function next(destination) {

					var asChan = self.getChannel("id", destination);

					request.patch(Endpoints.CHANNELS + "/" + destination).set("authorization", self.token).send({
						name: asChan.name,
						position: 0,
						topic: topic
					}).end(function (err, res) {
						if (err) {
							error(err);
						} else {
							asChan.topic = res.body.topic;
							resolve();
							callback();
						}
					});
				}
			});
		}

		//def addServer
	}, {
		key: "addServer",
		value: function addServer(data) {

			var self = this;
			var server = this.getServer("id", data.id);

			if (data.unavailable) {
				self.trigger("unavailable", data);
				self.debug("Server ID " + data.id + " has been marked unavailable by Discord. It was not cached.");
				return;
			}

			if (!server) {
				server = new Server(data, this);
				this.serverCache.push(server);
				if (data.channels) {
					var _iteratorNormalCompletion8 = true;
					var _didIteratorError8 = false;
					var _iteratorError8 = undefined;

					try {
						for (var _iterator8 = data.channels[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
							var channel = _step8.value;

							server.channels.push(this.addChannel(channel, server.id));
						}
					} catch (err) {
						_didIteratorError8 = true;
						_iteratorError8 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
								_iterator8["return"]();
							}
						} finally {
							if (_didIteratorError8) {
								throw _iteratorError8;
							}
						}
					}
				}
			}

			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = data.presences[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var presence = _step9.value;

					self.getUser("id", presence.user.id).status = presence.status;
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9["return"]) {
						_iterator9["return"]();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}

			return server;
		}

		//def getUser
	}, {
		key: "getUser",
		value: function getUser(key, value) {
			var _iteratorNormalCompletion10 = true;
			var _didIteratorError10 = false;
			var _iteratorError10 = undefined;

			try {
				for (var _iterator10 = this.userCache[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
					var user = _step10.value;

					if (user[key] === value) {
						return user;
					}
				}
			} catch (err) {
				_didIteratorError10 = true;
				_iteratorError10 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion10 && _iterator10["return"]) {
						_iterator10["return"]();
					}
				} finally {
					if (_didIteratorError10) {
						throw _iteratorError10;
					}
				}
			}

			return null;
		}

		//def getChannel
	}, {
		key: "getChannel",
		value: function getChannel(key, value) {
			var _iteratorNormalCompletion11 = true;
			var _didIteratorError11 = false;
			var _iteratorError11 = undefined;

			try {
				for (var _iterator11 = this.channelCache[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
					var channel = _step11.value;

					if (channel[key] === value) {
						return channel;
					}
				}
			} catch (err) {
				_didIteratorError11 = true;
				_iteratorError11 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion11 && _iterator11["return"]) {
						_iterator11["return"]();
					}
				} finally {
					if (_didIteratorError11) {
						throw _iteratorError11;
					}
				}
			}

			return this.getPMChannel(key, value); //might be a PM
		}
	}, {
		key: "getPMChannel",
		value: function getPMChannel(key, value) {
			var _iteratorNormalCompletion12 = true;
			var _didIteratorError12 = false;
			var _iteratorError12 = undefined;

			try {
				for (var _iterator12 = this.pmChannelCache[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
					var channel = _step12.value;

					if (channel[key] === value) {
						return channel;
					}
				}
			} catch (err) {
				_didIteratorError12 = true;
				_iteratorError12 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion12 && _iterator12["return"]) {
						_iterator12["return"]();
					}
				} finally {
					if (_didIteratorError12) {
						throw _iteratorError12;
					}
				}
			}

			return null;
		}

		//def getServer
	}, {
		key: "getServer",
		value: function getServer(key, value) {
			var _iteratorNormalCompletion13 = true;
			var _didIteratorError13 = false;
			var _iteratorError13 = undefined;

			try {
				for (var _iterator13 = this.serverCache[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
					var server = _step13.value;

					if (server[key] === value) {
						return server;
					}
				}
			} catch (err) {
				_didIteratorError13 = true;
				_iteratorError13 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion13 && _iterator13["return"]) {
						_iterator13["return"]();
					}
				} finally {
					if (_didIteratorError13) {
						throw _iteratorError13;
					}
				}
			}

			return null;
		}

		//def trySendConnData
	}, {
		key: "trySendConnData",
		value: function trySendConnData() {

			if (this.token && !this.alreadySentData) {

				this.alreadySentData = true;

				var data = {
					op: 2,
					d: {
						token: this.token,
						v: 3,
						properties: {
							"$os": "discord.js",
							"$browser": "discord.js",
							"$device": "discord.js",
							"$referrer": "",
							"$referring_domain": ""
						}
					}
				};
				this.websocket.send(JSON.stringify(data));
			}
		}
	}, {
		key: "resolveServerID",
		value: function resolveServerID(resource) {

			if (resource instanceof Server) {
				return resource.id;
			} else if (!isNaN(resource) && resource.length && resource.length === 17) {
				return resource;
			}
		}
	}, {
		key: "resolveDestination",
		value: function resolveDestination(destination) {
			var channId = false;
			var self = this;

			return new Promise(function (resolve, reject) {
				if (destination instanceof Server) {
					channId = destination.id; //general is the same as server id
				} else if (destination instanceof Channel) {
						channId = destination.id;
					} else if (destination instanceof Message) {
						channId = destination.channel.id;
					} else if (destination instanceof PMChannel) {
						channId = destination.id;
					} else if (destination instanceof User) {

						//check if we have a PM
						var _iteratorNormalCompletion14 = true;
						var _didIteratorError14 = false;
						var _iteratorError14 = undefined;

						try {
							for (var _iterator14 = self.pmChannelCache[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
								var pmc = _step14.value;

								if (pmc.user.equals(destination)) {
									resolve(pmc.id);
									return;
								}
							}

							//we don't, at this point we're late
						} catch (err) {
							_didIteratorError14 = true;
							_iteratorError14 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion14 && _iterator14["return"]) {
									_iterator14["return"]();
								}
							} finally {
								if (_didIteratorError14) {
									throw _iteratorError14;
								}
							}
						}

						self.startPM(destination).then(function (pmc) {
							resolve(pmc.id);
						})["catch"](reject);
					} else {
						channId = destination;
					}
				if (channId) resolve(channId);else reject();
			});
		}
	}, {
		key: "_sendMessage",
		value: function _sendMessage(destination, content, tts, mentions) {

			var self = this;

			return new Promise(function (resolve, reject) {
				request.post(Endpoints.CHANNELS + "/" + destination + "/messages").set("authorization", self.token).send({
					content: content,
					mentions: mentions,
					tts: tts
				}).end(function (err, res) {

					if (err) {
						reject(err);
					} else {
						var data = res.body;

						var mentions = [];

						data.mentions = data.mentions || []; //for some reason this was not defined at some point?

						var _iteratorNormalCompletion15 = true;
						var _didIteratorError15 = false;
						var _iteratorError15 = undefined;

						try {
							for (var _iterator15 = data.mentions[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
								var mention = _step15.value;

								mentions.push(self.addUser(mention));
							}
						} catch (err) {
							_didIteratorError15 = true;
							_iteratorError15 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion15 && _iterator15["return"]) {
									_iterator15["return"]();
								}
							} finally {
								if (_didIteratorError15) {
									throw _iteratorError15;
								}
							}
						}

						var channel = self.getChannel("id", data.channel_id);
						if (channel) {
							var msg = channel.addMessage(new Message(data, channel, mentions, self.addUser(data.author)));
							resolve(msg);
						}
					}
				});
			});
		}
	}, {
		key: "_sendFile",
		value: function _sendFile(destination, attachment) {
			var attachmentName = arguments.length <= 2 || arguments[2] === undefined ? "DEFAULT BECAUSE YOU DIDN'T SPECIFY WHY.png" : arguments[2];

			var self = this;

			return new Promise(function (resolve, reject) {
				request.post(Endpoints.CHANNELS + "/" + destination + "/messages").set("authorization", self.token).attach("file", attachment, attachmentName).end(function (err, res) {

					if (err) {
						reject(err);
					} else {

						var chann = self.getChannel("id", destination);
						if (chann) {
							var msg = chann.addMessage(new Message(res.body, chann, [], self.user));
							resolve(msg);
						}
					}
				});
			});
		}
	}, {
		key: "_updateMessage",
		value: function _updateMessage(message, content) {
			var self = this;
			return new Promise(function (resolve, reject) {
				request.patch(Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id).set("authorization", self.token).send({
					content: content,
					mentions: []
				}).end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						var msg = new Message(res.body, message.channel, message.mentions, message.sender);
						resolve(msg);
						message.channel.messages[message.channel.messages.indexOf(message)] = msg;
					}
				});
			});
		}
	}, {
		key: "getGateway",
		value: function getGateway() {
			var self = this;
			return new Promise(function (resolve, reject) {
				request.get(Endpoints.API + "/gateway").set("authorization", self.token).end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(res.body.url);
					}
				});
			});
		}
	}, {
		key: "setStatusIdle",
		value: function setStatusIdle() {
			this.setStatus("idle");
		}
	}, {
		key: "setStatusOnline",
		value: function setStatusOnline() {
			this.setStatus("online");
		}
	}, {
		key: "setStatusActive",
		value: function setStatusActive() {
			this.setStatusOnline();
		}
	}, {
		key: "setStatusHere",
		value: function setStatusHere() {
			this.setStatusOnline();
		}
	}, {
		key: "setStatusAway",
		value: function setStatusAway() {
			this.setStatusIdle();
		}
	}, {
		key: "startTyping",
		value: function startTyping(chann, stopTypeTime) {
			var self = this;

			this.resolveDestination(chann).then(next);

			function next(channel) {
				if (self.typingIntervals[channel]) {
					return;
				}

				var fn = function fn() {
					request.post(Endpoints.CHANNELS + "/" + channel + "/typing").set("authorization", self.token).end();
				};

				fn();

				var interval = setInterval(fn, 3000);

				self.typingIntervals[channel] = interval;

				if (stopTypeTime) {
					setTimeout(function () {
						self.stopTyping(channel);
					}, stopTypeTime);
				}
			}
		}
	}, {
		key: "stopTyping",
		value: function stopTyping(chann) {
			var self = this;

			this.resolveDestination(chann).then(next);

			function next(channel) {
				if (!self.typingIntervals[channel]) {
					return;
				}

				clearInterval(self.typingIntervals[channel]);

				delete self.typingIntervals[channel];
			}
		}
	}, {
		key: "setStatus",
		value: function setStatus(stat) {

			var idleTime = stat === "online" ? null : Date.now();

			this.__idleTime = idleTime;

			this.websocket.send(JSON.stringify({
				op: 3,
				d: {
					idle_since: this.__idleTime,
					game_id: this.__gameId
				}
			}));
		}
	}, {
		key: "setPlayingGame",
		value: function setPlayingGame(id) {

			if (id instanceof String || typeof id === "string") {

				// working on names
				var gid = id.trim().toUpperCase();

				id = null;

				var _iteratorNormalCompletion16 = true;
				var _didIteratorError16 = false;
				var _iteratorError16 = undefined;

				try {
					for (var _iterator16 = gameMap[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
						var game = _step16.value;

						if (game.name.trim().toUpperCase() === gid) {

							id = game.id;
							break;
						}
					}
				} catch (err) {
					_didIteratorError16 = true;
					_iteratorError16 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion16 && _iterator16["return"]) {
							_iterator16["return"]();
						}
					} finally {
						if (_didIteratorError16) {
							throw _iteratorError16;
						}
					}
				}
			}

			this.__gameId = id;

			this.websocket.send(JSON.stringify({
				op: 3,
				d: {
					idle_since: this.__idleTime,
					game_id: this.__gameId
				}
			}));
		}
	}, {
		key: "playGame",
		value: function playGame(id) {
			this.setPlayingGame(id);
		}
	}, {
		key: "playingGame",
		value: function playingGame(id) {

			this.setPlayingGame(id);
		}
	}, {
		key: "uptime",
		get: function get() {

			return this.readyTime ? Date.now() - this.readyTime : null;
		}
	}, {
		key: "ready",
		get: function get() {
			return this.state === 3;
		}
	}, {
		key: "servers",
		get: function get() {
			return this.serverCache;
		}
	}, {
		key: "channels",
		get: function get() {
			return this.channelCache;
		}
	}, {
		key: "users",
		get: function get() {
			return this.userCache;
		}
	}, {
		key: "PMChannels",
		get: function get() {
			return this.pmChannelCache;
		}
	}, {
		key: "messages",
		get: function get() {

			var msgs = [];
			var _iteratorNormalCompletion17 = true;
			var _didIteratorError17 = false;
			var _iteratorError17 = undefined;

			try {
				for (var _iterator17 = this.channelCache[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
					var channel = _step17.value;

					msgs = msgs.concat(channel.messages);
				}
			} catch (err) {
				_didIteratorError17 = true;
				_iteratorError17 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion17 && _iterator17["return"]) {
						_iterator17["return"]();
					}
				} finally {
					if (_didIteratorError17) {
						throw _iteratorError17;
					}
				}
			}

			return msgs;
		}
	}]);

	return Client;
})();

module.exports = Client;