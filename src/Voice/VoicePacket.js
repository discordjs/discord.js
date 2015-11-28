"use strict";

export default class VoicePacket {
	constructor(data, sequence, time, ssrc){

		var audioBuffer = data,
			returnBuffer = new Buffer(audioBuffer.length + 12);

		returnBuffer.fill(0);
		returnBuffer[0] = 0x80;
		returnBuffer[1] = 0x78;

		returnBuffer.writeUIntBE(sequence, 2, 2);
		returnBuffer.writeUIntBE(time, 4, 4);
		returnBuffer.writeUIntBE(ssrc, 8, 4);

		for (var i=0; i<audioBuffer.length; i++) {
			returnBuffer[i + 12] = audioBuffer[i];
		}

		return returnBuffer;

	}
}
