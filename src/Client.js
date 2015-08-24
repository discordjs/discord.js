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

			var dat = false, data = false;

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
					}else{
						//don't have the cache of that message ;(
						self.trigger("messageDelete", channel);
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
	getServer(key = "id", value = "abc123") {
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