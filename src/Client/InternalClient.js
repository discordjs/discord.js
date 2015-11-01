"use strict";

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

class InternalClient {
	constructor(discordClient) {
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
	createServer(name, region="london") {
		var self = this;
		return new Promise((resolve, reject) => {
			name = self.resolver.resolveString(name);
			
			request
				.post(Endpoints.SERVERS)
				.set("authorization", self.token)
				.send({name, region})
				.end((err, res)=>{
					if(err){
						reject(new Error(err.response.text));
					}else{
						// valid server, wait until it is cached
						var inter = setInterval(() => {
							if(self.servers.get("id", res.body.id)){
								clearInterval(inter);
								resolve(self.servers.get("id", res.body.id));
							}
						}, 20);
					}
				});
		});
	}
	
	//def leaveServer
	leaveServer(srv) {
		var self = this;
		return new Promise((resolve, reject) => {
			var server = self.resolver.resolveServer(srv);
			if(server){
				
				request
					.del(Endpoints.SERVER(server.id))
					.set("authorization", self.token)
					.end((err, res) => {
						if(err){
							reject(new Error(err.response.text));
						}else{
							// remove channels of server then the server
							for(var chan of server.channels){
								server.channels.remove(chan);
							}
							// remove server
							self.servers.remove(server);
							resolve();
						}
					});
				
			}else{
				reject(new Error("server did not resolve"));
			}
		});
	}
	
	// def login
	login(email, password) {
		var self = this;
		var client = self.client;
		return new Promise((resolve, reject) => {
			if (self.state === ConnectionState.DISCONNECTED || self.state === ConnectionState.IDLE) {

				self.state = ConnectionState.LOGGING_IN;

				request
					.post(Endpoints.LOGIN)
					.send({ email, password })
					.end(function (err, res) {

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

							self.getGateway().then((url) => {

								self.createWS(url);
								resolve(token);

							}).catch((e) => {
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
	}

	// def logout
	logout() {
		var self = this;
		return new Promise((resolve, reject) => {

			if (self.state === ConnectionState.DISCONNECTED || self.state === ConnectionState.IDLE) {
				reject(new Error("Client is not logged in!"));
				return;
			}

			request
				.post(Endpoints.LOGOUT)
				.set("authorization", self.token)
				.end((err, res) => {
					if (err) {
						reject(new Error(err.response.text));
					} else {
						if (this.websocket) {
							this.websocket.close();
							this.websocket = null;
						}
						self.token = null;
						self.email = null;
						self.password = null;
						self.state = ConnectionState.DISCONNECTED;
						resolve();
					}
				});

		});
	}
	
	// def startPM
	startPM(resUser) {
		var self = this;
		return new Promise((resolve, reject) => {
			var user = self.resolver.resolveUser(resUser);

			if (user) {
				
				// start the PM
				request
					.post(`${Endpoints.USER_CHANNELS(user.id) }`)
					.set("authorization", self.token)
					.send({
						recipient_id: user.id
					})
					.end((err, res) => {
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
	}

	// def getGateway
	getGateway() {
		var self = this;
		return new Promise((resolve, reject) => {

			request
				.get(Endpoints.GATEWAY)
				.set("authorization", self.token)
				.end(function (err, res) {
					if (err)
						reject(err);
					else
						resolve(res.body.url);
				});

		});
	}
	
	// def sendMessage
	sendMessage(where, _content, options = {}) {
		var self = this;
		return new Promise((resolve, reject) => {

			self.resolver.resolveChannel(where)
				.then(next)
				.catch(e => reject(new Error("Error resolving destination - " + e)));

			function next(destination) {
				//var destination;
				var content = self.resolver.resolveString(_content);
				var mentions = self.resolver.resolveMentions(content);

				request
					.post(Endpoints.CHANNEL_MESSAGES(destination.id))
					.set("authorization", self.token)
					.send({
						content: content,
						mentions: mentions,
						tts: options.tts
					})
					.end((err, res) => {
						if (err) {
							reject(new Error(err.response.text));
						} else {

							resolve(
								destination.messages.add(
									new Message(res.body, destination, self.client)
									)
								);

						}
					});

			}

		});
	}
	// def deleteMessage
	deleteMessage(_message, options = {}) {
		var self = this;
		return new Promise((resolve, reject) => {

			var message = self.resolver.resolveMessage(_message);

			if (message) {

				if (options.wait) {
					setTimeout(deleteMsg, options.wait);
				} else {
					deleteMsg();
				}

				function deleteMsg() {
					request
						.del(Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id))
						.set("authorization", self.token)
						.end((err, res) => {
							if (err) {
								reject(new Error(err.response.text));
							} else {
								message.channel.messages.remove(message);
								resolve();
							}
						});
				}

			} else {
				reject(new Error("Supplied message did not resolve to a message!"));
			}

		});
	}
	
	// def updateMessage
	updateMessage(msg, _content, options = {}) {

		var self = this;
		return new Promise((resolve, reject) => {

			var message = self.resolver.resolveMessage(msg);

			if (message) {

				var content = self.resolver.resolveString(_content);
				var mentions = self.resolver.resolveMentions(content);

				request
					.patch(Endpoints.CHANNEL_MESSAGE(message.channel.id, message.id))
					.set("authorization", self.token)
					.send({
						content: content,
						tts: options.tts,
						mentions: mentions
					})
					.end((err, res) => {
						if (err) {
							reject(new Error(err.response.text));
						} else {
							resolve(
								message.channel.messages.update
									(message, new Message(res.body, message.channel, self.client)
									));
						}
					})

			} else {
				reject(new Error("Supplied message did not resolve to a message!"));
			}

		});

	}
	
	// def sendFile
	sendFile(where, _file, name="image.png"){
		var self = this;
		return new Promise((resolve, reject) => {
			self.resolver.resolveChannel(where)
				.then(next)
				.catch(e => reject(new Error("couldn't resolve to channel - " + e)));

			function next(channel) {
				
				var file = self.resolver.resolveFile(_file);
				
				request
					.post(Endpoints.CHANNEL_MESSAGES(channel.id))
					.set("authorization", self.token)
					.attach("file", file, name)
					.end((err, res) => {
						
						if(err){
							reject(new Error(err.response.text));
						}else{
							resolve(channel.messages.add(new Message(res.body, channel, self.client)));
						}
						
					});
				
			}
		});
	}

	// def getChannelLogs
	getChannelLogs(_channel, limit = 500, options = {}) {
		var self = this;
		return new Promise((resolve, reject) => {

			self.resolver.resolveChannel(_channel)
				.then(next)
				.catch(e => reject(new Error("couldn't resolve to channel - " + e)));

			function next(channel) {

				if (options.before)
					options.before = self.resolver.resolveMessage(options.before);
				if (options.after)
					options.after = self.resolver.resolveMessage(options.after);

				var params = [];
				if (options.before)
					params.push("before=" + options.before.id);
				if (options.after)
					params.push("after=" + options.after.id);

				var joinedParams = params.join();
				if (joinedParams !== "")
					joinedParams = "&" + params.join();
					
				request
					.get(`${Endpoints.CHANNEL_MESSAGES(channel.id)}?limit=${limit}${joinedParams}`)
					.set("authorization", self.token)
					.end((err, res) => {
						if(err){
							reject(new Error(err.response.text));
						}else{
							var logs = [];
							res.body.forEach((msg) => {
								logs.push( channel.messages.add(new Message(msg, channel, self.client)) );
							});
							resolve(logs);
						}
					});

			}

		});
	}

	sendWS(object) {
		this.websocket.send(JSON.stringify(object));
	}

	createWS(url) {
		var self = this;
		var client = self.client;

		if (this.websocket)
			return false;

		this.websocket = new WebSocket(url);

		this.websocket.onopen = () => {

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
		}

		this.websocket.onclose = () => {
			self.websocket = null;
			self.state = ConnectionState.DISCONNECTED;
			client.emit("disconnected");
		}

		this.websocket.onmessage = (e) => {

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
					data.guilds.forEach((server) => {
						self.servers.add(new Server(server, client));
					});
					data.private_channels.forEach((pm) => {
						self.private_channels.add(new PMChannel(pm, client));
					});
					self.state = ConnectionState.READY;

					setInterval(() => self.sendWS({ op: 1, d: Date.now() }), data.heartbeat_interval);

					client.emit("ready");
					client.emit("debug", `ready packet took ${Date.now() - startTime}ms to process`);
					client.emit("debug", `ready with ${self.servers.length} servers, ${self.channels.length} channels and ${self.users.length} users cached.`);
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
						if(msg){
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
						
						
						if(msg){
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
					if(!server){
						self.servers.add(new Server(data, client));
					}
					break;
			}
		}
	}
}

module.exports = InternalClient;