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
	Message = require("../Structures/Message.js"),
	Role = require("../Structures/Role.js"),
	Invite = require("../Structures/Invite.js"),
	VoiceConnection = require("../Voice/VoiceConnection.js");

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
		this.voiceConnection = null;
		this.resolver = new Resolver(this);
	}
	
	//def leaveVoiceChannel
	leaveVoiceChannel(){
		var self = this;
		return new Promise((resolve, reject) => {
			if(self.voiceConnection){
				self.voiceConnection.destroy();
				self.voiceConnection = null;
				resolve();
			}else{
				resolve();
			}
		});
	}
	
	//def joinVoiceChannel
	joinVoiceChannel(chann){
		var self = this;
		return new Promise((resolve, reject) => {
			
			var channel = self.resolver.resolveVoiceChannel(chann);
			
			if(channel){
					
					self.leaveVoiceChannel().then(next);
					
					function next(){
						var session, token, server = channel.server, endpoint, fired = 0;
						
						var check = (m) => {
							var data = JSON.parse(m);
							
							if(data.t === "VOICE_STATE_UPDATE"){
								session = data.d.session_id;
								fired++;
							}else if(data.t === "VOICE_SERVER_UPDATE"){
								token = data.d.token;
								endpoint = data.d.endpoint;
								fired++;
								var chan = self.voiceConnection = new VoiceConnection(channel, self.client, session, token, server, endpoint);
								
								chan.on("ready", resolve);
								chan.on("error", reject);
								
							}
							if(fired >= 2){
								self.client.emit("debug", "removed temporary voice websocket listeners");
								self.websocket.removeListener('message', check);
							}
							
						};
						
						self.websocket.on("message", check);
						self.sendWS({
							op : 4,
							d : {
								"guild_id" : server.id,
								"channel_id" : channel.id,
								"self_mute" : false,
								"self_deaf" : false
							}
						});
					}
			}else{
				reject(new Error("voice channel does not exist"));
			}
			
		});
	}
	
	// def createServer
	createServer(name, region = "london") {
		var self = this;
		return new Promise((resolve, reject) => {
			name = self.resolver.resolveString(name);

			request
				.post(Endpoints.SERVERS)
				.set("authorization", self.token)
				.send({ name, region })
				.end((err, res) => {
					if (err) {
						reject(new Error(err.response.text));
					} else {
						// valid server, wait until it is cached
						var inter = setInterval(() => {
							if (self.servers.get("id", res.body.id)) {
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
			if (server) {

				request
					.del(Endpoints.SERVER(server.id))
					.set("authorization", self.token)
					.end((err, res) => {
						if (err) {
							reject(new Error(err.response.text));
						} else {
							// remove channels of server then the server
							for (var chan of server.channels) {
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
	sendFile(where, _file, name = "image.png") {
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

						if (err) {
							reject(new Error(err.response.text));
						} else {
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
					.get(`${Endpoints.CHANNEL_MESSAGES(channel.id) }?limit=${limit}${joinedParams}`)
					.set("authorization", self.token)
					.end((err, res) => {
						if (err) {
							reject(new Error(err.response.text));
						} else {
							var logs = [];
							res.body.forEach((msg) => {
								logs.push(channel.messages.add(new Message(msg, channel, self.client)));
							});
							resolve(logs);
						}
					});

			}

		});
	}
	
	// def createChannel
	createChannel(server, name, type = "text") {
		var self = this;

		return new Promise((resolve, reject) => {

			server = self.resolver.resolveServer(server);

			request
				.post(Endpoints.SERVER_CHANNELS(server.id))
				.set("authorization", self.token)
				.send({
					name, type
				})
				.end((err, res) => {
					if (err) {
						reject(err);
					} else {
						var channel;
						if (res.body.type === "text") {
							channel = new TextChannel(res.body, self.client, server);
						} else {
							channel = new VoiceChannel(res.body, self.client, server);
						}
						resolve(server.channels.add(self.channels.add(channel)));
					}
				})

		});
	}
	
	// def deleteChannel
	deleteChannel(_channel){
		var self = this;
		return new Promise((resolve, reject) => {
			
			self.resolver.resolveChannel(_channel).then(next).catch(reject);
			
			function next(channel){
				request
					.del(Endpoints.CHANNEL(channel.id))
					.set("authorization", self.token)
					.end(function(err, res){
						if(err){
							reject(err);
						}else{
							channel.server.channels.remove(channel);
							self.channels.remove(channel);
							resolve();
						}
					});
			}
		});
	}
	
	// def banMember
	banMember(user, server, length=1){
		var self = this;
		return new Promise((resolve, reject) => {
			
			user = self.resolver.resolveUser(user);
			server = self.resolver.resolveServer(server);
			
			request
				.put(`${Endpoints.SERVER_BANS(server.id)}/${user.id}/?delete-message-days=${length}`)
				.set("authorization", self.token)
				.end((err, res) => {
					if(err){
						reject(err);
					}else{
						resolve();
					}
				});
		});
	}
	
	// def createRole
	createRole(server, data){
		var self = this;
		return new Promise((resolve, reject) => {
			
			server = self.resolver.resolveServer(server);
			
			request
				.post(Endpoints.SERVER_ROLES(server.id))
				.set("authorization", self.token)
				.end( (err, res) => {
					if(err){
						reject(err);
					}else{
						
						var role = server.roles.add(new Role(res.body, server, self.client));
						
						if(data){
							
							self.updateRole(role, data)
								.then(resolve)
								.catch(reject);
							
						}else{
							resolve(role);
						}
						
					}
				});
			
		});
	}
	// def updateRole
	updateRole(role, data){
		var self = this;
		data = data || {};
		data.permissions = data.permissions || [];
		return new Promise((resolve, reject) => {
			
			var server = self.resolver.resolveServer(role.server);
			
			var permissions = 0;
			for(var perm of data.permissions){
				if(perm instanceof String || typeof perm === "string"){
					permissions |= (Constants.Permissions[perm] || 0);
				}else{
					permissions |= perm;
				}
			}
			
			data.color = data.color || 0;
			
			request
				.patch(Endpoints.SERVER_ROLES(server.id)+"/"+role.id)
				.set("authorization", self.token)
				.send({
					color : data.color || role.color,
					hoist : data.hoist || role.hoist,
					name : data.name || role.name,
					permissions : permissions
				})
				.end((err, res) => {
					if(err){
						reject(err);
					}else{
						var nrole = new Role(res.body, server, self.client);
						resolve(
							server.roles.update(role, nrole)
						);
					}
				});
			
		});
	}
	// def deleteRole
	deleteRole(role){
		var self = this;
		return new Promise((resolve, reject) => {
			
			request
				.del(Endpoints.SERVER_ROLES(role.server.id)+"/"+role.id)
				.set("authorization", self.token)
				.end((err, res) => {
					if(err){
						reject(err);
					}else{
						resolve();
						// the ws cache will handle it
						// role.server.roles.remove(role);
					}
				});
			
		});
	}
	
	//def addMemberToRole
	addMemberToRole(member, role){
		var self = this;
		return new Promise((resolve, reject) => {
			
			member = self.resolver.resolveUser(member);
			
			if(!member || !role){
				reject(new Error("member/role not in server"));
				return;
			}
			
			if(role.server.memberMap[member.id]){
				
				var roleIDS = role.server.memberMap[member.id].roles.map(r => r.id).concat(role.id);
				
				request
					.patch(Endpoints.SERVER_MEMBERS(role.server.id)+"/"+member.id)
					.set("authorization", self.token)
					.send({
						roles : roleIDS
					})
					.end((err) => {
						if(err){
							reject(err);
						}else{
							resolve();
						}
					});
				
			}else{
				reject(new Error("member not in server"));
			}
			
		});
	}
	
	//def removeMemberFromRole
	removeMemberFromRole(member, role){
		var self = this;
		return new Promise((resolve, reject) => {
			
			member = self.resolver.resolveUser(member);
			
			if(!member || !role){
				reject(new Error("member/role not in server"));
				return;
			}
			
			if(role.server.memberMap[member.id]){
				
				var roleIDS = role.server.memberMap[member.id].roles.map(r => r.id);
				
				for(var item in roleIDS){
					if(roleIDS[item] === role.id){
						roleIDS.splice(item, 1);
					}
				}
				
				request
					.patch(Endpoints.SERVER_MEMBERS(role.server.id)+"/"+member.id)
					.set("authorization", self.token)
					.send({
						roles : roleIDS
					})
					.end((err) => {
						if(err){
							reject(err);
						}else{
							resolve();
						}
					});
				
			}else{
				reject(new Error("member not in server"));
			}
			
		});
	}
	
	// def createInvite
	createInvite(chanServ, options){
		var self = this;
		return new Promise((resolve, reject) => {
			
			if(chanServ instanceof Channel){
				// do something
			}else if(chanServ instanceof Server){
				// do something
			}else{
				chanServ = self.resolver.resolveServer(chanServ) || self.resolver.resolveChannel(chanServ);
			}
			
			if(!chanServ){
				reject(new Error("couldn't resolve where"));
				return;
			}
			
			if(!options){
				options = {validate:null};
			}else{
				options.max_age = options.maxAge || 0;
				options.max_uses = options.maxUses || 0;
				options.temporary = options.temporary || false;
				options.xkcdpass = options.xkcd || false;
			}
			
			var epoint;
			if(chanServ instanceof Channel){
				epoint = Endpoints.CHANNEL_INVITES(chanServ.id);
			}else{
				epoint = Endpoints.SERVER_INVITES(chanServ.id);
			}
			
			request
				.post(epoint)
				.set("authorization", self.token)
				.send(options)
				.end((err, res) => {
					if(err){
						reject(err);
					}else{
						resolve(new Invite(res.body, self.channels.get("id", res.body.channel.id), self.client));
					}
				});
			
		});
	}
	
	//def overwritePermissions
	overwritePermissions(channel, role, updated){
		var self = this;
		return new Promise((resolve, reject) => {
			channel = self.resolver.resolveChannel(channel).catch(reject).then(next);
			function next(channel){
				
				var user;
				if(role instanceof User){
					user = role;
				}
				
				var data = {};
				data.allow = 0;
				data.deny = 0;
				
				updated.allow = updated.allow || [];
				updated.deny = updated.deny || [];
				
				if(role instanceof Role){
					data.id = role.id;
					data.type = "role";
				}else if(user){
					data.id = user.id;
					data.type = "member";
				}else{
					reject(new Error("role incorrect"));
					return;
				}
				
				for(var perm in updated){
					if(updated[perm]){
						if(perm instanceof String || typeof perm === "string"){
							data.allow |= (Constants.Permissions[perm] || 0);
						}else{
							data.allow |= perm;
						}
					}else{
						if(perm instanceof String || typeof perm === "string"){
							data.deny |= (Constants.Permissions[perm] || 0);
						}else{
							data.deny |= perm;
						}
					}
				}
				
				request
					.put(Endpoints.CHANNEL_PERMISSIONS(channel.id)+"/"+data.id)
					.set("authorization", self.token)
					.send(data)
					.end(function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				}
		});
	}
	
	//def setTopic
	setTopic(chann, topic=""){
		var self = this;
		return new Promise((resolve, reject) => {
			
			self.resolver.resolveChannel(chann).then(next).catch(reject);
			
			function next(channel){
				
				request
					.patch(Endpoints.CHANNEL(channel.id))
					.set("authorization", self.token)
					.send({
						name : channel.name,
						position : 0,
						topic : topic
					})
					.end((err, res) => {
						if(err){
							reject(err);
						}else{
							channel.topic = res.body.topic;
							resolve();
						}
					})
				
			}
			
		});
	}
	//def setChannelName
	setChannelName(chann, name="discordjs_is_the_best"){
		var self = this;
		return new Promise((resolve, reject) => {
			
			self.resolver.resolveChannel(chann).then(next).catch(reject);
			
			function next(channel){
				
				request
					.patch(Endpoints.CHANNEL(channel.id))
					.set("authorization", self.token)
					.send({
						name : name,
						position : 0,
						topic : channel.topic
					})
					.end((err, res) => {
						if(err){
							reject(err);
						}else{
							channel.name = res.body.name;
							resolve();
						}
					})
				
			}
			
		});
	}
	//def setChannelNameAndTopic
	setChannelNameAndTopic(chann, name="discordjs_is_the_best", topic=""){
		var self = this;
		return new Promise((resolve, reject) => {
			
			self.resolver.resolveChannel(chann).then(next).catch(reject);
			
			function next(channel){
				
				request
					.patch(Endpoints.CHANNEL(channel.id))
					.set("authorization", self.token)
					.send({
						name : name,
						position : 0,
						topic : topic
					})
					.end((err, res) => {
						if(err){
							reject(err);
						}else{
							channel.name = res.body.name;
							channel.topic = res.body.topic;
							resolve();
						}
					})
				
			}
			
		});
	}
	
	//def updateChannel
	updateChannel(chann, data){
		return this.setChannelNameAndTopic(chann, data.name, data.topic);
	}

	sendWS(object) {
		if (this.websocket)
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
					self.user = self.users.add(new User(data.user, client));
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

						for (var channel of server.channels) {
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
							client.emit("channelUpdated", self.private_channels.update(
								channel,
								new PMChannel(data, client)
								));
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
				case PacketType.SERVER_ROLE_CREATE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						client.emit("serverRoleCreated", server.roles.add(new Role(data.role, server, client)), server);
					} else {
						client.emit("warn", "server role made but server not in cache");
					}
					break;
				case PacketType.SERVER_ROLE_DELETE:
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
				case PacketType.SERVER_ROLE_UPDATE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						var role = server.roles.get("id", data.role.id);
						if (role) {
							var newRole = new Role(data.role, server, client);
							server.roles.update(role, newRole)
							client.emit("serverRoleUpdated", role, newRole);
						} else {
							client.emit("warn", "server role updated but role not in cache");
						}
					} else {
						client.emit("warn", "server role updated but server not in cache");
					}
					break;
				case PacketType.SERVER_MEMBER_ADD:
					var server = self.servers.get("id", data.guild_id);
					if (server) {

						server.memberMap[data.user.id] = {
							roles: data.roles.map((pid) => server.roles.get("id", pid)),
							mute: false,
							deaf: false,
							joinedAt: Date.parse(data.joined_at)
						};

						client.emit(
							"serverNewMember",
							server,
							server.members.add(self.users.add(new User(data.user, client)))
							);

					} else {
						client.emit("warn", "server member added but server doesn't exist in cache");
					}
					break;
				case PacketType.SERVER_MEMBER_REMOVE:
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
				case PacketType.SERVER_MEMBER_UPDATE:
					var server = self.servers.get("id", data.guild_id);
					if (server) {
						var user = self.users.get("id", data.user.id);
						if (user) {
							server.memberMap[data.user.id].roles = data.roles.map((pid) => server.roles.get("id", pid));
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
				case PacketType.PRESENCE_UPDATE:

					var user = self.users.get("id", data.user.id);

					if (user) {

						data.user.username = data.user.username || user.username;
						data.user.id = data.user.id || user.id;
						data.user.avatar = data.user.avatar || user.avatar;
						data.user.discriminator = data.user.discriminator || user.discriminator;

						var presenceUser = new User(data.user, client);

						if (presenceUser.equalsStrict(user)) {
							// a real presence update
							client.emit("presence", user, data.status, data.game_id);
							user.status = data.status;
							user.gameID = data.game_id;

						} else {
							// a name change or avatar change
							client.emit("userUpdate", user, presenceUser);
							self.users.update(user, presenceUser);
						}

					} else {
						client.emit("warn", "presence update but user not in cache");
					}

					break;
				case PacketType.TYPING:

					var user = self.users.get("id", data.user_id);
					var channel = self.channels.get("id", data.channel_id);

					if (user && channel) {
						if (user.typing.since) {
							user.typing.since = Date.now();
							user.typing.channel = channel;
						} else {
							user.typing.since = Date.now();
							user.typing.channel = channel;
							client.emit("userTypingStart", user, channel);
						}
						setTimeout(() => {
							if (Date.now() - user.typing.since > 5500) {
								// they haven't typed since
								user.typing.since = null;
								user.typing.channel = null;
								client.emit("userTypingStop", user, channel);
							}
						}, 6000);

					} else {
						client.emit("warn", "user typing but user or channel not existant in cache");
					}
					break;
				case PacketType.SERVER_BAN_ADD:
					var user = self.users.get("id", data.user.id);
					var server = self.servers.get("id", data.guild_id);

					if (user && server) {
						client.emit("userBanned", user, server);
					} else {
						client.emit("warn", "user banned but user/server not in cache.");
					}
					break;
				case PacketType.SERVER_BAN_REMOVE:
					var user = self.users.get("id", data.user.id);
					var server = self.servers.get("id", data.guild_id);

					if (user && server) {
						client.emit("userUnbanned", user, server);
					} else {
						client.emit("warn", "user unbanned but user/server not in cache.");
					}
					break;
			}
		}
	}
}

module.exports = InternalClient;