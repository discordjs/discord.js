//discord.js modules
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Endpoints = require("./Endpoints.js");
var User = require("./User.js");

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

		this.userCache = new Map();
		this.channelCache = new Map();
		this.serverCache = new Map();
	}

	_createClass(Client, [{
		key: "debug",

		//def debug
		value: function debug(message) {
			console.log(message);
		}

		//def trigger
	}, {
		key: "trigger",
		value: function trigger(event) {}

		//def login
	}, {
		key: "login",
		value: function login() {
			var email = arguments.length <= 0 || arguments[0] === undefined ? "foo@bar.com" : arguments[0];
			var password = arguments.length <= 1 || arguments[1] === undefined ? "pass1234s" : arguments[1];
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
				    data = false;

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
			if (!this.userCache.has(data.id)) {
				this.userCache.set(data.id, new User(data));
			}
			return this.userCache.get(data.id);
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
		key: "ready",
		get: function get() {
			return this.state === 3;
		}
	}]);

	return Client;
})();

module.exports = Client;