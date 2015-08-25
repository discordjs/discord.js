//discord.js modules
var Endpoints = require("./Endpoints.js");
var User = require("./User.js");
var Server = require("./Server.js");
var Channel = require("./Channel.js");
var Message = require("./Message.js");
var Invite = require("./Invite.js");
var PMChannel = require("./PMChannel.js");

//node modules
var request = require("superagent");
var WebSocket = require("ws");

var defaultOptions = {
	cache_tokens: false
}

class Client {

	constructor(options = defaultOptions, token = undefined) {
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
		this.serverCreateListener = new Map();
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
		console.log(message);
	}

	on(event, fn) {
		this.events.set(event, fn);
	}

	off(event, fn) {
		this.events.delete(event);
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
		var evt = this.events.get(event);
		if (evt) {
			evt.apply(this, args.slice(1));
		}
	}
	
	//def login
	login(email = "foo@bar.com", password = "pass1234", callback = function (err, token) { }) {

		var self = this;

		this.createws();
		return new Promise(function (resolve, reject) {
			if (self.state === 0 || self.state === 4) {

				self.state = 1; //set the state to logging in
			
				request
					.post(Endpoints.LOGIN)
					.send({
						email: email,
						password: password
					}).end(function (err, res) {

						if (err) {
							self.state = 4; //set state to disconnected
							self.trigger("disconnected");
							self.websocket.close();
							callback(err);
							reject(err);
						} else {
							self.state = 2; //set state to logged in (not yet ready)
							self.token = res.body.token; //set our token
							self.trySendConnData();
							callback(null, self.token);
							resolve(self.token);
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
						callback(null);
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
						self.serverCreateListener.set(res.body.id, [resolve, callback]);
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
						var srv = self.getServer("id", self.resolveServerID(server));
						callback(null, srv);
						resolve(srv);
						self.serverCache.splice(self.serverCache.indexOf(srv), 1);
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
	
	reply(destination, message, callback = function(err, msg){}){
		
		var self = this;
		
		return new Promise(function(response, reject){
			
			var user = destination.sender;
			self.sendMessage(destination, message, callback, user + ", ").then(response).catch(reject);
			
		});
		
	}

	sendMessage(destination, message, callback = function (err, msg) { }, premessage = "") {

		var self = this;

		return new Promise(function (resolve, reject) {

			message = premessage + resolveMessage(message);
			var mentions = resolveMentions();
			destination = resolveDestination(destination);

			if (destination)
				send();

			function send() {

				request
					.post(`${Endpoints.CHANNELS}/${destination}/messages`)
					.set("authorization", self.token)
					.send({
						content: message,
						mentions: mentions
					})
					.end(function (err, res) {

						if (err) {
							callback(err);
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
								callback(null, msg);
								resolve(msg);
							}
						}

					});

			}

			function resolveDestination() {
				var channId = false;

				if (destination instanceof Server) {
					channId = destination.id; //general is the same as server id
				} else if (destination instanceof Channel) {
					channId = destination.id;
				} else if (destination instanceof Message) {
					channId = destination.channel.id;
				} else if (destination instanceof User) {
					
					//check if we have a PM
					for (var pmc of self.pmChannelCache) {
						if (pmc.user.equals(destination)) {
							return pmc.id;
						}
					}
					
					//we don't, at this point we're late
					self.startPM(destination).then(function (pmc) {
						destination = pmc.id;
						send();
					});

				} else {
					channId = destination;
				}

				return channId;
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
	}
	
	//def createws
	createws() {
		if (this.websocket)
			return false;

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

					if (self.serverCreateListener.get(data.id)) {
						var cbs = self.serverCreateListener.get(data.id);
						cbs[0](server); //promise then callback
						cbs[1](null, server); //legacy callback
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
						
						if (!~server.members.indexOf(user)) {
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

				case "PRESENCE_UPDATE":

					var userInCache = self.getUser("id", data.user.id);

					if (userInCache) {
						//user exists
						var presenceUser = new User(data.user);
						if (presenceUser.equalsStrict(userInCache)) {
							//they're exactly the same, an actual presence update
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
	
	//def addServer
	addServer(data) {

		var server = this.getServer("id", data.id);

		if (!server) {
			server = new Server(data, this);
			if (data.channels) {
				for (var channel of data.channels) {
					server.channels.push(this.addChannel(channel, server.id));
				}
			}
			this.serverCache.push(server);
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

	resolveServerID(resource) {

		if (resource instanceof Server) {
			return resource.id;
		} else if (!isNaN(resource) && resource.length && resource.length === 17) {
			return resource;
		}

	}

}

module.exports = Client;