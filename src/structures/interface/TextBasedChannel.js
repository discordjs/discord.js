function sendMessage(content, options = {}) {
  return this.client.rest.methods.sendMessage(this, content, options.tts);
}

function sendTTSMessage(content) {
  return this.client.rest.methods.sendMessage(this, content, true);
}

exports.applyToClass = structure => {
  structure.prototype.sendMessage = sendMessage;
  structure.prototype.sendTTSMessage = sendTTSMessage;
};
