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
import VolumeTransformer from "./VolumeTransformer";
import StreamIntent from "./StreamIntent";
import EventEmitter from "events";
import unpipe from "unpipe";

const MODE_xsalsa20_poly1305 = "xsalsa20_poly1305";
const MODE_plain = "plain";

export default class VoiceConnection extends EventEmitter {
	constructor(channel, client, session, token, server, endpoint) {
		super();
		this.id = channel.id;
		this.voiceChannel = channel;
		this.client = client;
		this.session = session;
		this.token = token;
		this.server = server;
		this.endpoint = endpoint.split(":")[0];
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
		this.timestamp = 0;
		this.sequence = 0;

		this.mode = null;
		this.secret = null;

		this.volume = new VolumeTransformer();
		this.paused = false;
		this.init();
	}

	destroy() {
		this.stopPlaying();
		if (this.KAI) {
			clearInterval(this.KAI);
		}
		this.client.internal.sendWS(
			{
				op : 4,
				d : {
					guild_id : this.server.id,
					channel_id : null,
					self_mute : true,
					self_deaf : false
				}
			}
		);
		this.client.internal.voiceConnections.remove(this);
		try {
			this.vWS.close();
		} catch(e) {}
		try {
			this.udp.close();
		} catch(e) {}
	}

	stopPlaying() {
		this.playing = false;
		this.playingIntent = null;
		if (this.instream) {
			//not all streams implement these...
			//and even file stream don't seem to implement them properly...
			unpipe(this.instream);
			if (this.instream.end) {
				this.instream.end();
			}
			if (this.instream.destroy) {
				this.instream.destroy();
			}
			this.instream = null;
		}
		if (this.streamProc) {
			this.streamProc.stdin.pause();
			this.streamProc.kill("SIGKILL");
			this.streamProc = null;
		}
	}

	playStream(stream, channels=2) {
		var self = this,
			startTime = Date.now(),
			count = 0,
			length = 20,
			retStream = new StreamIntent(),
			onWarning = false;

		this.volume = stream;
		this.playing = true;
		this.playingIntent = retStream;

		function send() {
			if(self.paused) {
				startTime += Date.now() - (startTime + count * length);
				setTimeout(send, length);
				return;
			}
			if (!self.playingIntent || !self.playing) {
				self.setSpeaking(false);
				self.stopPlaying();
				retStream.emit("end");
				return;
			}
			try {

				var buffer = stream.read(1920 * channels);

				if (!buffer) {
					if (onWarning) {
						self.setSpeaking(false);
						self.stopPlaying();
						retStream.emit("end");
						return;
					} else {
						onWarning = true;
						setTimeout(send, length * 10); // give chance for some data in 200ms to appear
						return;
					}
				 }

				 if (buffer.length !== 1920 * channels) {
					var newBuffer = new Buffer(1920 * channels).fill(0);
					buffer.copy(newBuffer);
					buffer = newBuffer;
				 }

				count++;
				self.sequence + 1 < 65535 ? self.sequence += 1 : self.sequence = 0;
				self.timestamp + 960 < 4294967295 ? self.timestamp += 960 : self.timestamp = 0;

				self.sendBuffer(buffer, self.sequence, self.timestamp, (e) => { });

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
			if (!self.encoder.opus){
				self.playing=false;
				throw new Error("node-opus not found! Perhaps you didn't install it.");
				return;
			}

			if (!self.encoder.sanityCheck()) {
				self.playing = false;
				throw new Error("node-opus sanity check failed! Try re-installing node-opus.");
				return;
			}

			var buffer = self.encoder.opusBuffer(rawbuffer);
			var packet = new VoicePacket(buffer, sequence, timestamp, self.vWSData.ssrc, self.secret);
			return self.sendPacket(packet, callback);

		} catch (e) {
			self.playing = false;
			self.emit("error", e);
			return false;
		}
	}

	playFile(stream, options=false, callback = function (err, str) { }) {
		var self = this;
		self.stopPlaying();
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}
        if (typeof options !== "object") {
            options = {};
        }
		options.volume = options.volume !== undefined ? options.volume : this.getVolume();
		return new Promise((resolve, reject) => {
			this.encoder
				.encodeFile(stream, options)
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

	playRawStream(stream, options=false, callback = function (err, str) { }) {
		var self = this;
		self.stopPlaying();
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}
        if (typeof options !== "object") {
            options = {};
        }
		options.volume = options.volume !== undefined ? options.volume : this.getVolume();
		return new Promise((resolve, reject) => {
			this.encoder
				.encodeStream(stream, options)
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

	playArbitraryFFmpeg(ffmpegOptions, volume, callback = function (err, str) { }) {
		var self = this;
		self.stopPlaying();
		if (typeof volume === "function") {
			// volume is the callback
			callback = volume;
		}
        if (!ffmpegOptions instanceof Array) {
            ffmpegOptions = [];
        }
		var volume = volume !== undefined ? volume : this.getVolume();
		return new Promise((resolve, reject) => {
			this.encoder
				.encodeArbitraryFFmpeg(ffmpegOptions, volume)
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
			var vWS = self.vWS = new WebSocket("wss://" + this.endpoint, null, { rejectUnauthorized: false });
			this.endpoint = address;
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

					var modes = self.vWSData.modes;
					var mode = MODE_xsalsa20_poly1305;
					if (modes.indexOf(MODE_xsalsa20_poly1305) < 0) {
						mode = MODE_plain;
						self.client.emit("debug", "Encrypted mode not reported as supported by the server, using 'plain'");
					}

					vWS.send(JSON.stringify({
						"op": 1,
						"d": {
							"protocol": "udp",
							"data": {
								"address": discordIP,
								"port": Number(discordPort),
								"mode": mode
							}
						}
					}));
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

						self.KAI = KAI = self.client.internal.intervals.misc["voiceKAI"] = setInterval(() => {
							if (vWS && vWS.readyState === WebSocket.OPEN)
								vWS.send(JSON.stringify({
									op: 3,
									d: null
								}));
						}, data.d.heartbeat_interval);

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, err => {
							if (err)
								self.emit("error", err)
						});
						break;
					case 4:
						if (data.d.secret_key && data.d.secret_key.length > 0) {
							const buffer = new ArrayBuffer(data.d.secret_key.length);
							self.secret = new Uint8Array(buffer);
							for (let i = 0; i < this.secret.length; i++) {
								self.secret[i] = data.d.secret_key[i];
							}
						}

						self.ready = true;
						self.mode = data.d.mode;
						self.emit("ready", self);

						break;
				}
			});

			vWS.on("error", (err, msg) => {
				self.emit("error", err, msg);
			});

			vWS.on("close", (code) => {
				self.emit("close", code);
			})

		});
	}

	wrapVolume(stream) {
		stream.pipe(this.volume);

		return this.volume;
	}

	setVolume(volume) {
		this.volume.set(volume);
	}

	getVolume() {
		return this.volume.get();
	}

	mute() {
		this.lastVolume = this.volume.get();
		this.setVolume(0);
	}

	unmute() {
		this.setVolume(this.lastVolume);
		this.lastVolume = undefined;
	}

	pause() {
		this.paused = true;
		this.setSpeaking(false);
		this.playingIntent.emit("pause");
	}

	resume() {
		this.paused = false;
		this.setSpeaking(true);
		this.playingIntent.emit("resume");
	}
}
