//discord.js modules
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Endpoints = require("./Endpoints.js");
var User = require("./User.js");
var Server = require("./Server.js");
var Channel = require("./Channel.js");
var Message = require("./Message.js");

//node modules
var request = require("superagent");
var WebSocket = require("ws");

var defaultOptions = {
	cache_tokens: false
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
		this.token = token;
		this.state = 0;
		this.websocket = null;
		this.events = new Map();
		this.user = null;
		this.alreadySentData = false;
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
		this.readyTime = null;
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
			console.log(message);
		}
	}, {
		key: "on",
		value: function on(event, fn) {
			this.events.set(event, fn);
		}
	}, {
		key: "off",
		value: function off(event, fn) {
			this.events["delete"](event);
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
			var evt = this.events.get(event);
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
			var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];

			var self = this;

			this.createws();

			if (this.state === 0 || this.state === 4) {

				this.state = 1; //set the state to logging in

				request.post(Endpoints.LOGIN).send({
					email: email,
					password: password
				}).end(function (err, res) {

					if (err) {
						self.state = 4; //set state to disconnected
						self.trigger("disconnected");
						self.websocket.close();
						callback(err);
					} else {
						self.state = 2; //set state to logged in (not yet ready)
						self.token = res.body.token; //set our token
						self.trySendConnData();
						callback(null, self.token);
					}
				});
			}
		}

		//def createws
	}, {
		key: "createws",
		value: function createws() {
			if (this.websocket) return false;

			var self = this;

			//good to go
			this.websocket = new WebSocket(Endpoints.WEBSOCKET_HUB);

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

				//valid message
				switch (dat.t) {

					case "READY":
						self.debug("received ready packet");

						self.user = self.addUser(data.user);

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = data.guilds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var _server = _step.value;

								var server = self.addServer(_server);

								var _iteratorNormalCompletion2 = true;
								var _didIteratorError2 = false;
								var _iteratorError2 = undefined;

								try {
									for (var _iterator2 = _server.channels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
										var channel = _step2.value;

										server.channels.push(self.addChannel(channel, server.id));
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

						self.trigger("ready");
						self.readyTime = Date.now();
						self.debug("cached " + self.serverCache.length + " servers, " + self.channelCache.length + " channels and " + self.userCache.length + " users.");

						setInterval(function () {
							self.keepAlive.apply(self);
						}, data.heartbeat_interval);

						break;
					case "MESSAGE_CREATE":
						self.debug("received message");

						var mentions = [];
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = data.mentions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var mention = _step3.value;

								mentions.push(self.addUser(mention));
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

						var channel = self.getChannel("id", data.channel_id);
						var msg = channel.addMessage(new Message(data, channel, mentions, self.addUser(data.author)));

						self.trigger("message", msg);

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
							var _iteratorNormalCompletion4 = true;
							var _didIteratorError4 = false;
							var _iteratorError4 = undefined;

							try {
								for (var _iterator4 = info.mentions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
									var mention = _step4.value;

									mentions.push(self.addUser(mention));
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

							var serv = self.addServer(data);

							var _iteratorNormalCompletion5 = true;
							var _didIteratorError5 = false;
							var _iteratorError5 = undefined;

							try {
								for (var _iterator5 = data.channels[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
									var channel = _step5.value;

									serv.channels.push(self.addChannel(channel, serv.id));
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
						}

						self.trigger("serverCreate", server);

						break;

					case "CHANNEL_CREATE":

						var channel = self.getChannel("id", data.id);

						if (!channel) {

							var chann = self.addChannel(data, data.guild_id);
							var srv = self.getServer("id", data.guild_id);
							if (srv) {
								srv.channels.push(chann);
							}
							self.trigger("channelCreate", chann);
						}

						break;

					case "GUILD_MEMBER_ADD":

						var server = self.getServer("id", data.guild_id);

						if (server) {

							var user = self.addUser(data.user); //if for whatever reason it doesn't exist..

							if (! ~server.members.indexOf(user)) {
								server.members.push(user);
							}

							self.trigger("serverNewMember", user);
						}

						break;

					case "GUILD_MEMBER_REMOVE":

						var server = self.getServer("id", data.guild_id);

						if (server) {

							var user = self.addUser(data.user); //if for whatever reason it doesn't exist..

							if (~server.members.indexOf(user)) {
								server.members.splice(server.members.indexOf(user), 1);
							}

							self.trigger("serverRemoveMember", user);
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

		//def addServer
	}, {
		key: "addServer",
		value: function addServer(data) {
			if (!this.getServer("id", data.id)) {
				this.serverCache.push(new Server(data, this));
			}
			return this.getServer("id", data.id);
		}

		//def getUser
	}, {
		key: "getUser",
		value: function getUser(key, value) {
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;

			try {
				for (var _iterator6 = this.userCache[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var user = _step6.value;

					if (user[key] === value) {
						return user;
					}
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

			return null;
		}

		//def getChannel
	}, {
		key: "getChannel",
		value: function getChannel(key, value) {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = this.channelCache[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var channel = _step7.value;

					if (channel[key] === value) {
						return channel;
					}
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

			return null;
		}

		//def getServer
	}, {
		key: "getServer",
		value: function getServer(key, value) {
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				for (var _iterator8 = this.serverCache[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var server = _step8.value;

					if (server[key] === value) {
						return server;
					}
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

			return null;
		}

		//def trySendConnData
	}, {
		key: "trySendConnData",
		value: function trySendConnData() {

			if (this.token && this.websocket.readyState === WebSocket.OPEN && !this.alreadySentData) {

				this.alreadySentData = true;

				var data = {
					op: 2,
					d: {
						token: this.token,
						v: 2,
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
		key: "messages",
		get: function get() {

			var msgs = [];
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;

			try {
				for (var _iterator9 = this.channelCache[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					var channel = _step9.value;

					msgs = msgs.concat(channel.messages);
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

			return msgs;
		}
	}]);

	return Client;
})();

module.exports = Client;