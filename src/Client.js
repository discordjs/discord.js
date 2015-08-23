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


	//def debug
	debug(message) {
		console.log(message);
	}
	
	//def trigger
	trigger(event) {

	}
	
	//def login
	login(email = "foo@bar.com", password = "pass1234s", callback = function () { }) {

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
	addChannel(data) {
		if (!this.channelCache.has(data.id)){
			this.channelCache.set(data.id, new Channel(data, SERVER));	
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
		for (var userRow of this.userCache) {
			var user = userRow[1];
			if (user[key] === value) {
				return user;
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