(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Discord = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

			var prom = new Promise(function (resolve, reject) {
				if (timeout) {
					setTimeout(remove, timeout);
				} else {
					remove();
				}

				function remove() {
					if (self.options.queue) {
						if (!self.queue[message.channel.id]) {
							self.queue[message.channel.id] = [];
						}
						self.queue[message.channel.id].push({
							action: "deleteMessage",
							message: message,
							then: good,
							error: bad
						});

						self.checkQueue(message.channel.id);
					} else {
						self._deleteMessage(message).then(good)["catch"](bad);
					}
				}

				function good() {
					prom.success = true;
					callback(null);
					resolve();
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

							if (! ~server.members.indexOf(user)) {
								server.members.push(user);
							}

							self.trigger("serverNewMember", user, server);
						}

						break;

					case "GUILD_MEMBER_REMOVE":

						var server = self.getServer("id", data.guild_id);

						if (server) {

							var user = self.addUser(data.user); //if for whatever reason it doesn't exist..

							if (~server.members.indexOf(user)) {
								server.members.splice(server.members.indexOf(user), 1);
							}

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
							var presenceUser = new User(data.user);
							if (presenceUser.equalsStrict(userInCache)) {
								//they're exactly the same, an actual presence update
								userInCache.status = data.status;
								self.trigger("presence", {
									user: userInCache,
									status: data.status,
									server: self.getServer("id", data.guild_id),
									gameId: data.game_id
								});
							} else {
								//one of their details changed.
								self.trigger("userUpdate", userInCache, presenceUser);
								self.userCache[self.userCache.indexOf(userInCache)] = presenceUser;
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
		key: "_deleteMessage",
		value: function _deleteMessage(message) {
			var self = this;
			return new Promise(function (resolve, reject) {

				request.del(Endpoints.CHANNELS + "/" + message.channel.id + "/messages/" + message.id).set("authorization", self.token).end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		}
	}, {
		key: "checkQueue",
		value: function checkQueue(channelID) {
			var _this = this;

			var self = this;

			if (!this.checkingQueue[channelID]) {
				(function () {
					var doNext = function doNext() {
						if (self.queue[channelID].length === 0) {
							done();
							return;
						}
						var queuedEvent = self.queue[channelID][0];
						switch (queuedEvent.action) {
							case "sendMessage":
								var msgToSend = queuedEvent;
								self._sendMessage(channelID, msgToSend.content, msgToSend.tts, msgToSend.mentions).then(function (msg) {
									msgToSend.then(msg);
									self.queue[channelID].shift();
									doNext();
								})["catch"](function (err) {
									msgToSend.error(err);
									self.queue[channelID].shift();
									doNext();
								});
								break;
							case "sendFile":
								var fileToSend = queuedEvent;
								self._sendFile(channelID, fileToSend.attachment, fileToSend.attachmentName).then(function (msg) {
									fileToSend.then(msg);
									self.queue[channelID].shift();
									doNext();
								})["catch"](function (err) {
									fileToSend.error(err);
									self.queue[channelID].shift();
									doNext();
								});
								break;
							case "updateMessage":
								var msgToUpd = queuedEvent;
								self._updateMessage(msgToUpd.message, msgToUpd.content).then(function (msg) {
									msgToUpd.then(msg);
									self.queue[channelID].shift();
									doNext();
								})["catch"](function (err) {
									msgToUpd.error(err);
									self.queue[channelID].shift();
									doNext();
								});
								break;
							case "deleteMessage":
								var msgToDel = queuedEvent;
								self._deleteMessage(msgToDel.message).then(function (msg) {
									msgToDel.then(msg);
									self.queue[channelID].shift();
									doNext();
								})["catch"](function (err) {
									msgToDel.error(err);
									self.queue[channelID].shift();
									doNext();
								});
								break;
							default:
								done();
								break;
						}
					};

					var done = function done() {
						self.checkingQueue[channelID] = false;
						return;
					};

					//if we aren't already checking this queue.
					_this.checkingQueue[channelID] = true;
					doNext();
				})();
			}
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

},{"../ref/gameMap.json":15,"./Endpoints.js":2,"./PMChannel.js":3,"./channel.js":4,"./invite.js":6,"./message.js":7,"./server.js":8,"./user.js":9,"fs":10,"superagent":11,"ws":14}],2:[function(require,module,exports){
"use strict";

exports.BASE_DOMAIN = "discordapp.com";
exports.BASE = "https://" + exports.BASE_DOMAIN;
exports.WEBSOCKET_HUB = "wss://" + exports.BASE_DOMAIN + "/hub";

exports.API = exports.BASE + "/api";
exports.AUTH = exports.API + "/auth";
exports.LOGIN = exports.AUTH + "/login";
exports.LOGOUT = exports.AUTH + "/logout";
exports.USERS = exports.API + "/users";
exports.SERVERS = exports.API + "/guilds";
exports.CHANNELS = exports.API + "/channels";

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PMChannel = (function () {
	function PMChannel(data, client) {
		_classCallCheck(this, PMChannel);

		this.user = client.getUser("id", data.recipient.id);
		this.id = data.id;
		this.messages = [];
	}

	_createClass(PMChannel, [{
		key: "addMessage",
		value: function addMessage(data) {
			if (!this.getMessage("id", data.id)) {
				this.messages.push(data);
			}
			return this.getMessage("id", data.id);
		}
	}, {
		key: "getMessage",
		value: function getMessage(key, value) {

			if (this.messages.length > 1000) {
				this.messages.splice(0, 1);
			}

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var message = _step.value;

					if (message[key] === value) {
						return message;
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

			return null;
		}
	}, {
		key: "isPrivate",
		get: function get() {
			return true;
		}
	}]);

	return PMChannel;
})();

module.exports = PMChannel;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Channel = (function () {
    function Channel(data, server) {
        _classCallCheck(this, Channel);

        this.server = server;
        this.name = data.name;
        this.type = data.type;
        this.topic = data.topic;
        this.id = data.id;
        this.messages = [];
        //this.isPrivate = isPrivate; //not sure about the implementation of this...
    }

    _createClass(Channel, [{
        key: "equals",
        value: function equals(object) {
            return object && object.id === this.id;
        }
    }, {
        key: "addMessage",
        value: function addMessage(data) {

            if (this.messages.length > 1000) {
                this.messages.splice(0, 1);
            }

            if (!this.getMessage("id", data.id)) {
                this.messages.push(data);
            }

            return this.getMessage("id", data.id);
        }
    }, {
        key: "getMessage",
        value: function getMessage(key, value) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var message = _step.value;

                    if (message[key] === value) {
                        return message;
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

            return null;
        }
    }, {
        key: "toString",
        value: function toString() {
            return "<#" + this.id + ">";
        }
    }, {
        key: "client",
        get: function get() {
            return this.server.client;
        }
    }, {
        key: "isPrivate",
        get: function get() {
            return false;
        }
    }, {
        key: "users",
        get: function get() {
            return this.server.members;
        }
    }, {
        key: "members",
        get: function get() {
            return this.server.members;
        }
    }]);

    return Channel;
})();

module.exports = Channel;

},{}],5:[function(require,module,exports){
"use strict";

var request = require("superagent");
var Endpoints = require("./Endpoints.js");
var Client = require("./Client.js");

var Discord = {
	Endpoints: Endpoints,
	Client: Client
};

module.exports = Discord;

},{"./Client.js":1,"./Endpoints.js":2,"superagent":11}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Invite = (function () {
    function Invite(data, client) {
        _classCallCheck(this, Invite);

        this.max_age = data.max_age;
        this.code = data.code;
        this.server = client.getServer("id", data.guild.id);
        this.revoked = data.revoked;
        this.created_at = Date.parse(data.created_at);
        this.temporary = data.temporary;
        this.uses = data.uses;
        this.max_uses = data.uses;
        this.inviter = client.addUser(data.inviter);
        this.xkcd = data.xkcdpass;
        this.channel = client.getChannel("id", data.channel.id);
    }

    _createClass(Invite, [{
        key: "URL",
        get: function get() {
            var code = this.xkcd ? this.xkcdpass : this.code;
            return "https://discord.gg/" + code;
        }
    }]);

    return Invite;
})();

module.exports = Invite;

},{}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PMChannel = require("./PMChannel.js");

var Message = (function () {
	function Message(data, channel, mentions, author) {
		_classCallCheck(this, Message);

		this.tts = data.tts;
		this.timestamp = Date.parse(data.timestamp);
		this.nonce = data.nonce;
		this.mentions = mentions;
		this.everyoneMentioned = data.mention_everyone;
		this.id = data.id;
		this.embeds = data.embeds;
		this.editedTimestamp = data.edited_timestamp;
		this.content = data.content.trim();
		this.channel = channel;
		this.author = author;
		this.attachments = data.attachments;
	}

	/*exports.Message.prototype.isPM = function() {
 	return ( this.channel instanceof PMChannel );
 }*/

	_createClass(Message, [{
		key: "isMentioned",
		value: function isMentioned(user) {
			var id = user.id ? user.id : user;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.mentions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var mention = _step.value;

					if (mention.id === id) {
						return true;
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

			return false;
		}
	}, {
		key: "sender",
		get: function get() {
			return this.author;
		}
	}, {
		key: "isPrivate",
		get: function get() {
			return this.channel.isPrivate;
		}
	}]);

	return Message;
})();

module.exports = Message;

},{"./PMChannel.js":3}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = (function () {
	function Server(data, client) {
		_classCallCheck(this, Server);

		this.client = client;
		this.region = data.region;
		this.ownerID = data.owner_id;
		this.name = data.name;
		this.id = data.id;
		this.members = [];
		this.channels = [];
		this.icon = data.icon;
		this.afkTimeout = data.afk_timeout;
		this.afkChannelId = data.afk_channel_id;

		if (!data.members) {
			data.members = [client.user];
			return;
		}

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = data.members[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var member = _step.value;

				// first we cache the user in our Discord Client,
				// then we add it to our list. This way when we
				// get a user from this server's member list,
				// it will be identical (unless an async change occurred)
				// to the client's cache.
				if (member.user) this.members.push(client.addUser(member.user));
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
	}

	_createClass(Server, [{
		key: "getChannel",

		// get/set
		value: function getChannel(key, value) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.channels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var channel = _step2.value;

					if (channel[key] === value) {
						return channel;
					}
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

			return null;
		}
	}, {
		key: "getMember",
		value: function getMember(key, value) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.members[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var member = _step3.value;

					if (member[key] === value) {
						return member;
					}
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

			return null;
		}
	}, {
		key: "addChannel",
		value: function addChannel(chann) {
			if (!this.getChannel("id", chann.id)) {
				this.channels.push(chann);
			}
			return chann;
		}
	}, {
		key: "addMember",
		value: function addMember(member) {
			if (!this.getMember("id", member.id)) {
				this.members.push(member);
			}
			return member;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.name;
		}
	}, {
		key: "equals",
		value: function equals(object) {
			return object.id === this.id;
		}
	}, {
		key: "iconURL",
		get: function get() {
			if (!this.icon) return null;
			return "https://discordapp.com/api/guilds/" + this.id + "/icons/" + this.icon + ".jpg";
		}
	}, {
		key: "afkChannel",
		get: function get() {
			if (!this.afkChannelId) return false;

			return this.getChannel("id", this.afkChannelId);
		}
	}, {
		key: "defaultChannel",
		get: function get() {
			return this.getChannel("name", "general");
		}
	}, {
		key: "owner",
		get: function get() {
			return this.client.getUser("id", this.ownerID);
		}
	}, {
		key: "users",
		get: function get() {
			return this.members;
		}
	}]);

	return Server;
})();

module.exports = Server;

},{}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = (function () {
	function User(data) {
		_classCallCheck(this, User);

		this.username = data.username;
		this.discriminator = data.discriminator;
		this.id = data.id;
		this.avatar = data.avatar;
		this.status = "offline";
	}

	// access using user.avatarURL;

	_createClass(User, [{
		key: "mention",
		value: function mention() {
			return "<@" + this.id + ">";
		}
	}, {
		key: "toString",
		value: function toString() {
			/*
   	if we embed a user in a String - like so:
   	"Yo " + user + " what's up?"
   	It would generate something along the lines of:
   	"Yo @hydrabolt what's up?"
   */
			return this.mention();
		}
	}, {
		key: "equals",
		value: function equals(object) {
			return object.id === this.id;
		}
	}, {
		key: "equalsStrict",
		value: function equalsStrict(object) {
			return object.id === this.id && object.avatar === this.avatar && object.username === this.username && object.discriminator === this.discriminator;
		}
	}, {
		key: "avatarURL",
		get: function get() {
			if (!this.avatar) return null;
			return "https://discordapp.com/api/users/" + this.id + "/avatars/" + this.avatar + ".jpg";
		}
	}]);

	return User;
})();

module.exports = User;

},{}],10:[function(require,module,exports){

},{}],11:[function(require,module,exports){
/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? (this || self)
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    if (null != obj[key]) {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(obj[key]));
    }
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this.parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      return self.callback(err);
    }

    self.emit('response', res);

    if (err) {
      return self.callback(err, res);
    }

    if (res.status >= 200 && res.status < 300) {
      return self.callback(err, res);
    }

    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
    new_err.original = err;
    new_err.response = res;
    new_err.status = res.status;

    self.callback(new_err, res);
  });
}

/**
 * Mixin `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Allow for extension
 */

Request.prototype.use = function(fn) {
  fn(this);
  return this;
}

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Write the field `name` and `val` for "multipart/form-data"
 * request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 * ```
 *
 * @param {String} name
 * @param {String|Blob|File} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.field = function(name, val){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(name, val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  if (!this._formData) this._formData = new root.FormData();
  this._formData.append(field, file, filename);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || isHost(data)) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self.timeoutError();
      if (self.aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(e){
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    xhr.onprogress = handleProgress;
  }
  try {
    if (xhr.upload && this.hasListeners('progress')) {
      xhr.upload.onprogress = handleProgress;
    }
  } catch(e) {
    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
    // Reported here:
    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var contentType = this.getHeader('Content-Type');
    var serialize = request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  this.emit('request', this);
  xhr.send(data);
  return this;
};

/**
 * Faux promise support
 *
 * @param {Function} fulfill
 * @param {Function} reject
 * @return {Request}
 */

Request.prototype.then = function (fulfill, reject) {
  return this.end(function(err, res) {
    err ? reject(err) : fulfill(res);
  });
}

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

},{"emitter":12,"reduce":13}],12:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],13:[function(require,module,exports){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
},{}],14:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],15:[function(require,module,exports){
module.exports=[{"executables":{"win32":["pol.exe"]},"id":0,"name":"FINAL FANTASY XI"},{"executables":{"win32":["ffxiv.exe","ffxiv_dx11.exe"]},"id":1,"name":"FINAL FANTASY XIV"},{"executables":{"win32":["Wow.exe","Wow-64.exe"]},"id":3,"name":"World of Warcraft"},{"executables":{"darwin":["LoLLauncher.app"],"win32":["LolClient.exe","League of Legends.exe"]},"id":4,"name":"League of Legends"},{"executables":{"darwin":["Diablo%20III.app"],"win32":["Diablo III.exe"]},"id":5,"name":"Diablo 3"},{"executables":{"darwin":["dota_osx.app"],"win32":["dota2.exe"]},"id":6,"name":"DOTA 2"},{"executables":{"darwin":["Heroes.app"],"win32":["Heroes of the Storm.exe","HeroesOfTheStorm_x64.exe","HeroesOfTheStorm.exe"]},"id":7,"name":"Heroes of the Storm"},{"executables":{"darwin":["Hearthstone.app"],"win32":["Hearthstone.exe"]},"id":8,"name":"Hearthstone"},{"executables":{"win32":["csgo.exe"]},"id":9,"name":"Counter-Strike: Global Offensive"},{"executables":{"win32":["WorldOfTanks.exe"]},"id":10,"name":"World of Tanks"},{"executables":{"darwin":["gw2.app"],"win32":["gw2.exe"]},"id":11,"name":"Guild Wars 2"},{"executables":{"win32":["dayz.exe"]},"id":12,"name":"Day Z"},{"executables":{"darwin":["starcraft%20ii.app"],"win32":["starcraft ii.exe","SC2_x64.exe","SC2.exe"]},"id":13,"name":"Starcraft II"},{"executables":{"win32":["diablo.exe"]},"id":14,"name":"Diablo"},{"executables":{"win32":["diablo ii.exe"]},"id":15,"name":"Diablo 2"},{"executables":{"win32":["left4dead.exe"]},"id":17,"name":"Left 4 Dead"},{"executables":{"darwin":["minecraft.app"],"win32":["minecraft.exe"]},"id":18,"name":"Minecraft"},{"executables":{"win32":["smite.exe"]},"id":19,"name":"Smite"},{"executables":{"win32":["bf4.exe"]},"id":20,"name":"Battlefield 4"},{"executables":{"win32":["AoK HD.exe","empires2.exe"]},"id":101,"name":"Age of Empire II"},{"executables":{"win32":["age3y.exe"]},"id":102,"name":"Age of Empire III"},{"executables":{"win32":["AlanWake.exe"]},"id":104,"name":"Alan Wake"},{"executables":{"win32":["alan_wakes_american_nightmare.exe"]},"id":105,"name":"Alan Wake's American Nightmare"},{"executables":{"win32":["AlienBreed2Assault.exe"]},"id":106,"name":"Alien Breed 2: Assault"},{"executables":{"win32":["Amnesia.exe"]},"id":107,"name":"Amnesia: The Dark Descent"},{"executables":{"win32":["UDK.exe"]},"id":108,"name":"Antichamber"},{"executables":{"win32":["ArcheAge.exe"]},"id":109,"name":"ArcheAge"},{"executables":{"win32":["arma3.exe"]},"id":110,"name":"Arma III"},{"executables":{"win32":["AC3SP.exe"]},"id":111,"name":"Assassin's Creed 3"},{"executables":{"win32":["Bastion.exe"]},"id":112,"name":"Bastion"},{"executables":{"win32":["BF2.exe"]},"id":113,"name":"Battlefield 2"},{"executables":{"win32":["bf3.exe"]},"id":114,"name":"Battlefield 3"},{"executables":{"win32":["Besiege.exe"]},"id":116,"name":"Besiege"},{"executables":{"win32":["Bioshock.exe"]},"id":117,"name":"Bioshock"},{"executables":{"win32":["Bioshock2.exe"]},"id":118,"name":"BioShock II"},{"executables":{"win32":["BioShockInfinite.exe"]},"id":119,"name":"BioShock Infinite"},{"executables":{"win32":["Borderlands2.exe"]},"id":122,"name":"Borderlands 2"},{"executables":{"win32":["braid.exe"]},"id":123,"name":"Braid"},{"executables":{"win32":["ShippingPC-StormGame.exe"]},"id":124,"name":"Bulletstorm"},{"executables":{},"id":125,"name":"Cabal 2"},{"executables":{"win32":["CabalMain.exe"]},"id":126,"name":"Cabal Online"},{"executables":{"win32":["iw4mp.exe","iw4sp.exe"]},"id":127,"name":"Call of Duty: Modern Warfare 2"},{"executables":{"win32":["t6sp.exe"]},"id":128,"name":"Call of Duty: Black Ops"},{"executables":{"win32":["iw5mp.exe"]},"id":129,"name":"Call of Duty: Modern Warfare 3"},{"executables":{"win32":["RelicCOH.exe"]},"id":132,"name":"Company of Heroes"},{"executables":{"win32":["Crysis64.exe"]},"id":135,"name":"Crysis"},{"executables":{"win32":["Crysis2.exe"]},"id":136,"name":"Crysis 2"},{"executables":{"win32":["Crysis3.exe"]},"id":137,"name":"Crysis 3"},{"executables":{"win32":["Crysis.exe"]},"id":138,"name":"Crysis 4  "},{"executables":{"win32":["DATA.exe"]},"id":140,"name":"Dark Souls"},{"executables":{"win32":["DarkSoulsII.exe"]},"id":141,"name":"Dark Souls II"},{"executables":{"win32":["dfuw.exe"]},"id":142,"name":"Darkfall: Unholy Wars"},{"executables":{"win32":["DCGAME.exe"]},"id":144,"name":"DC Universe Online"},{"executables":{"win32":["DeadIslandGame.exe"]},"id":145,"name":"Dead Island"},{"executables":{"win32":["deadspace2.exe"]},"id":146,"name":"Dead Space 2"},{"executables":{"win32":["LOTDGame.exe"]},"id":147,"name":"Deadlight"},{"executables":{"win32":["dxhr.exe"]},"id":148,"name":"Deus Ex: Human Revolution"},{"executables":{"win32":["DeviMayCry4.exe"]},"id":149,"name":"Devil May Cry 4"},{"executables":{"win32":["DMC-DevilMayCry.exe"]},"id":150,"name":"DmC Devil May Cry"},{"executables":{"win32":["dirt2_game.exe"]},"id":154,"name":"DiRT 2"},{"executables":{"win32":["dirt3_game.exe"]},"id":155,"name":"DiRT 3"},{"executables":{"win32":["dota.exe"]},"id":156,"name":"DOTA"},{"executables":{"win32":["DoubleDragon.exe"]},"id":158,"name":"Double Dragon Neon"},{"executables":{"win32":["DragonAge2.exe"]},"id":159,"name":"Dragon Age II"},{"executables":{"win32":["DragonAgeInquisition.exe"]},"id":160,"name":"Dragon Age: Inquisition"},{"executables":{"win32":["daorigins.exe"]},"id":161,"name":"Dragon Age: Origins"},{"executables":{"win32":["DBXV.exe"]},"id":162,"name":"Dragon Ball XenoVerse"},{"executables":{"win32":["DukeForever.exe"]},"id":163,"name":"Duke Nukem Forever"},{"executables":{"darwin":["Dustforce.app"],"win32":["dustforce.exe"]},"id":164,"name":"Dustforce"},{"executables":{"win32":["EliteDangerous32.exe"]},"id":165,"name":"Elite: Dangerous"},{"executables":{"win32":["exefile.exe"]},"id":166,"name":"Eve Online"},{"executables":{"win32":["eqgame.exe"]},"id":167,"name":"EverQuest"},{"executables":{"win32":["EverQuest2.exe"]},"id":168,"name":"EverQuest II"},{"executables":{},"id":169,"name":"EverQuest Next"},{"executables":{"win32":["Engine.exe"]},"id":170,"name":"F.E.A.R."},{"executables":{"win32":["FEAR2.exe"]},"id":171,"name":"F.E.A.R. 2: Project Origin"},{"executables":{"win32":["fallout3.exe"]},"id":172,"name":"Fallout 3"},{"executables":{"win32":["FalloutNV.exe"]},"id":174,"name":"Fallout: New Vegas"},{"executables":{"win32":["farcry3.exe"]},"id":175,"name":"Far Cry 3"},{"executables":{"win32":["fifa15.exe"]},"id":176,"name":"FIFA 15"},{"executables":{"win32":["FTLGame.exe"]},"id":180,"name":"FTL: Faster Than Light"},{"executables":{"win32":["GTAIV.exe"]},"id":181,"name":"Grand Theft Auto 4"},{"executables":{"win32":["GTA5.exe"]},"id":182,"name":"Grand Theft Auto 5"},{"executables":{"win32":["Gw.exe"]},"id":183,"name":"Guild Wars"},{"executables":{"win32":["H1Z1.exe"]},"id":186,"name":"H1Z1"},{"executables":{"win32":["HL2HL2.exe","hl2.exe"]},"id":188,"name":"Half Life 2"},{"executables":{"win32":["HOMEFRONT.exe"]},"id":195,"name":"Homefront"},{"executables":{"win32":["invisibleinc.exe"]},"id":196,"name":"Invisible Inc."},{"executables":{"win32":["LANoire.exe"]},"id":197,"name":"L.A. Noire"},{"executables":{"win32":["Landmark64.exe"]},"id":198,"name":"Landmark"},{"executables":{"win32":["left4dead2.exe"]},"id":201,"name":"Left 4 Dead 2"},{"executables":{"win32":["lineage.exe"]},"id":203,"name":"Lineage"},{"executables":{"win32":["Magicka.exe"]},"id":206,"name":"Magicka"},{"executables":{"win32":["MapleStory.exe"]},"id":208,"name":"MapleStory"},{"executables":{},"id":209,"name":"Mark of the Ninja"},{"executables":{"win32":["MassEffect.exe"]},"id":210,"name":"Mass Effect"},{"executables":{"win32":["MassEffect2.exe"]},"id":211,"name":"Mass Effect 2"},{"executables":{"win32":["MassEffect3Demo.exe"]},"id":212,"name":"Mass Effect 3"},{"executables":{"win32":["METAL GEAR RISING REVENGEANCE.exe"]},"id":214,"name":"Metal Gear Rising: Revengeance"},{"executables":{"win32":["metro2033.exe"]},"id":215,"name":"Metro 2033"},{"executables":{"win32":["MetroLL.exe"]},"id":216,"name":"Metro Last Light"},{"executables":{"win32":["MK10.exe"]},"id":218,"name":"Mortal Kombat X"},{"executables":{"win32":["speed.exe"]},"id":219,"name":"Need For Speed Most Wanted"},{"executables":{},"id":220,"name":"Neverwinder"},{"executables":{"darwin":["Outlast.app"],"win32":["OLGame.exe"]},"id":221,"name":"Outlast"},{"executables":{"win32":["PapersPlease.exe"]},"id":222,"name":"Papers, Please"},{"executables":{"win32":["payday_win32_release.exe"]},"id":223,"name":"PAYDAY"},{"executables":{"win32":["payday2_win32_release.exe"]},"id":224,"name":"PAYDAY2"},{"executables":{"win32":["PillarsOfEternity.exe"]},"id":225,"name":"Pillars of Eternity"},{"executables":{"win32":["PA.exe"]},"id":226,"name":"Planetary Annihilation"},{"executables":{"win32":["planetside2_x86.exe"]},"id":227,"name":"Planetside 2"},{"executables":{"win32":["hl2P.exe"]},"id":228,"name":"Portal"},{"executables":{"win32":["portal2.exe"]},"id":229,"name":"Portal 2"},{"executables":{"win32":["PrimalCarnageGame.exe"]},"id":231,"name":"Primal Cargnage"},{"executables":{"win32":["pCARS.exe"]},"id":232,"name":"Project Cars"},{"executables":{"win32":["RaceTheSun.exe"]},"id":233,"name":"Race The Sun"},{"executables":{"win32":["Rage.exe"]},"id":234,"name":"RAGE"},{"executables":{"win32":["ragexe.exe"]},"id":235,"name":"Ragnarok Online"},{"executables":{"win32":["rift.exe"]},"id":236,"name":"Rift"},{"executables":{"win32":["Rocksmith2014.exe"]},"id":237,"name":"Rocksmith 2014"},{"executables":{"win32":["SwiftKit-RS.exe","JagexLauncher.exe"]},"id":238,"name":"RuneScape"},{"executables":{"win32":["Shadowgrounds.exe"]},"id":239,"name":"Shadowgrounds"},{"executables":{"win32":["survivor.exe"]},"id":240,"name":"Shadowgrounds: Survivor"},{"executables":{"win32":["ShovelKnight.exe"]},"id":241,"name":"Shovel Knight"},{"executables":{"win32":["SimCity.exe"]},"id":242,"name":"SimCity"},{"executables":{"win32":["SporeApp.exe"]},"id":245,"name":"Spore"},{"executables":{"win32":["StarCitizen.exe"]},"id":246,"name":"Star Citizen"},{"executables":{},"id":247,"name":"Star Trek Online"},{"executables":{"win32":["battlefront.exe"]},"id":248,"name":"Star Wars Battlefront"},{"executables":{"win32":["swtor.exe"]},"id":249,"name":"Star Wars: The Old Republic"},{"executables":{"win32":["starbound.exe","starbound_opengl.exe"]},"id":250,"name":"Starbound"},{"executables":{"win32":["starcraft.exe"]},"id":251,"name":"Starcraft"},{"executables":{"win32":["SSFIV.exe"]},"id":253,"name":"Ultra Street Fighter IV"},{"executables":{"win32":["superhexagon.exe"]},"id":254,"name":"Super Hexagon"},{"executables":{"win32":["swordandsworcery_pc.exe"]},"id":255,"name":"Superbrothers: Sword & Sworcery EP"},{"executables":{"win32":["hl2TF.exe"]},"id":256,"name":"Team Fortress 2"},{"executables":{"win32":["TERA.exe"]},"id":258,"name":"TERA"},{"executables":{"win32":["Terraria.exe"]},"id":259,"name":"Terraria"},{"executables":{"win32":["Bethesda.net_Launcher.exe"]},"id":260,"name":"The Elder Scrolls Online"},{"executables":{"win32":["TESV.exe"]},"id":261,"name":"The Elder Scrolls V: Skyrim"},{"executables":{"win32":["TheSecretWorld.exe"]},"id":262,"name":"The Secret World"},{"executables":{"win32":["TS3.exe","ts3w.exe"]},"id":264,"name":"The Sims 3"},{"executables":{"win32":["WALKINGDEAD101.EXE"]},"id":265,"name":"The Walking Dead"},{"executables":{"win32":["TheWalkingDead2.exe"]},"id":266,"name":"The Walking Dead Season Two"},{"executables":{"win32":["witcher3.exe"]},"id":267,"name":"The Witcher 3"},{"executables":{"win32":["Future Soldier.exe"]},"id":268,"name":"Tom Clancy's Ghost Recon: Future Solider"},{"executables":{"win32":["TombRaider.exe"]},"id":269,"name":"Tomb Raider (2013)"},{"executables":{"win32":["Torchlight.exe"]},"id":271,"name":"Torchlight"},{"executables":{"win32":["Torchlight2.exe"]},"id":272,"name":"Torchlight 2"},{"executables":{"win32":["Shogun2.exe"]},"id":273,"name":"Total War: Shogun 2"},{"executables":{"win32":["Transistor.exe"]},"id":274,"name":"Transistor"},{"executables":{"win32":["trine.exe"]},"id":275,"name":"Trine"},{"executables":{"win32":["trine2_32bit.exe"]},"id":276,"name":"Trine 2"},{"executables":{"win32":["UOKR.exe"]},"id":277,"name":"Ultima Online"},{"executables":{"win32":["aces.exe"]},"id":279,"name":"War Thunder"},{"executables":{"win32":["Warcraft III.exe","wc3.exe"]},"id":281,"name":"Warcraft 3: Reign of Chaos"},{"executables":{"win32":["Warcraft II BNE.exe"]},"id":282,"name":"Warcraft II"},{"executables":{"win32":["Warframe.x64.exe","Warframe.exe"]},"id":283,"name":"Warframe"},{"executables":{"win32":["watch_dogs.exe"]},"id":284,"name":"Watch Dogs"},{"executables":{"win32":["WildStar64.exe"]},"id":285,"name":"WildStar"},{"executables":{"win32":["XComGame.exe"]},"id":288,"name":"XCOM: Enemy Unknown"},{"executables":{"win32":["DFO.exe","dfo.exe"]},"id":289,"name":"Dungeon Fighter Online"},{"executables":{"win32":["aclauncher.exe","acclient.exe"]},"id":290,"name":"Asheron's Call"},{"executables":{"win32":["MapleStory2.exe"]},"id":291,"name":"MapleStory 2"},{"executables":{"win32":["ksp.exe"]},"id":292,"name":"Kerbal Space Program"},{"executables":{"win32":["PINBALL.EXE"]},"id":293,"name":"3D Pinball: Space Cadet"},{"executables":{"win32":["dave.exe"]},"id":294,"name":"Dangerous Dave"},{"executables":{"win32":["iwbtgbeta(slomo).exe","iwbtgbeta(fs).exe"]},"id":295,"name":"I Wanna Be The Guy"},{"executables":{"win32":["MechWarriorOnline.exe "]},"id":296,"name":"Mech Warrior Online"},{"executables":{"win32":["dontstarve_steam.exe"]},"id":297,"name":"Don't Starve"},{"executables":{"win32":["GalCiv3.exe"]},"id":298,"name":"Galactic Civilization 3"},{"executables":{"win32":["Risk of Rain.exe"]},"id":299,"name":"Risk of Rain"},{"executables":{"win32":["Binding_of_Isaac.exe","Isaac-ng.exe"]},"id":300,"name":"The Binding of Isaac"},{"executables":{"win32":["RustClient.exe"]},"id":301,"name":"Rust"},{"executables":{"win32":["Clicker Heroes.exe"]},"id":302,"name":"Clicker Heroes"},{"executables":{"win32":["Brawlhalla.exe"]},"id":303,"name":"Brawlhalla"},{"executables":{"win32":["TownOfSalem.exe"]},"id":304,"name":"Town of Salem"},{"executables":{"win32":["osu!.exe"]},"id":305,"name":"osu!"},{"executables":{"win32":["PathOfExileSteam.exe","PathOfExile.exe"]},"id":306,"name":"Path of Exile"},{"executables":{"win32":["Dolphin.exe"]},"id":307,"name":"Dolphin"},{"executables":{"win32":["RocketLeague.exe"]},"id":308,"name":"Rocket League"},{"executables":{"win32":["TJPP.exe"]},"id":309,"name":"Jackbox Party Pack"},{"executables":{"win32":["KFGame.exe"]},"id":310,"name":"Killing Floor 2"},{"executables":{"win32":["ShooterGame.exe"]},"id":311,"name":"Ark: Survival Evolved"},{"executables":{"win32":["LifeIsStrange.exe"]},"id":312,"name":"Life Is Strange"},{"executables":{"win32":["Client_tos.exe"]},"id":313,"name":"Tree of Savior"},{"executables":{"win32":["olliolli2.exe"]},"id":314,"name":"OlliOlli2"},{"executables":{"win32":["cw.exe"]},"id":315,"name":"Closers Dimension Conflict"},{"executables":{"win32":["ESSTEAM.exe","elsword.exe","x2.exe"]},"id":316,"name":"Elsword"},{"executables":{"win32":["ori.exe"]},"id":317,"name":"Ori and the Blind Forest"},{"executables":{"win32":["Skyforge.exe"]},"id":318,"name":"Skyforge"},{"executables":{"win32":["projectzomboid64.exe","projectzomboid32.exe"]},"id":319,"name":"Project Zomboid"},{"executables":{"win32":["From_The_Depths.exe"]},"id":320,"name":"The Depths"},{"executables":{"win32":["TheCrew.exe"]},"id":321,"name":"The Crew"},{"executables":{"win32":["MarvelHeroes2015.exe"]},"id":322,"name":"Marvel Heroes 2015"},{"executables":{"win32":["timeclickers.exe"]},"id":324,"name":"Time Clickers"},{"executables":{"win32":["eurotrucks2.exe"]},"id":325,"name":"Euro Truck Simulator 2"},{"executables":{"win32":["FarmingSimulator2015Game.exe"]},"id":326,"name":"Farming Simulator 15"},{"executables":{"win32":["strife.exe"]},"id":327,"name":"Strife"},{"executables":{"win32":["Awesomenauts.exe"]},"id":328,"name":"Awesomenauts"},{"executables":{"win32":["Dofus.exe"]},"id":329,"name":"Dofus"},{"executables":{"win32":["Boid.exe"]},"id":330,"name":"Boid"},{"executables":{"win32":["adventure-capitalist.exe"]},"id":331,"name":"AdVenture Capitalist"},{"executables":{"win32":["OrcsMustDie2.exe"]},"id":332,"name":"Orcs Must Die! 2"},{"executables":{"win32":["Mountain.exe"]},"id":333,"name":"Mountain"},{"executables":{"win32":["Valkyria.exe"]},"id":335,"name":"Valkyria Chronicles"},{"executables":{"win32":["ffxiiiimg.exe"]},"id":336,"name":"Final Fantasy XIII"},{"executables":{"win32":["TLR.exe"]},"id":337,"name":"The Last Remnant"},{"executables":{"win32":["Cities.exe"]},"id":339,"name":"Cities Skylines"},{"executables":{"win32":["worldofwarships.exe","WoWSLauncher.exe"]},"id":341,"name":"World of Warships"},{"executables":{"win32":["spacegame-Win64-shipping.exe"]},"id":342,"name":"Fractured Space"},{"executables":{"win32":["thespacegame.exe"]},"id":343,"name":"Ascent - The Space Game"},{"executables":{"win32":["DuckGame.exe"]},"id":344,"name":"Duck Game"},{"executables":{"win32":["PPSSPPWindows.exe"]},"id":345,"name":"PPSSPP"},{"executables":{"win32":["MBAA.exe"]},"id":346,"name":"Melty Blood Actress Again: Current Code"},{"executables":{"win32":["TheWolfAmongUs.exe"]},"id":347,"name":"The Wolf Among Us"},{"executables":{"win32":["SpaceEngineers.exe"]},"id":348,"name":"Space Engineers"},{"executables":{"win32":["Borderlands.exe"]},"id":349,"name":"Borderlands"},{"executables":{"win32":["100orange.exe"]},"id":351,"name":"100% Orange Juice"},{"executables":{"win32":["reflex.exe"]},"id":354,"name":"Reflex"},{"executables":{"win32":["pso2.exe"]},"id":355,"name":"Phantasy Star Online 2"},{"executables":{"win32":["AssettoCorsa.exe"]},"id":356,"name":"Assetto Corsa"},{"executables":{"win32":["iw3mp.exe","iw3sp.exe"]},"id":357,"name":"Call of Duty 4: Modern Warfare"},{"executables":{"win32":["WolfOldBlood_x64.exe"]},"id":358,"name":"Wolfenstein: The Old Blood"},{"executables":{"win32":["castle.exe"]},"id":359,"name":"Castle Crashers"},{"executables":{"win32":["vindictus.exe"]},"id":360,"name":"Vindictus"},{"executables":{"win32":["ShooterGame-Win32-Shipping.exe"]},"id":361,"name":"Dirty Bomb"},{"executables":{"win32":["BatmanAK.exe"]},"id":362,"name":"Batman Arkham Knight"},{"executables":{"win32":["drt.exe"]},"id":363,"name":"Dirt Rally"},{"executables":{"win32":["rFactor.exe"]},"id":364,"name":"rFactor"},{"executables":{"win32":["clonk.exe"]},"id":365,"name":"Clonk Rage"},{"executables":{"win32":["SRHK.exe"]},"id":366,"name":"Shadowrun: Hong Kong"},{"executables":{"win32":["Insurgency.exe"]},"id":367,"name":"Insurgency"},{"executables":{"win32":["StepMania.exe"]},"id":368,"name":"Step Mania"},{"executables":{"win32":["FirefallCLient.exe"]},"id":369,"name":"Firefall"},{"executables":{"win32":["mirrorsedge.exe"]},"id":370,"name":"Mirrors Edge"},{"executables":{"win32":["MgsGroundZeroes.exe"]},"id":371,"name":"Metal Gear Solid V: Ground Zeroes"},{"executables":{"win32":["mgsvtpp.exe"]},"id":372,"name":"Metal Gear Solid V: The Phantom Pain"},{"executables":{"win32":["tld.exe"]},"id":373,"name":"The Long Dark"},{"executables":{"win32":["TKOM.exe"]},"id":374,"name":"Take On Mars"},{"executables":{"win32":["robloxplayerlauncher.exe","Roblox.exe"]},"id":375,"name":"Roblox"},{"executables":{"win32":["eu4.exe"]},"id":376,"name":"Europa Universalis 4"},{"executables":{"win32":["APB.exe"]},"id":377,"name":"APB Reloaded"},{"executables":{"win32":["Robocraft.exe"]},"id":378,"name":"Robocraft"},{"executables":{"win32":["Unity.exe"]},"id":379,"name":"Unity"},{"executables":{"win32":["Simpsons.exe"]},"id":380,"name":"The Simpsons: Hit & Run"},{"executables":{"win32":["Dnlauncher.exe","DragonNest.exe"]},"id":381,"name":"Dragon Nest"},{"executables":{"win32":["Trove.exe"]},"id":382,"name":"Trove"},{"executables":{"win32":["EndlessLegend.exe"]},"id":383,"name":"Endless Legend"},{"executables":{"win32":["TurbineLauncher.exe","dndclient.exe"]},"id":384,"name":"Dungeons & Dragons Online"},{"executables":{"win32":["quakelive.exe","quakelive_steam.exe"]},"id":385,"name":"Quake Live"},{"executables":{"win32":["7DaysToDie.exe"]},"id":386,"name":"7DaysToDie"},{"executables":{"win32":["SpeedRunners.exe"]},"id":387,"name":"SpeedRunners"},{"executables":{"win32":["gamemd.exe"]},"id":388,"name":"Command & Conquer: Red Alert 2"},{"executables":{"win32":["generals.exe"]},"id":389,"name":"Command & Conquer Generals: Zero Hour"},{"executables":{"win32":["Oblivion.exe"]},"id":390,"name":"The Elder Scrolls 4: Oblivion"},{"executables":{"win32":["mgsi.exe"]},"id":391,"name":"Metal Gear Solid"},{"executables":{"win32":["EoCApp.exe"]},"id":392,"name":"Divinity - Original Sin"},{"executables":{"win32":["Torment.exe"]},"id":393,"name":"Planescape: Torment"},{"executables":{"win32":["HexPatch.exe"]},"id":394,"name":"Hex: Shards of Fate"},{"executables":{"win32":["NS3FB.exe"]},"id":395,"name":"Naruto Shippuden Ultimate Ninja Storm 3 Full Burst"},{"executables":{"win32":["NSUNSR.exe"]},"id":396,"name":"Naruto Shippuden Ultimate Ninja Storm Revolution"},{"executables":{"win32":["SaintsRowIV.exe"]},"id":397,"name":"Saints Row IV"},{"executables":{"win32":["Shadowrun.exe"]},"id":398,"name":"Shadowrun"},{"executables":{"win32":["DungeonoftheEndless.exe"]},"id":399,"name":"Dungeon of the Endless"},{"executables":{"win32":["Hon.exe"]},"id":400,"name":"Heroes of Newerth"},{"executables":{"win32":["mabinogi.exe"]},"id":401,"name":"Mabinogi"},{"executables":{"win32":["CoD2MP_s.exe","CoDSP_s.exe"]},"id":402,"name":"Call of Duty 2:"},{"executables":{"win32":["CoDWaWmp.exe","CoDWaw.exe"]},"id":403,"name":"Call of Duty: World at War"},{"executables":{"win32":["heroes.exe"]},"id":404,"name":"Mabinogi Heroes (Vindictus)  "},{"executables":{"win32":["KanColleViewer.exe"]},"id":405,"name":"KanColle "},{"executables":{"win32":["cyphers.exe"]},"id":406,"name":"Cyphers"},{"executables":{"win32":["RelicCoH2.exe"]},"id":407,"name":"Company of Heroes 2"},{"executables":{"win32":["MJ.exe"]},"id":408,"name":"セガNET麻雀MJ"},{"executables":{"win32":["ge.exe"]},"id":409,"name":"Granado Espada"},{"executables":{"win32":["NovaRO.exe"]},"id":410,"name":"Nova Ragnarok Online"},{"executables":{"win32":["RivalsofAether.exe"]},"id":411,"name":"Rivals of Aether"},{"executables":{"win32":["bfh.exe"]},"id":412,"name":"Battlefield Hardline"},{"executables":{"win32":["GrowHome.exe"]},"id":413,"name":"Grow Home"},{"executables":{"win32":["patriots.exe"]},"id":414,"name":"Rise of Nations Extended"},{"executables":{"win32":["Railroads.exe"]},"id":415,"name":"Sid Meier's Railroads!"},{"executables":{"win32":["Empire.exe"]},"id":416,"name":"Empire: Total War"},{"executables":{"win32":["Napoleon.exe"]},"id":417,"name":"Napoleon: Total War"},{"executables":{"win32":["gta_sa.exe"]},"id":418,"name":"Grand Theft Auto: San Andreas"},{"executables":{"win32":["MadMax.exe"]},"id":419,"name":"Mad Max"},{"executables":{"win32":["Titanfall.exe"]},"id":420,"name":"Titanfall"},{"executables":{"win32":["age2_x1.exe"]},"id":421,"name":"Age of Empires II: The Conquerors"},{"executables":{"win32":["Rome2.exe"]},"id":422,"name":"Total War: ROME 2"},{"executables":{"win32":["ShadowOfMordor.exe"]},"id":423,"name":"Middle-earth: Shadow of Mordor"},{"executables":{"win32":["Subnautica.exe"]},"id":424,"name":"Subnautica"},{"executables":{"win32":["anno5.exe"]},"id":425,"name":"Anno 2070"},{"executables":{"win32":["carrier.exe"]},"id":426,"name":"Carrier Command Gaea Mission"},{"executables":{"win32":["DarksidersPC.exe"]},"id":427,"name":"Darksiders"},{"executables":{"win32":["Darksiders2.exe"]},"id":428,"name":"Darksiders 2"},{"executables":{"win32":["mudlet.exe"]},"id":429,"name":"Mudlet"},{"executables":{"win32":["DunDefLauncher.exe"]},"id":430,"name":"Dungeon Defenders II"},{"executables":{"win32":["hng.exe"]},"id":431,"name":"Heroes and Generals"},{"executables":{"win32":["WFTOGame.exe"]},"id":432,"name":"War of the Overworld"},{"executables":{"win32":["Talisman.exe"]},"id":433,"name":"Talisman: Digital Edition"},{"executables":{"win32":["limbo.exe"]},"id":434,"name":"Limbo"},{"executables":{"win32":["ibbobb.exe"]},"id":435,"name":"ibb & obb"},{"executables":{"win32":["BattleBlockTheater.exe"]},"id":436,"name":"BattleBlock Theater"},{"executables":{"win32":["iracinglauncher.exe","iracingsim.exe","iracingsim64.exe"]},"id":437,"name":"iRacing"},{"executables":{"win32":["CivilizationV_DX11.exe"]},"id":438,"name":"Civilization V"}]
},{}]},{},[5])(5)
});