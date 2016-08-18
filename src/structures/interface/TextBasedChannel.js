/**
 * Interface for classes that have text-channel-like features
 * @interface
 */
class TextBasedChannel {
  /**
   * Send a message to this channel
   * @param {String} content the content to send
   * @param {MessageOptions} [options={}] the options to provide
   * @returns {Promise<Message>}
   * @example
   * // send a message
   * channel.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.log);
   */
  sendMessage(content, options = {}) {
    return this.client.rest.methods.sendMessage(this, content, options.tts);
  }
  /**
   * Send a text-to-speech message to this channel
   * @param {String} content the content to send
   * @returns {Promise<Message>}
   * @example
   * // send a TTS message
   * channel.sendTTSMessage('hello!')
   *  .then(message => console.log(`Sent tts message: ${message.content}`))
   *  .catch(console.log);
   */
  sendTTSMessage(content) {
    return this.client.rest.methods.sendMessage(this, content, true);
  }
}

function applyProp(structure, prop) {
  structure.prototype[prop] = TextBasedChannel.prototype[prop];
}

exports.applyToClass = structure => {
  for (const prop of ['sendMessage', 'sendTTSMessage']) {
    applyProp(structure, prop);
  }
};
