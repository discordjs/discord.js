"use strict";
/*
	Major credit to izy521 who is the creator of
	https://github.com/izy521/discord.io,

	without his help voice chat in discord.js would not have
	been possible!
*/

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var _StreamIntent = require("./StreamIntent");

var _StreamIntent2 = _interopRequireDefault(_StreamIntent);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var VoiceConnection = (function (_EventEmitter) {
	_inherits(VoiceConnection, _EventEmitter);

	function VoiceConnection(channel, client, session, token, server, endpoint) {
		_classCallCheck(this, VoiceConnection);

		_EventEmitter.call(this);
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
		this.encoder = new _AudioEncoder2["default"]();
		this.udp = null;
		this.playingIntent = null;
		this.playing = false;
		this.streamTime = 0;
		this.streamProc = null;
		this.KAI = null;
		this.timestamp = 0;
		this.sequence = 0;
		this.init();
	}

	VoiceConnection.prototype.destroy = function destroy() {
		this.stopPlaying();
		if (this.KAI) clearInterval(this.KAI);
		this.vWS.close();
		this.udp.close();
		this.client.internal.sendWS({
			op: 4,
			d: {
				guild_id: null,
				channel_id: null,
				self_mute: true,
				self_deaf: false
			}
		});
	};

	VoiceConnection.prototype.stopPlaying = function stopPlaying() {
		this.playing = false;
		this.playingIntent = null;
		if (this.streamProc) {
			this.streamProc.stdin.pause();
			this.streamProc.kill("SIGINT");
			this.streamProc.kill();
		}
		if (this.instream) {
			//not all streams implement these...
			//and even file stream don't seem to implement them properly...
			if (this.instream.end) {
				this.instream.end();
			}
			if (this.instream.destroy) {
				this.instream.destroy();
			}
			this.instream = null;
		}
	};

	VoiceConnection.prototype.playStream = function playStream(stream) {
		var channels = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

		var self = this;

		var startTime = Date.now();
		var count = 0;

		var length = 20;

		if (self.playingIntent) {
			self.stopPlaying();
		}
		self.playing = true;
		var retStream = new _StreamIntent2["default"]();
		var onWarning = false;
		self.playingIntent = retStream;

		function send() {
			if (!self.playingIntent || !self.playing) {
				self.setSpeaking(false);
				retStream.emit("end");
				//console.log("ending 1");
				return;
			}
			try {

				var buffer = stream.read(1920 * channels);

				if (!buffer) {
					if (onWarning) {
						retStream.emit("end");
						self.setSpeaking(false);
						//console.log("ending 2");
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

				self.sendBuffer(buffer, self.sequence, self.timestamp, function (e) {});

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
	};

	VoiceConnection.prototype.setSpeaking = function setSpeaking(value) {
		this.playing = value;
		if (this.vWS.readyState === _ws2["default"].OPEN) this.vWS.send(JSON.stringify({
			op: 5,
			d: {
				speaking: value,
				delay: 0
			}
		}));
	};

	VoiceConnection.prototype.sendPacket = function sendPacket(packet) {
		var callback = arguments.length <= 1 || arguments[1] === undefined ? function (err) {} : arguments[1];

		var self = this;
		self.playing = true;
		try {
			if (self.vWS.readyState === _ws2["default"].OPEN) self.udp.send(packet, 0, packet.length, self.vWSData.port, self.endpoint, callback);
		} catch (e) {
			self.playing = false;
			callback(e);
			return false;
		}
	};

	VoiceConnection.prototype.sendBuffer = function sendBuffer(rawbuffer, sequence, timestamp, callback) {
		var self = this;
		self.playing = true;
		try {
			if (!self.encoder.opus) {
				self.playing = false;
				self.emit("error", "No Opus!");
				self.client.emit("debug", "Tried to use node-opus, but opus not available - install it!");
				return;
			}
			var buffer = self.encoder.opusBuffer(rawbuffer);
			var packet = new _VoicePacket2["default"](buffer, sequence, timestamp, self.vWSData.ssrc);
			return self.sendPacket(packet, callback);
		} catch (e) {
			self.playing = false;
			self.emit("error", e);
			return false;
		}
	};

	VoiceConnection.prototype.playFile = function playFile(stream) {
		var _this = this;

		var options = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, str) {} : arguments[2];

		var self = this;
		self.stopPlaying();
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}
		return new Promise(function (resolve, reject) {
			_this.encoder.encodeFile(stream, options)["catch"](error).then(function (data) {
				self.streamProc = data.proc;
				var intent = self.playStream(data.stream, 2);
				resolve(intent);
				callback(null, intent);
			});
			function error() {
				var e = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

				reject(e);
				callback(e);
			}
		});
	};

	VoiceConnection.prototype.playRawStream = function playRawStream(stream) {
		var _this2 = this;

		var options = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
		var callback = arguments.length <= 2 || arguments[2] === undefined ? function (err, str) {} : arguments[2];

		var self = this;
		self.stopPlaying();
		if (typeof options === "function") {
			// options is the callback
			callback = options;
			options = {};
		}
		return new Promise(function (resolve, reject) {
			_this2.encoder.encodeStream(stream, options)["catch"](error).then(function (data) {
				self.streamProc = data.proc;
				self.instream = data.instream;
				var intent = self.playStream(data.stream);
				resolve(intent);
				callback(null, intent);
			});
			function error() {
				var e = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

				reject(e);
				callback(e);
			}
		});
	};

	VoiceConnection.prototype.init = function init() {
		var _this3 = this;

		var self = this;
		_dns2["default"].lookup(this.endpoint, function (err, address, family) {
			self.endpoint = address;
			var vWS = self.vWS = new _ws2["default"]("wss://" + _this3.endpoint, null, { rejectUnauthorized: false });
			var udpClient = self.udp = _dgram2["default"].createSocket("udp4");

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

						self.KAI = KAI = self.client.internal.intervals.misc["voiceKAI"] = setInterval(function () {
							if (vWS && vWS.readyState === _ws2["default"].OPEN) vWS.send(JSON.stringify({
								op: 3,
								d: null
							}));
						}, data.d.heartbeat_interval);

						var udpPacket = new Buffer(70);
						udpPacket.writeUIntBE(data.d.ssrc, 0, 4);
						udpClient.send(udpPacket, 0, udpPacket.length, data.d.port, self.endpoint, function (err) {
							if (err) self.emit("error", err);
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
	};

	return VoiceConnection;
})(_events2["default"]);

exports["default"] = VoiceConnection;
module.exports = exports["default"];
