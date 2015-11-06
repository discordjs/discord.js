"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebSocket = require("ws");
var dns = require("dns");
var udp = require("dgram");

var VoiceConnection = (function () {
	function VoiceConnection(channel, client, session, token, server, endpoint) {
		_classCallCheck(this, VoiceConnection);

		this.voiceChannel = channel;
		this.client = client;
		this.session = session;
		this.token = token;
		this.server = server;
		this.endpoint = endpoint.replace(":80", "");
		this.vWS = null; // vWS means voice websocket
		this.ready = false;
		this.vWSData = {};
		this.init();
	}

	VoiceConnection.prototype.init = function init() {
		var _this = this;

		var self = this;
		dns.lookup(this.endpoint, function (err, address, family) {
			self.endpoint = address;
			var vWS = self.vWS = new WebSocket("wss://" + _this.endpoint, null, { rejectUnauthorized: false });
			var udpClient = self.udp = udp.createSocket("udp4");

			var firstPacket = true;

			var discordIP = "",
			    discordPort = "";

			udpClient.bind({ exclusive: true });
			udpClient.on('message', function (msg, rinfo) {
				var buffArr = JSON.parse(JSON.stringify(msg)).data;
				if (firstPacket === true) {
					for (var i = 4; i < buffArr.indexOf(0, i); i++) {
						discordIP += String.fromCharCode(buffArr[i]);
					}
					discordPort = msg.readUIntLE(msg.length - 2, 2).toString(10);

					var wsDiscPayload = {
						"op": 1,
						"d": {
							"protocol": "udp",
							"data": {
								"address": discordIP,
								"port": Number(discordPort),
								"mode": self.vWSData.modes[0] //Plain
							}
						}
					};
					console.log("success!!!");
					vWS.send(JSON.stringify(wsDiscPayload));
					firstPacket = false;
				}
			});

			vWS.on("open", function () {
				vWS.send(JSON.stringify({
					op: 0,
					d: {
						server_id: self.server.id,
						user_id: self.client.internal.user.id,
						session_id: self.session,
						token: self.token
					}
				}));
			});

			var KAI;

			vWS.on("message", function (msg) {
				var data = JSON.parse(msg);
				switch (data.op) {
					case 2:
						self.vWSData = data.d;

						KAI = setInterval(function () {
							vWS.send(JSON.stringify({
								op: 3,
								d: null
							}));
						}, data.d.heartbeat_interval);

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, function (err) {
							console.log("err", err);
						});
						break;
					case 4:

						self.ready = true;
						self.mode = data.d.mode;
						console.log("ready!!!");

						break;
				}
			});
		});
	};

	return VoiceConnection;
})();

module.exports = VoiceConnection;