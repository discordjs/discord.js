const path = require('path');

/**
 * Represents a webhook.
 */
class Webhook {
  constructor(client, dataOrID, token) {
    if (client) {
      /**
       * The client that instantiated the webhook
       * @name Webhook#client
       * @type {Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });
      if (dataOrID) this.setup(dataOrID);
    } else {
      this.id = dataOrID;
      this.token = token;
      Object.defineProperty(this, 'client', { value: this });
    }
  }

  setup(data) {
    /**
     * The name of the webhook
     * @type {string}
     */
    this.name = data.name;

    /**
     * The token for the webhook
     * @type {string}
     */
    this.token = data.token;

    /**
     * The avatar for the webhook
     * @type {string}
     */
    this.avatar = data.avatar;

    /**
     * The ID of the webhook
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The guild the webhook belongs to
     * @type {Snowflake}
     */
    this.guildID = data.guild_id;

    /**
     * The channel the webhook belongs to
     * @type {Snowflake}
     */
    this.channelID = data.channel_id;

    if (data.user) {
      /**
       * The owner of the webhook
       * @type {?User|Object}
       */
      this.owner = this.client.users ? this.client.users.get(data.user.id) : data.user;
    } else {
      this.owner = null;
    }
  }

  /**
   * Options that can be passed into send, sendMessage, sendFile, sendEmbed, and sendCode.
   * @typedef {Object} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {Object[]} [embeds] An array of embeds for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions|string} [file] A file to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /**
   * Send a message with this webhook.
   * @param {StringResolvable} content The content to send
   * @param {WebhookMessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Send a message
   * webhook.send('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  send(content, options) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }
    if (options.file) {
      if (typeof options.file === 'string') options.file = { attachment: options.file };
      if (!options.file.name) {
        if (typeof options.file.attachment === 'string') {
          options.file.name = path.basename(options.file.attachment);
        } else if (options.file.attachment && options.file.attachment.path) {
          options.file.name = path.basename(options.file.attachment.path);
        } else {
          options.file.name = 'file.jpg';
        }
      }
      return this.client.resolver.resolveBuffer(options.file.attachment).then(file =>
        this.client.rest.methods.sendWebhookMessage(this, content, options, {
          file,
          name: options.file.name,
        })
      );
    }
    return this.client.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a message with this webhook
   * @param {StringResolvable} content The content to send
   * @param {WebhookMessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @example
   * // Send a message
   * webhook.sendMessage('hello!')
   *  .then(message => console.log(`Sent message: ${message.content}`))
   *  .catch(console.error);
   */
  sendMessage(content, options = {}) {
    return this.send(content, options);
  }

  /**
   * Send a file with this webhook.
   * @param {BufferResolvable} attachment The file to send
   * @param {string} [name='file.jpg'] The name and extension of the file
   * @param {StringResolvable} [content] Text message to send with the attachment
   * @param {WebhookMessageOptions} [options] The options to provide
   * @returns {Promise<Message>}
   */
  sendFile(attachment, name, content, options = {}) {
    return this.send(content, Object.assign(options, { file: { attachment, name } }));
  }

  /**
   * Send a code block with this webhook.
   * @param {string} lang Language for the code block
   * @param {StringResolvable} content Content of the code block
   * @param {WebhookMessageOptions} options The options to provide
   * @returns {Promise<Message|Message[]>}
   */
  sendCode(lang, content, options = {}) {
    return this.send(content, Object.assign(options, { code: lang }));
  }

  /**
   * Send a raw slack message with this webhook.
   * @param {Object} body The raw body to send
   * @returns {Promise}
   * @example
   * // Send a slack message
   * webhook.sendSlackMessage({
   *   'username': 'Wumpus',
   *   'attachments': [{
   *     'pretext': 'this looks pretty cool',
   *     'color': '#F0F',
   *     'footer_icon': 'http://snek.s3.amazonaws.com/topSnek.png',
   *     'footer': 'Powered by sneks',
   *     'ts': Date.now() / 1000
   *   }]
   * }).catch(console.error);
   */
  sendSlackMessage(body) {
    return this.client.rest.methods.sendSlackWebhookMessage(this, body);
  }

  /**
   * Edit the webhook.
   * @param {string} name The new name for the webhook
   * @param {BufferResolvable} avatar The new avatar for the webhook
   * @returns {Promise<Webhook>}
   */
  edit(name = this.name, avatar) {
    if (avatar) {
      return this.client.resolver.resolveBuffer(avatar).then(file => {
        const dataURI = this.client.resolver.resolveBase64(file);
        return this.client.rest.methods.editWebhook(this, name, dataURI);
      });
    }
    return this.client.rest.methods.editWebhook(this, name).then(data => {
      this.setup(data);
      return this;
    });
  }

  /**
   * Delete the webhook.
   * @returns {Promise}
   */
  delete() {
    return this.client.rest.methods.deleteWebhook(this);
  }
}

module.exports = Webhook;
