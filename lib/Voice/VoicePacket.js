"use strict";

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tweetnacl = require("tweetnacl");

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var nonce = new Buffer(24);
nonce.fill(0);

var VoicePacket = function VoicePacket(data, sequence, time, ssrc, secret) {
		_classCallCheck(this, VoicePacket);

		var mac = secret ? 16 : 0;
		var packetLength = data.length + 12 + mac;

		var audioBuffer = data;
		var returnBuffer = new Buffer(packetLength);

		returnBuffer.fill(0);
		returnBuffer[0] = 0x80;
		returnBuffer[1] = 0x78;

		returnBuffer.writeUIntBE(sequence, 2, 2);
		returnBuffer.writeUIntBE(time, 4, 4);
		returnBuffer.writeUIntBE(ssrc, 8, 4);

		if (secret) {
				// copy first 12 bytes
				returnBuffer.copy(nonce, 0, 0, 12);
				audioBuffer = _tweetnacl2["default"].secretbox(data, nonce, secret);
		}

		for (var i = 0; i < audioBuffer.length; i++) {
				returnBuffer[i + 12] = audioBuffer[i];
		}

		return returnBuffer;
};

exports["default"] = VoicePacket;
module.exports = exports["default"];
