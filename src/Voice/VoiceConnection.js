"use strict";

var WebSocket = require("ws");
var dns = require("dns");
var udp = require("dgram");
var Lame = require("lame");
var Opus = require('node-opus');
var Wav = require('wav');
var fs = require("fs");

function VoicePacket(packet, sequence, timestamp, ssrc) {
	var audioBuffer = packet;
	var retBuff = new Buffer(audioBuffer.length + 12);
	retBuff.fill(0);
	retBuff[0] = 0x80;
	retBuff[1] = 0x78;
	retBuff.writeUIntBE(sequence, 2, 2);
	retBuff.writeUIntBE(timestamp, 4, 4);
	retBuff.writeUIntBE(ssrc, 8, 4);

	for (var i = 0; i < audioBuffer.length; i++) {
		retBuff[i + 12] = audioBuffer[i];
	}

	return retBuff;
}

class VoiceConnection {
	constructor(channel, client, session, token, server, endpoint) {
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

	test() {
		var self = this;
		var startTime = Date.now();
		var cnt = 0;
		function sendAudio(sequence, timestamp, opusEncoder, wavOutput, udpClient, vWS) {
			cnt++;
			var buff = wavOutput.read(1920);
			if (buff && buff.length === 1920) {
				sequence + 20 < 65535 ? sequence += 1 : sequence = 0;
				timestamp + 9600 < 4294967295 ? timestamp += 960 : timestamp = 0;

				var encoded = opusEncoder.encode(buff, 1920);
				var audioPacket = VoicePacket(encoded, sequence, timestamp, self.vWSData.ssrc);

				var nextTime = startTime + cnt * 20;

				udpClient.send(audioPacket, 0, audioPacket.length, self.vWSData.port, self.endpoint, function (err) { });
				setTimeout(function () {
					sendAudio(sequence, timestamp, opusEncoder, wavOutput, udpClient, vWS);
				}, 20 + (nextTime - new Date().getTime()));
			} else {
				var speaking = {
					"op": 5,
					"d": {
						"speaking": false,
						"delay": 0
					}
				}
				vWS.send(JSON.stringify(speaking));
			}
		}

		var speaking = {
			"op": 5,
			"d": {
				"speaking": true,
				"delay": 0
			}
		}

		var vWS = self.vWS;
		var stream = fs.createReadStream("c:/users/amish/desktop/audio.wav");

		vWS.send(JSON.stringify(speaking));

		var rate = 48000;
		var opusEncoder = new Opus.OpusEncoder(48000, 1);
		var wavReader = new Wav.Reader();
wavReader.on('format', function (format) {
console.log(format);
});
		var wavOutput = stream.pipe(wavReader);
		
		var sequence = 0;
		var timestamp = 0;
		
		wavOutput.on('readable', function () {
			console.log("readable!");
			sendAudio(sequence, timestamp, opusEncoder, wavOutput, self.udp, vWS);
		});


	}

	init() {
		var self = this;
		dns.lookup(this.endpoint, (err, address, family) => {
			self.endpoint = address;
			var vWS = self.vWS = new WebSocket("wss://" + this.endpoint, null, { rejectUnauthorized: false });
			var udpClient = self.udp = udp.createSocket("udp4");

			var firstPacket = true;

			var discordIP = "", discordPort = "";

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
                    }
					console.log("success!!!");
                    vWS.send(JSON.stringify(wsDiscPayload));
                    firstPacket = false;
                }
            });

			vWS.on("open", () => {
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

			vWS.on("message", (msg) => {
				var data = JSON.parse(msg);
				switch (data.op) {
					case 2:
						self.vWSData = data.d;

						KAI = setInterval(() => {
							vWS.send(JSON.stringify({
								op: 3,
								d: null
							}));
						}, data.d.heartbeat_interval);

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, err => {
							console.log("err", err);
						});
						break;
					case 4:

						self.ready = true;
						self.mode = data.d.mode;
						console.log("ready!!!");

						self.test();

						break;
				}
			});

		});
	}
}

module.exports = VoiceConnection;