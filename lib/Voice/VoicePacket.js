"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var nacl;
try {
	nacl = require("tweetnacl");
} catch (e) {
	// no tweetnacl!
}

const nonce = new Buffer(24);
nonce.fill(0);

class VoicePacket {
	constructor(data, sequence, time, ssrc, secret) {
		if (!nacl) {
			throw new Error("tweetnacl not found! Perhaps you didn't install it.");
		}
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
			audioBuffer = nacl.secretbox(data, nonce, secret);
		}

		for (var i = 0; i < audioBuffer.length; i++) {
			returnBuffer[i + 12] = audioBuffer[i];
		}

		return returnBuffer;
	}
}
exports.default = VoicePacket;
//# sourceMappingURL=VoicePacket.js.map
