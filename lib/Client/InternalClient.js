"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require("events");
var request = require("superagent");
var WebSocket = require("ws");
var ConnectionState = require("./ConnectionState.js");

var Constants = require("../Constants.js"),
    Endpoints = Constants.Endpoints,
    PacketType = Constants.PacketType;

var Cache = require("../Util/Cache.js");

var User = require("../Structures/User.js"),
    Channel = require("../Structures/Channel.js"),
    TextChannel = require("../Structures/TextChannel.js"),
    VoiceChannel = require("../Structures/VoiceChannel.js"),
    PMChannel = require("../Structures/PMChannel.js"),
    Server = require("../Structures/Server.js");

var zlib;

var InternalClient = (function () {
	function InternalClient(discordClient) {
		_classCallCheck(this, InternalClient);

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
	}

	InternalClient.prototype.login = function login(email, password) {
		var self = this;
		var client = self.client;
		return new Promise(function (resolve, reject) {
			if (self.state === ConnectionState.DISCONNECTED || self.state === ConnectionState.IDLE) {

				self.state = ConnectionState.LOGGING_IN;

				request.post(Endpoints.LOGIN).send({ email: email, password: password }).end(function (err, res) {

					if (err) {
						self.state = ConnectionState.DISCONNECTED;
						self.websocket = null;
						client.emit("disconnected");
						reject(new Error(err.response.text));
					} else {
						var token = res.body.token;
						self.state = ConnectionState.LOGGED_IN;
						self.token = token;

						self.getGateway().then(function (url) {

							self.createWS(url);
							resolve(token);
						})["catch"](function (e) {
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
	};

	InternalClient.prototype.getGateway = function getGateway() {
		var self = this;
		return new Promise(function (resolve, reject) {

			request.get(Endpoints.GATEWAY).set("authorization", self.token).end(function (err, res) {
				if (err) reject(err);else resolve(res.body.url);
			});
		});
	};

	InternalClient.prototype.sendWS = function sendWS(object) {
		this.websocket.send(JSON.stringify(object));
	};

	InternalClient.prototype.createWS = function createWS(url) {
		var self = this;
		var client = self.client;

		if (this.websocket) return false;

		this.websocket = new WebSocket(url);

		this.websocket.onopen = function () {

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
		};

		this.websocket.onclose = function () {
			self.websocket = null;
			self.state = ConnectionState.DISCONNECTED;
			client.emit("disconnected");
		};

		this.websocket.onmessage = function (e) {

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

					self.users.add(new User(data.user, client));

					data.guilds.forEach(function (server) {
						self.servers.add(new Server(server, client));
					});

					console.log(self.servers);

					break;

			}
		};
	};

	return InternalClient;
})();

module.exports = InternalClient;