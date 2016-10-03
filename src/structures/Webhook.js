const path = require('path');
const RESTManager = require('../client/rest/RESTManager');
const ClientDataResolver = require('../client/ClientDataResolver');

/**
 * Represents a Webhook
 */
class Webhook {
  constructor(client, dataOrID, token) {
    this.rest = client.rest || new RESTManager(this);
    this.resolver = client.resolver || new ClientDataResolver(this);
    if (client) {
      /**
       * The client that instantiated the Channel
       * @type {Client}
       */
      this.client = client;
      Object.defineProperty(this, 'client', { enumerable: false, configurable: false });
      if (dataOrID) this.setup(dataOrID);
    } else {
      this.id = dataOrID;
      this.token = token;
      this.client = this;
    }
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
     * @type {string}
     */
    this.guild_id = data.guild_id;

    /**
     * The channel the Webhook belongs to
     * @type {string}
     */
    this.channel_id = data.channel_id;

    /**
     * The owner of the Webhook
     * @type {User}
     */
    if (data.user) this.owner = data.user;
  }

  /**
   * Options that can be passed into sendMessage, sendTTSMessage, sendFile, sendCode
   * @typedef {Object} MessageOptions
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {boolean} [disableEveryone=this.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   */

  /**
   * Send a message with this webhook
   * @param {StringResolvable} content The content to send
   * @param {MessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a message
   * webook.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  sendMessage(content, options = {}) {
    return this.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a text-to-speech message with this webhook
   * @param {StringResolvable} content The content to send
   * @param {MessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // send a TTS message
   * webhook.sendTTSMessage('hello!')
   *  .then(message => console.log(`Sent tts message: ${message.content}`))
   *  .catch(console.error);
   */
  sendTTSMessage(content, options = {}) {
    Object.assign(options, { tts: true });
    return this.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a file with this webhook
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
      this.resolver.resolveFile(attachment).then(file => {
        this.rest.methods.sendWebhookMessage(this, content, options, {
          file,
          name: fileName,
        }).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

  /**
   * Send a code block with this webhook
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
    content = this.resolver.resolveString(content).replace(/```/g, '`\u200b``');
    return this.sendMessage(`\`\`\`${lang ? lang : ''}\n${content}\n\`\`\``, options);
  }

  /**
   * Delete the Webhook
   * @returns {Promise}
   */
  delete() {
    return this.rest.methods.deleteChannelWebhook(this);
  }

  /**
   * Edit the Webhook.
   * @param {string} name The new name for the Webhook
   * @param {FileResolvable} avatar The new avatar for the Webhook.
   * @returns {Promise<Webhook>}
   */
  edit(name, avatar) {
    return new Promise((resolve, reject) => {
      if (avatar) {
        this.resolver.resolveFile(avatar).then(file => {
          let base64 = new Buffer(file, 'binary').toString('base64');
          let dataURI = `data:;base64,${base64}`;
          this.rest.methods.editChannelWebhook(this, name, dataURI)
          .then(resolve).catch(reject);
        }).catch(reject);
      } else {
        this.rest.methods.editChannelWebhook(this, name)
        .then(data => {
          this.setup(data);
        }).catch(reject);
      }
    });
  }
}

module.exports = Webhook;
