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
	if (structure.name !== 'TextChannel' && structure.name !== 'DMChannel') {
		throw new Error(structure + ' cannot implement TextBasedChannel');
	}

	structure.prototype.sendMessage = sendMessage;

};
