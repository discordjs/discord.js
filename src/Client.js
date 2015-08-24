//discord.js modules
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
	
	get uptime(){
		
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
	login(email = "foo@bar.com", password = "pass1234", callback = function () { }) {

		var self = this;

		this.createws();

		if (this.state === 0 || this.state === 4) {

			this.state = 1; //set the state to logging in
			
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

						for (var channel of _server.channels) {
							server.channels.push(self.addChannel(channel, server.id));
						}

					}
					self.trigger("ready");
					self.readyTime = Date.now();
					self.debug(`cached ${self.serverCache.length} servers, ${self.channelCache.length} channels and ${self.userCache.length} users.`);

					setInterval(function () {
                        self.keepAlive.apply(self);
                    }, data.heartbeat_interval);

					break;
				case "MESSAGE_CREATE":
					self.debug("received message");

					var mentions = [];
					for (var mention of data.mentions) {
						mentions.push(self.addUser(mention));
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
					
					if(server){
						self.serverCache.splice(self.serverCache.indexOf(server), 1);
						self.trigger("serverDelete", server);
					}
				
					break;
					
				case "CHANNEL_DELETE":
					
					var channel = self.getChannel("id", data.id);
					
					if(channel){
						
						var server = channel.server;
						
						if(server){
							
							server.channels.splice( server.channels.indexOf(channel), 1 );
							
						}
						
						self.trigger("channelDelete", channel);
						
						self.serverCache.splice( self.serverCache.indexOf(channel), 1 );
						
					}
					
					break;

				case "GUILD_CREATE":
				
					var server = self.getServer("id", data.id);
					
					if(!server){
						//if server doesn't already exist because duh
						
						var serv = self.addServer(data);
						
						for (var channel of data.channels) {
							serv.channels.push(self.addChannel(channel, serv.id));
						}
						
					}
					
					self.trigger("serverCreate", server);
				
					break;
					
				case "CHANNEL_CREATE":
				
					var channel = self.getChannel("id", data.id);
					
					if(!channel){
						
						var chann = self.addChannel( data, data.guild_id );
						var srv = self.getServer( "id", data.guild_id );
						if(srv){
							srv.channels.push( chann );
						}
						self.trigger("channelCreate", chann);
						
					}
				
					break;
					
				case "GUILD_MEMBER_ADD":
				
					var server = self.getServer("id", data.guild_id);
					
					if(server){
						
						var user = self.addUser(data.user); //if for whatever reason it doesn't exist..
						
						if( !~server.members.indexOf(user) ){
							server.members.push(user);
						}
						
						self.trigger("serverNewMember", user);
					}
				
					break;
					
				case "GUILD_MEMBER_REMOVE":
				
					var server = self.getServer("id", data.guild_id);
					
					if(server){
						
						var user = self.addUser(data.user); //if for whatever reason it doesn't exist..
						
						if( ~server.members.indexOf(user) ){
							server.members.splice( server.members.indexOf(user), 1 );
						}
						
						self.trigger("serverRemoveMember", user);
					}
				
					break;

				case "USER_UPDATE":
				
					if(self.user && data.id === self.user.id){
						
						var newUser = new User(data); //not actually adding to the cache
						
						self.trigger("userUpdate", newUser, self.user);
						
						if( ~self.userCache.indexOf(self.user) ){
							self.userCache[self.userCache.indexOf(self.user)] = newUser;
						}
						
						self.user = newUser;
						
					}
				
					break;
					
				case "PRESENCE_UPDATE":
				
					var userInCache = self.getUser("id", data.user.id);
					
					if(userInCache){
						//user exists
						var presenceUser = new User(data.user);
						if(presenceUser.equalsStrict(userInCache)){
							//they're exactly the same, an actual presence update
							self.trigger("presence", {
								user : userInCache,
								status : data.status,
								server : self.getServer("id", data.guild_id),
								gameId : data.game_id
							});
						}else{
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
	
	//def addServer
	addServer(data) {
		if (!this.getServer("id", data.id)) {
			this.serverCache.push(new Server(data, this));
		}
		return this.getServer("id", data.id);
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

}

module.exports = Client;