"use strict";
/*
	Major credit to izy521 who is the creator of
	https://github.com/izy521/discord.io,

	without his help voice chat in discord.js would not have
	been possible!
*/

import WebSocket from "ws";
import dns from "dns";
import udp from "dgram";
import AudioEncoder from "./AudioEncoder";
import VoicePacket from "./VoicePacket";
import StreamIntent from "./StreamIntent";
import EventEmitter from "events";

export default class VoiceConnection extends EventEmitter {
	constructor(channel, client, session, token, server, endpoint) {
		super();
		this.id = channel.id;
		this.voiceChannel = channel;
		this.client = client;
		this.session = session;
		this.token = token;
		this.server = server;
		this.endpoint = endpoint.replace(":80", "");
		this.vWS = null; // vWS means voice websocket
		this.ready = false;
		this.vWSData = {};
		this.encoder = new AudioEncoder();
		this.udp = null;
		this.playingIntent = null;
		this.playing = false;
		this.streamTime = 0;
		this.streamProc = null;
		this.KAI = null;
		this.init();
	}

	destroy() {
		this.stopPlaying();
		if(this.KAI)
			clearInterval(this.KAI);
		this.vWS.close();
		this.udp.close();
		this.client.internal.sendWS(
			{
				op : 4,
				d : {
					guild_id : null,
					channel_id : null,
					self_mute : true,
					self_deaf : false
				}
			}
		);
	}

	stopPlaying() {
		this.playing = false;
		this.playingIntent = null;
		if(this.instream){
			//not all streams implement these...
			//and even file stream don't seem to implement them properly...
			if(this.instream.end) {
				this.instream.end();
			}
			if(this.instream.destroy) {
				this.instream.destroy();
			}
			this.instream = null;
		}
	}

	playStream(stream, channels=2) {

		var self = this;

		var startTime = Date.now();
		var sequence = 0;
		var time = 0;
		var count = 0;

		var length = 20;

		if (self.playingIntent) {
			self.stopPlaying();
		}
		self.playing = true;
		var retStream = new StreamIntent();
		var onWarning = false;
		self.playingIntent = retStream;

		function send() {
			if (!self.playingIntent || !self.playing) {
				self.setSpeaking(false);
				retStream.emit("end");
				console.log("ending 1");
				return;
			}
			try {

					var buffer = stream.read(1920 * channels);

					if (!buffer) {
						if (onWarning) {
								retStream.emit("end");
								self.setSpeaking(false);
								console.log("ending 2");
								return;
						  } else {
								onWarning = true;
								setTimeout(send, length * 10); // give chance for some data in 200ms to appear
								return;
						}
					 }

					 if(buffer.length !== 1920 * channels) {
						var newBuffer = new Buffer(1920 * channels).fill(0);
						buffer.copy(newBuffer);
						buffer = newBuffer;
					 }

				count++;
				sequence + 10 < 65535 ? sequence += 1 : sequence = 0;
				time + 9600 < 4294967295 ? time += 960 : time = 0;

				self.sendBuffer(buffer, sequence, time, (e) => { });

				var nextTime = startTime + (count * length);

				self.streamTime = count * length;

				setTimeout(send, length + (nextTime - Date.now()));

				if (!self.playing)
					self.setSpeaking(true);

				retStream.emit("time", self.streamTime);


			} catch (e) {
				retStream.emit("error", e);
			}
		}
		self.setSpeaking(true);
		send();

		return retStream;
	}

	setSpeaking(value) {
		this.playing = value;
		if (this.vWS.readyState === WebSocket.OPEN)
			this.vWS.send(JSON.stringify({
				op: 5,
				d: {
					speaking: value,
					delay: 0
				}
			}));
	}

	sendPacket(packet, callback = function (err) { }) {
		var self = this;
		self.playing = true;
		try {
			if (self.vWS.readyState === WebSocket.OPEN)
				self.udp.send(packet, 0, packet.length, self.vWSData.port, self.endpoint, callback);
		} catch (e) {
			self.playing = false;
			callback(e);
			return false;
		}
	}

	sendBuffer(rawbuffer, sequence, timestamp, callback) {
		var self = this;
		self.playing = true;
		try {
			if(!self.encoder.opus){
				self.playing=false;
				self.emit("error", "No Opus!");
				self.client.emit("debug", "Tried to use node-opus, but opus not available - install it!");
				return;
			}
			var buffer = self.encoder.opusBuffer(rawbuffer);
			var packet = new VoicePacket(buffer, sequence, timestamp, self.vWSData.ssrc);
			return self.sendPacket(packet, callback);

		} catch (e) {
			self.playing = false;
			self.emit("error", e);
			return false;
		}
	}

	test() {
		this.playFile("C:/users/amish/desktop/audio.mp3")
			.then(stream => {
				stream.on("time", time => {
					console.log("Time", time);
				})
			})
	}

	playFile(stream, callback = function (err, str) { }) {
		var self = this;
		return new Promise((resolve, reject) => {
			this.encoder
				.encodeFile(stream)
				.catch(error)
				.then(data => {
					self.streamProc = data.proc;
					var intent = self.playStream(data.stream, 2);
					resolve(intent);
					callback(null, intent);

				});
			function error(e = true) {
				reject(e);
				callback(e);
			}
		})
	}

	playRawStream(stream, callback = function (err, str) { }) {
		var self = this;
		return new Promise((resolve, reject) => {
			this.encoder
				.encodeStream(stream)
				.catch(error)
				.then(data => {
					self.streamProc = data.proc;
					self.instream = data.instream;
					var intent = self.playStream(data.stream);
					resolve(intent);
					callback(null, intent);

				});
			function error(e = true) {
				reject(e);
				callback(e);
			}
		})
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
							if (vWS && vWS.readyState === WebSocket.OPEN)
								vWS.send(JSON.stringify({
									op: 3,
									d: null
								}));
						}, data.d.heartbeat_interval);
						self.KAI = KAI;

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, err => {
							if (err)
								self.emit("error", err)
						});
						break;
					case 4:

						self.ready = true;
						self.mode = data.d.mode;
						self.emit("ready", self);

						break;
				}
			});

		});
	}
}
