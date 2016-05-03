'use strict';

function sendMessage(content, options) {
	options = options || {};
	return this.client.rest.methods.SendMessage(this, content, options.tts);
}

function sendTTSMessage(content, options) {
	options = options || {};
	return this.client.rest.methods.SendMessage(this, content, true);
}

exports.applyToClass = structure => {
	structure.prototype.sendMessage = sendMessage;
};
