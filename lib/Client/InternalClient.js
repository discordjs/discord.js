"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require("events");
var request = require("superagent");
var ConnectionState = require("./ConnectionState.js");
var Constants = require("../Constants.js"),
    Endpoints = Constants.Endpoints;

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
			self.client.emit("disconnected");
		};

		this.websocket.onmessage = function (e) {

			if (e.type === "Binary") {
				e.data = zlib.inflateSync(e.data).toString();
			}

			var packet, data;
			try {
				packet = JSON.parse(e.data);
				data = packet.d;
			} catch (e) {
				self.client.emit("error", e);
			}

			self.emit("raw", packet);

			switch (packet.t) {}
		};
	};

	return InternalClient;
})();

module.exports = InternalClient;