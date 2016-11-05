"use strict";
/*
	Major credit to izy521 who is the creator of
	https://github.com/izy521/discord.io,

	without his help voice chat in discord.js would not have
	been possible!
*/

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _dns = require("dns");

var _dns2 = _interopRequireDefault(_dns);

var _dgram = require("dgram");

var _dgram2 = _interopRequireDefault(_dgram);

var _AudioEncoder = require("./AudioEncoder");

var _AudioEncoder2 = _interopRequireDefault(_AudioEncoder);

var _VoicePacket = require("./VoicePacket");

var _VoicePacket2 = _interopRequireDefault(_VoicePacket);

var _VolumeTransformer = require("./VolumeTransformer");

var _VolumeTransformer2 = _interopRequireDefault(_VolumeTransformer);

var _StreamIntent = require("./StreamIntent");

var _StreamIntent2 = _interopRequireDefault(_StreamIntent);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _unpipe = require("unpipe");

var _unpipe2 = _interopRequireDefault(_unpipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MODE_xsalsa20_poly1305 = "xsalsa20_poly1305";
const MODE_plain = "plain";

class VoiceConnection extends _events2.default {
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
		this.encoder = new _AudioEncoder2.default();
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

		this.volume = new _VolumeTransformer2.default();
		this.paused = false;
		this.init();
	}

	destroy() {
		this.stopPlaying();
		if (this.KAI) {
			clearInterval(this.KAI);
		}
		this.client.internal.sendWS({
			op: 4,
			d: {
				guild_id: this.server.id,
				channel_id: null,
				self_mute: true,
				self_deaf: false
			}
		});
		this.client.internal.voiceConnections.remove(this);
		try {
			this.vWS.close();
		} catch (e) {}
		try {
			this.udp.close();
		} catch (e) {}
	}

	stopPlaying() {
		this.playing = false;
		this.playingIntent = null;
		if (this.instream) {
			//not all streams implement these...
			//and even file stream don't seem to implement them properly...
			(0, _unpipe2.default)(this.instream);
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

	playStream(stream, channels = 2) {
		var self = this,
		    startTime = Date.now(),
		    count = 0,
		    length = 20,
		    retStream = new _StreamIntent2.default(),
		    onWarning = false;

		this.volume = stream;
		this.playing = true;
		this.playingIntent = retStream;

		function send() {
			if (self.paused) {
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

				self.sendBuffer(buffer, self.sequence, self.timestamp, e => {});

				var nextTime = startTime + count * length;

				self.streamTime = count * length;

				setTimeout(send, length + (nextTime - Date.now()));

				if (!self.playing) self.setSpeaking(true);

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
		if (this.vWS.readyState === _ws2.default.OPEN) this.vWS.send(JSON.stringify({
			op: 5,
			d: {
				speaking: value,
				delay: 0
			}
		}));
	}

	sendPacket(packet, callback = function (err) {}) {
		var self = this;
		self.playing = true;
		try {
			if (self.vWS.readyState === _ws2.default.OPEN) self.udp.send(packet, 0, packet.length, self.vWSData.port, self.endpoint, callback);
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
			if (!self.encoder.opus) {
				self.playing = false;
				throw new Error("node-opus not found! Perhaps you didn't install it.");
				return;
			}

			if (!self.encoder.sanityCheck()) {
				self.playing = false;
				throw new Error("node-opus sanity check failed! Try re-installing node-opus.");
				return;
			}

			var buffer = self.encoder.opusBuffer(rawbuffer);
			var packet = new _VoicePacket2.default(buffer, sequence, timestamp, self.vWSData.ssrc, self.secret);
			return self.sendPacket(packet, callback);
		} catch (e) {
			self.playing = false;
			self.emit("error", e);
			return false;
		}
	}

	playFile(stream, options = false, callback = function (err, str) {}) {
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
			this.encoder.encodeFile(stream, options).then(data => {
				self.streamProc = data.proc;
				var intent = self.playStream(data.stream, 2);
				resolve(intent);
				callback(null, intent);
			}).catch(error);
			function error(e = true) {
				reject(e);
				callback(e);
			}
		});
	}

	playRawStream(stream, options = false, callback = function (err, str) {}) {
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
			this.encoder.encodeStream(stream, options).then(data => {
				self.streamProc = data.proc;
				self.instream = data.instream;
				var intent = self.playStream(data.stream);
				resolve(intent);
				callback(null, intent);
			}).catch(error);
			function error(e = true) {
				reject(e);
				callback(e);
			}
		});
	}

	playArbitraryFFmpeg(ffmpegOptions, options, callback = function (err, str) {}) {
		var self = this;
		self.stopPlaying();
		if (!ffmpegOptions instanceof Array) {
			ffmpegOptions = [];
		}
		if (typeof options === "function") {
			// options is the callback
			callback = options;
		}
		if (typeof options !== "object") {
			options = {};
		}
		options.volume = options.volume !== undefined ? options.volume : this.getVolume();
		return new Promise((resolve, reject) => {
			this.encoder.encodeArbitraryFFmpeg(ffmpegOptions, options).then(data => {
				self.streamProc = data.proc;
				self.instream = data.instream;
				var intent = self.playStream(data.stream);
				resolve(intent);
				callback(null, intent);
			}).catch(error);
			function error(e = true) {
				reject(e);
				callback(e);
			}
		});
	}

	init() {
		var self = this;
		_dns2.default.lookup(this.endpoint, (err, address, family) => {
			var vWS = self.vWS = new _ws2.default("wss://" + this.endpoint, null, { rejectUnauthorized: false });
			this.endpoint = address;
			var udpClient = self.udp = _dgram2.default.createSocket("udp4");

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

			vWS.on("message", msg => {
				var data = JSON.parse(msg);
				switch (data.op) {
					case 2:
						self.vWSData = data.d;

						self.KAI = KAI = self.client.internal.intervals.misc["voiceKAI"] = setInterval(() => {
							if (vWS && vWS.readyState === _ws2.default.OPEN) vWS.send(JSON.stringify({
								op: 3,
								d: null
							}));
						}, data.d.heartbeat_interval);

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, err => {
							if (err) self.emit("error", err);
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
					case 5:
						var user = self.server.members.get("id", data.d.user_id);

						if (user) {
							var speaking = data.d.speaking;
							var channel = user.voiceChannel;

							if (channel) {
								user.speaking = speaking;
								self.client.emit("voiceSpeaking", channel, user);
							} else {
								self.client.emit("warn", "channel doesn't exist even though SPEAKING expects them to");
							}
						} else {
							self.client.emit("warn", "user doesn't exist even though SPEAKING expects them to");
						}

						break;
				}
			});

			vWS.on("error", (err, msg) => {
				self.emit("error", err, msg);
			});

			vWS.on("close", code => {
				self.emit("close", code);
			});
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
exports.default = VoiceConnection;
//# sourceMappingURL=VoiceConnection.js.map
