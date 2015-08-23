//discord.js modules
var Endpoints = require("./Endpoints.js");
var User = require("./User.js");
var Server = require("./Server.js");
var Channel = require("./Channel.js");

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

		this.userCache = new Map();
		this.channelCache = new Map();
		this.serverCache = new Map();
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


	//def debug
	debug(message) {
		console.log(message);
	}
	
	on(event, fn){
		this.events.set(event, fn);
	}
	
	off(event, fn){
		this.events.delete(event);
	}
	
	//def trigger
	trigger(event) {
		var args = [];
		for(var arg in arguments){
			args.push(arguments[arg]);
		}
		var evt = this.events.get(event);
		if(evt){
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
					
					self.user = self.addUser( data.user );
					
					for(var _server of data.guilds){
						
						self.addServer(_server);
						
					}
					self.trigger("ready");
					self.debug(`cached ${self.serverCache.size} servers, ${self.channelCache.size} channels and ${self.userCache.size} users.`);

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
		if (!this.userCache.has(data.id)){
			this.userCache.set(data.id, new User(data));
		}
		return this.userCache.get(data.id);
	}
	
	//def addChannel
	addChannel(data, serverId) {
		if (!this.channelCache.has(data.id)){
			this.channelCache.set(data.id, new Channel(data, this.getServer("id", serverId)));	
		}
		return this.channelCache.get(data.id);
	}
	
	//def addServer
	addServer(data){
		if(!this.serverCache.has(data.id)){
			this.serverCache.set(data.id, new Server(data, this));
		}
		return this.serverCache.get(data.id);
	}
	
	//def getUser
	getUser(key, value){
		for (var row of this.userCache) {
			var obj = row[1];
			if (obj[key] === value) {
				return obj;
			}
		}
		return null;
	}

	//def getChannel
	getChannel(key, value){
		for (var row of this.channelCache) {
			var obj = row[1];
			if (obj[key] === value) {
				return obj;
			}
		}
		return null;
	}

	//def getServer
	getServer(key, value){
		for (var row of this.serverCache) {
			var obj = row[1];
			if (obj[key] === value) {
				return obj;
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