const path = require('path');

/**
 * Represents a Webhook
 */
class Webhook {
  constructor(client, data) {
    /**
     * The client that instantiated the Channel
     * @type {Client}
     */
    this.client = client;
    Object.defineProperty(this, 'client', { enumerable: false, configurable: false });

    if (data) this.setup(data);
  }

  setup(data) {
    /**
     * The name of the Webhook
     * @type {string}
     */
    this.name = data.name;

    /**
     * The token for the Webhook
     * @type {string}
     */
    this.token = data.token;

    /**
     * The avatar for the Webhook
     * @type {string}
     */
    this.avatar = data.avatar;

    /**
     * The ID of the Webhook
     * @type {string}
     */
    this.id = data.id;

    /**
     * The guild the Webhook belongs to
     * @type {Guild}
     */
    this.guild = this.client.guilds.get(data.guild_id);

    /**
     * The channel the Webhook belongs to
     * @type {GuildChannel}
     */
    this.channel = this.client.channels.get(data.channel_id);

    /**
     * The owner of the Webhook
     * @type {User}
     */
    this.owner = this.client.users.get(data.user.id);
  }

  /**
   * Options that can be passed into sendMessage, sendTTSMessage, sendFile, sendCode
   * @typedef {Object} MessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   */

  /**
   * Send a message to this channel
   * @param {StringResolvable} content The content to send
   * @param {MessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a message
   * channel.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  sendMessage(content, options = {}) {
    return this.client.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a text-to-speech message to this channel
   * @param {StringResolvable} content The content to send
   * @param {MessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a TTS message
   * channel.sendTTSMessage('hello!')
   *  .then(message => console.log(`Sent tts message: ${message.content}`))
   *  .catch(console.error);
   */
  sendTTSMessage(content, options = {}) {
    Object.assign(options, { tts: true });
    return this.client.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a file to this channel
   * @param {FileResolvable} attachment The file to send
   * @param {string} [fileName="file.jpg"] The name and extension of the file
   * @param {StringResolvable} [content] Text message to send with the attachment
   * @param {MessageOptions} [options] The options to provide
   * @returns {Promise<Message>}
   */
  sendFile(attachment, fileName, content, options = {}) {
    if (!fileName) {
      if (typeof attachment === 'string') {
        fileName = path.basename(attachment);
      } else if (attachment && attachment.path) {
        fileName = path.basename(attachment.path);
      } else {
        fileName = 'file.jpg';
      }
    }
    return new Promise((resolve, reject) => {
      this.client.resolver.resolveFile(attachment).then(file => {
        this.client.rest.methods.sendWebhookMessage(this, content, options, {
          file,
          name: fileName,
        }).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  /**
   * Send a code block to this channel
   * @param {string} lang Language for the code block
   * @param {StringResolvable} content Content of the code block
   * @param {MessageOptions} options The options to provide
   * @returns {Promise<Message|Message[]>}
   */
  sendCode(lang, content, options = {}) {
    if (options.split) {
      if (typeof options.split !== 'object') options.split = {};
      if (!options.split.prepend) options.split.prepend = `\`\`\`${lang ? lang : ''}\n`;
      if (!options.split.append) options.split.append = '\n```';
    }
    content = this.client.resolver.resolveString(content).replace(/```/g, '`\u200b``');
    return this.sendMessage(`\`\`\`${lang ? lang : ''}\n${content}\n\`\`\``, options);
  }
}

module.exports = Webhook;
