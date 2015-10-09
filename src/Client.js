//discord.js modules
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
}

class Client {

	constructor(options = defaultOptions, token = undefined) {
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

	get uptime() {

		return (this.readyTime ? Date.now() - this.readyTime : null);

	}

	get ready() {
		return this.state === 3;
	}

	get servers() {
		return this.serverCache;
	}

	get channels() {
		return this.channelCache;
	}

	get users() {
		return this.userCache;
	}

	get PMChannels() {
		return this.pmChannelCache;
	}

	get messages() {

		var msgs = [];
		for (var channel of this.channelCache) {
			msgs = msgs.concat(channel.messages);
		}
		return msgs;

	}

	sendPacket(JSONObject) {
		if (this.websocket.readyState === 1) {
			this.websocket.send(JSON.stringify(JSONObject));
		}
	}

	//def debug
	debug(message) {
		this.trigger("debug", message);
	}

	on(event, fn) {
		this.events[event] = fn;
	}

	off(event) {
		this.events[event] = null;
	}

	keepAlive() {
		this.debug("keep alive triggered");
		this.sendPacket({
			op: 1,
			d: Date.now()
		});
	}
	
	//def trigger
	trigger(event) {
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
	login(email = "foo@bar.com", password = "pass1234", callback = function (err, token) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {
			if (self.state === 0 || self.state === 4) {

				self.state = 1; //set the state to logging in
				
				self.email = email;
				self.password = password;

				request
					.post(Endpoints.LOGIN)
					.send({
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
							}).catch(function (err) {
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

	logout(callback = function (err) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			request
				.post(Endpoints.LOGOUT)
				.set("authorization", self.token)
				.end(function (err, res) {

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

	createServer(name, region, callback = function (err, server) { }) {
		var self = this;
		return new Promise(function (resolve, reject) {

			request
				.post(Endpoints.SERVERS)
				.set("authorization", self.token)
				.send({
					name: name,
					region: region
				})
				.end(function (err, res) {
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

	createChannel(server, channelName, channelType, callback = function (err, chann) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			request
				.post(`${Endpoints.SERVERS}/${self.resolveServerID(server) }/channels`)
				.set("authorization", self.token)
				.send({
					name: channelName,
					type: channelType
				})
				.end(function (err, res) {

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

				})

		});

	}

	leaveServer(server, callback = function (err, server) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			request
				.del(`${Endpoints.SERVERS}/${self.resolveServerID(server) }`)
				.set("authorization", self.token)
				.end(function (err, res) {

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

	createInvite(serverOrChannel, options, callback = function (err, invite) { }) {

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

			request
				.post(`${Endpoints.CHANNELS}/${destination}/invites`)
				.set("authorization", self.token)
				.send(options)
				.end(function (err, res) {
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

	startPM(user) {

		var self = this;

		return new Promise(function (resolve, reject) {
			var userId = user;
			if (user instanceof User) {
				userId = user.id;
			}
			request
				.post(`${Endpoints.USERS}/${self.user.id}/channels`)
				.set("authorization", self.token)
				.send({
					recipient_id: userId
				})
				.end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(self.addPMChannel(res.body));
					}
				});
		});

	}

	reply(destination, message, tts, callback = function (err, msg) { }) {

		var self = this;

		return new Promise(function (response, reject) {

			if (typeof tts === "function") {
				// tts is a function, which means the developer wants this to be the callback
				callback = tts;
				tts = false;
			}

			var user = destination.sender;
			self.sendMessage(destination, message, tts, callback, user + ", ").then(response).catch(reject);

		});

	}

	deleteMessage(message, timeout, callback = function (err, msg) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {
			if (timeout) {
				setTimeout(remove, timeout)
			} else {
				remove();
			}

			function remove() {
				request
					.del(`${Endpoints.CHANNELS}/${message.channel.id}/messages/${message.id}`)
					.set("authorization", self.token)
					.end(function (err, res) {
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

	updateMessage(message, content, callback = function (err, msg) { }) {

		var self = this;

		var prom = new Promise(function (resolve, reject) {

			content = (content instanceof Array ? content.join("\n") : content);

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
				self._updateMessage(message, content).then(good).catch(bad);
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

	setUsername(newName, callback = function (err) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {
			request
				.patch(`${Endpoints.API}/users/@me`)
				.set("authorization", self.token)
				.send({
					avatar: self.user.avatar,
					email: self.email,
					new_password: null,
					password: self.password,
					username: newName
				})
				.end(function (err) {
					callback(err);
					if (err)
						reject(err);
					else
						resolve();
				});
		});
	}

	getChannelLogs(channel, amount = 500, callback = function (err, logs) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			var channelID = channel;
			if (channel instanceof Channel) {
				channelID = channel.id;
			}

			request
				.get(`${Endpoints.CHANNELS}/${channelID}/messages?limit=${amount}`)
				.set("authorization", self.token)
				.end(function (err, res) {

					if (err) {
						callback(err);
						reject(err);
					} else {
						var logs = [];

						var channel = self.getChannel("id", channelID);

						for (var message of res.body) {

							var mentions = [];
							for (var mention of message.mentions) {
								mentions.push(self.addUser(mention));
							}

							var author = self.addUser(message.author);

							logs.push(new Message(message, channel, mentions, author));
						}
						callback(null, logs);
						resolve(logs);
					}

				});

		});

	}

	deleteChannel(channel, callback = function (err) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			var channelID = channel;
			if (channel instanceof Channel) {
				channelID = channel.id;
			}

			request
				.del(`${Endpoints.CHANNELS}/${channelID}`)
				.set("authorization", self.token)
				.end(function (err) {
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

	joinServer(invite, callback = function (err, server) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			var id = (invite instanceof Invite ? invite.code : invite);

			request
				.post(`${Endpoints.API}/invite/${id}`)
				.set("authorization", self.token)
				.end(function (err, res) {
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

	sendFile(destination, file, fileName = "image.png", callback = function (err, msg) { }) {

		var self = this;

		var prom = new Promise(function (resolve, reject) {

			var fstream;

			if (typeof file === "string" || file instanceof String) {
				fstream = fs.createReadStream(file);
				fileName = file;
			} else {
				fstream = file;
			}

			self.resolveDestination(destination).then(send).catch(bad);

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
					self._sendFile(destination, fstream, fileName).then(good).catch(bad);
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

	sendMessage(destination, message, tts, callback = function (err, msg) { }, premessage = "") {

		var self = this;

		var prom = new Promise(function (resolve, reject) {

			if (typeof tts === "function") {
				// tts is a function, which means the developer wants this to be the callback
				callback = tts;
				tts = false;
			}

			message = premessage + resolveMessage(message);
			var mentions = resolveMentions();
			self.resolveDestination(destination).then(send).catch(error);

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
					self._sendMessage(destination, message, tts, mentions).then(mgood).catch(mbad);
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
				for (var mention of (message.match(/<@[^>]*>/g) || [])) {
					_mentions.push(mention.substring(2, mention.length - 1));
				}
				return _mentions;
			}

		});

		return prom;
	}
	
	//def createws
	createws(url) {
		if (this.websocket)
			return false;

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
		}
		
		//message
		this.websocket.onmessage = function (e) {

			var dat = false, data = {};

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

					for (var _server of data.guilds) {

						var server = self.addServer(_server);

					}

					for (var _pmc of data.private_channels) {
						var pmc = self.addPMChannel(_pmc);
					}

					self.trigger("ready");
					self.readyTime = Date.now();
					self.debug(`cached ${self.serverCache.length} servers, ${self.channelCache.length} channels, ${self.pmChannelCache.length} PMs and ${self.userCache.length} users.`);
					self.state = 3;
					setInterval(function () {
                        self.keepAlive.apply(self);
                    }, data.heartbeat_interval);

					break;
				case "MESSAGE_CREATE":
					self.debug("received message");

					var mentions = [];
					data.mentions = data.mentions || []; //for some reason this was not defined at some point?
					for (var mention of data.mentions) {
						mentions.push(self.addUser(mention));
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
						for (var mention of info.mentions) {
							mentions.push(self.addUser(mention));
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
					}/*else if(server.channels.length === 0){
						
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
								oldStatus : userInCache.status,
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

		}

	}
	
	//def addUser
	addUser(data) {
		if (!this.getUser("id", data.id)) {
			this.userCache.push(new User(data));
		}
		return this.getUser("id", data.id);
	}
	
	//def addChannel
	addChannel(data, serverId) {
		if (!this.getChannel("id", data.id)) {
			this.channelCache.push(new Channel(data, this.getServer("id", serverId)));
		}
		return this.getChannel("id", data.id);
	}

	addPMChannel(data) {
		if (!this.getPMChannel("id", data.id)) {
			this.pmChannelCache.push(new PMChannel(data, this));
		}
		return this.getPMChannel("id", data.id);
	}

	setTopic(channel, topic, callback = function (err) { }) {

		var self = this;

		return new Promise(function (resolve, reject) {

			self.resolveDestination(channel).then(next).catch(error);

			function error(e) {
				callback(e);
				reject(e);
			}

			function next(destination) {

				var asChan = self.getChannel("id", destination);

				request
					.patch(`${Endpoints.CHANNELS}/${destination}`)
					.set("authorization", self.token)
					.send({
						name: asChan.name,
						position: 0,
						topic: topic
					})
					.end(function (err, res) {
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
	addServer(data) {

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
				for (var channel of data.channels) {
					server.channels.push(this.addChannel(channel, server.id));
				}
			}
		}

		for (var presence of data.presences) {
			self.getUser("id", presence.user.id).status = presence.status;
		}

		return server;
	}
	
	//def getUser
	getUser(key, value) {
		for (var user of this.userCache) {
			if (user[key] === value) {
				return user;
			}
		}
		return null;
	}

	//def getChannel
	getChannel(key, value) {
		for (var channel of this.channelCache) {
			if (channel[key] === value) {
				return channel;
			}
		}
		return this.getPMChannel(key, value); //might be a PM
	}

	getPMChannel(key, value) {
		for (var channel of this.pmChannelCache) {
			if (channel[key] === value) {
				return channel;
			}
		}
		return null;
	}

	//def getServer
	getServer(key, value) {
		for (var server of this.serverCache) {
			if (server[key] === value) {
				return server;
			}
		}
		return null;
	}

	//def trySendConnData
	trySendConnData() {

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

	resolveServerID(resource) {

		if (resource instanceof Server) {
			return resource.id;
		} else if (!isNaN(resource) && resource.length && resource.length === 17) {
			return resource;
		}

	}

	resolveDestination(destination) {
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
				for (var pmc of self.pmChannelCache) {
					if (pmc.user.equals(destination)) {
						resolve(pmc.id);
						return;
					}
				}
					
				//we don't, at this point we're late
				self.startPM(destination).then(function (pmc) {
					resolve(pmc.id);
				}).catch(reject);

			} else {
				channId = destination;
			}
			if (channId)
				resolve(channId);
			else
				reject();
		});
	}

	_sendMessage(destination, content, tts, mentions) {

		var self = this;

		return new Promise(function (resolve, reject) {
			request
				.post(`${Endpoints.CHANNELS}/${destination}/messages`)
				.set("authorization", self.token)
				.send({
					content: content,
					mentions: mentions,
					tts: tts
				})
				.end(function (err, res) {

					if (err) {
						reject(err);
					} else {
						var data = res.body;

						var mentions = [];

						data.mentions = data.mentions || []; //for some reason this was not defined at some point?
							
						for (var mention of data.mentions) {
							mentions.push(self.addUser(mention));
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

	_sendFile(destination, attachment, attachmentName = "DEFAULT BECAUSE YOU DIDN'T SPECIFY WHY.png") {

		var self = this;

		return new Promise(function (resolve, reject) {
			request
				.post(`${Endpoints.CHANNELS}/${destination}/messages`)
				.set("authorization", self.token)
				.attach("file", attachment, attachmentName)
				.end(function (err, res) {

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

	_updateMessage(message, content) {
		var self = this;
		return new Promise(function (resolve, reject) {
			request
				.patch(`${Endpoints.CHANNELS}/${message.channel.id}/messages/${message.id}`)
				.set("authorization", self.token)
				.send({
					content: content,
					mentions: []
				})
				.end(function (err, res) {
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

	getGateway() {
		var self = this;
		return new Promise(function (resolve, reject) {
			request
				.get(`${Endpoints.API}/gateway`)
				.set("authorization", self.token)
				.end(function (err, res) {
					if (err) {
						reject(err);
					} else {
						resolve(res.body.url);
					}
				});
		});
	}

	setStatusIdle() {
		this.setStatus("idle");
	}

	setStatusOnline() {
		this.setStatus("online");
	}

	setStatusActive() {
		this.setStatusOnline();
	}

	setStatusHere() {
		this.setStatusOnline();
	}

	setStatusAway() {
		this.setStatusIdle();
	}

	startTyping(chann, stopTypeTime) {
		var self = this;

		this.resolveDestination(chann).then(next);

		function next(channel) {
			if (self.typingIntervals[channel]) {
				return;
			}

			var fn = function () {
				request
					.post(`${Endpoints.CHANNELS}/${channel}/typing`)
					.set("authorization", self.token)
					.end();
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

	stopTyping(chann) {
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

	setStatus(stat) {

		var idleTime = (stat === "online" ? null : Date.now());

		this.__idleTime = idleTime;

		this.websocket.send(JSON.stringify({
			op: 3,
			d: {
				idle_since: this.__idleTime,
				game_id: this.__gameId
			}
		}));
	}

	setPlayingGame(id) {

		if (id instanceof String || typeof id === `string`) {
			
			// working on names
			var gid = id.trim().toUpperCase();

			id = null;

			for (var game of gameMap) {

				if (game.name.trim().toUpperCase() === gid) {

					id = game.id;
					break;

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

	playGame(id) {
		this.setPlayingGame(id);
	}

	playingGame(id) {

		this.setPlayingGame(id);

	}
}

module.exports = Client;