const EventEmitter = require('events');
const path = require('path');
const Util = require('../util/Util');
const Attachment = require('./Attachment');
const RichEmbed = require('./RichEmbed');
const Constants = require('../util/Constants');
const Snowflake = require('../util/Snowflake');

/**
 * Represents a webhook.
 */
class Webhook extends EventEmitter {
  constructor(client, dataOrID, token) {
    super();
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
     * @name Webhook#token
     * @type {?string}
     */
    Object.defineProperty(this, 'token', { value: data.token || null, writable: true, configurable: true });

    /**
     * The avatar for the webhook
     * @type {?string}
     */
    this.avatar = data.avatar;

    /**
     * The ID of the webhook
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of the webhook
     * @type {WebhookTypes}
     */
    this.type = Constants.WebhookTypes[data.type];

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
   * The timestamp the webhook was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return Snowflake.deconstruct(this.id).timestamp;
  }

  /**
   * The time the webhook was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * A link to the webhook user's avatar
   * @type {?stirng}
   * @readonly
   */
  get avatarURL() {
    if (!this.avatar) return null;
    return Constants.Endpoints.CDN(this.client.options.http.cdn).Avatar(this.id, this.avatar);
  }

  /**
   * The url of this webhook
   * @type {string}
   * @readonly
   */
  get url() {
    const API = `${this.client.options.http.host}/api/v${this.client.options.http.version}`;
    return API + Constants.Endpoints.Webhook(this.id, this.token);
  }

  /**
   * Options that can be passed into send, sendMessage, sendFile, sendEmbed, and sendCode.
   * @typedef {Object} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {Array<RichEmbed|Object>} [embeds] An array of embeds for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions|BufferResolvable|Attachment} [file] A file to send with the message **(deprecated)**
   * @property {FileOptions[]|BufferResolvable[]|Attachment[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /**
   * Send a message with this webhook.
   * @param {StringResolvable} content The content to send
   * @param {WebhookMessageOptions|Attachment|RichEmbed} [options] The options to provide,
   * can also be just a RichEmbed or Attachment
   * @returns {Promise<Message|Message[]|Object|Object[]>}
   * @example
   * // Send a basic message
   * webhook.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   * @example
   * // Send a remote file
   * webhook.send({
   *   files: ['https://cdn.discordapp.com/icons/222078108977594368/6e1019b3179d71046e463a75915e7244.png?size=2048']
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Send a local file
   * webhook.send({
   *   files: [{
   *     attachment: 'entire/path/to/file.jpg',
   *     name: 'file.jpg'
   *   }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Send an embed with a local image inside
   * webhook.send('This is an embed', {
   *   embeds: [{
   *     thumbnail: {
   *          url: 'attachment://file.jpg'
   *       }
   *    }],
   *    files: [{
   *       attachment: 'entire/path/to/file.jpg',
   *       name: 'file.jpg'
   *    }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }

    if (options instanceof Attachment) options = { files: [options] };
    if (options instanceof RichEmbed) options = { embeds: [options] };

    if (content) {
      content = this.client.resolver.resolveString(content);
      let { split, code, disableEveryone } = options;
      if (split && typeof split !== 'object') split = {};
      if (typeof code !== 'undefined' && (typeof code !== 'boolean' || code === true)) {
        content = Util.escapeMarkdown(content, true);
        content = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n${content}\n\`\`\``;
        if (split) {
          split.prepend = `\`\`\`${typeof code !== 'boolean' ? code || '' : ''}\n`;
          split.append = '\n```';
        }
      }
      if (disableEveryone || (typeof disableEveryone === 'undefined' && this.client.options.disableEveryone)) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }

      if (split) content = Util.splitMessage(content, split);
    }

    if (options.file) {
      if (options.files) options.files.push(options.file);
      else options.files = [options.file];
    }

    if (options.embeds) {
      const files = [];
      for (const embed of options.embeds) {
        if (embed.file) files.push(embed.file);
      }
      if (options.files) options.files.push(...files);
      else options.files = files;
    }

    if (options.embeds) options.embeds = options.embeds.map(e => new RichEmbed(e).toJSON());

    if (options.files) {
      for (let i = 0; i < options.files.length; i++) {
        let file = options.files[i];
        if (typeof file === 'string' || Buffer.isBuffer(file)) file = { attachment: file };
        if (!file.name) {
          if (typeof file.attachment === 'string') {
            file.name = path.basename(file.attachment);
          } else if (file.attachment && file.attachment.path) {
            file.name = path.basename(file.attachment.path);
          } else if (file instanceof Attachment) {
            file = { attachment: file.file, name: path.basename(file.file) || 'file.jpg' };
          } else {
            file.name = 'file.jpg';
          }
        } else if (file instanceof Attachment) {
          file = file.file;
        }
        options.files[i] = file;
      }

      return Promise.all(options.files.map(file =>
        this.client.resolver.resolveFile(file.attachment).then(resource => {
          file.file = resource;
          return file;
        })
      )).then(files => this.client.rest.methods.sendWebhookMessage(this, content, options, files));
    }

    return this.client.rest.methods.sendWebhookMessage(this, content, options);
  }

  /**
   * Send a message with this webhook
   * @param {StringResolvable} content The content to send
   * @param {WebhookMessageOptions} [options={}] The options to provide
   * @returns {Promise<Message|Message[]>}
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
   * Options provided to edit a webhook.
   * @property {string} [name] The new name for the webhook
   * @property {BufferResolvable} [avatar] The new avatar for the webhook
   * @property {ChannelResolvable} [channel] The new channel for the webhook
   * @typedef {Object} WebhookEditOptions
   */

  /**
   * Edit the webhook.
   * @param {string|WebhookEditOptions} nameOrOptions The new name for the webhook **(deprecated, use options)**
   * Alternatively options for the webhook, overriding the avatar parameter.
   * @param {BufferResolvable|string} [avatarOrReason] The new avatar for the webhook **(deprecated, use options)**
   * Alternatively a reason to edit, if using options as first parameter.
   * @returns {Promise<Webhook>}
   */
  edit(nameOrOptions = this.name, avatarOrReason) {
    if (typeof nameOrOptions !== 'object') {
      process.emitWarning('Webhook#edit: Use options object instead of separate parameters.');
      nameOrOptions = {
        name: nameOrOptions,
        avatar: avatarOrReason,
      };
      // Parameter was an avatar here; Clear the now reason parameter
      avatarOrReason = undefined;
    }

    if (nameOrOptions.channel) {
      nameOrOptions.channel_id = this.client.resolver.resolveChannelID(nameOrOptions.channel);
      nameOrOptions.channel = undefined;
    }

    if (nameOrOptions.avatar) {
      return this.client.resolver.resolveImage(nameOrOptions.avatar).then(data => {
        nameOrOptions.avatar = data;
        return this.client.rest.methods.editWebhook(this, nameOrOptions, avatarOrReason);
      });
    }

    return this.client.rest.methods.editWebhook(this, nameOrOptions, avatarOrReason);
  }

  /**
   * Delete the webhook.
   * @param {string} [reason] Reason for deleting the webhook
   * @returns {Promise}
   */
  delete(reason) {
    return this.client.rest.methods.deleteWebhook(this, reason);
  }
}

module.exports = Webhook;
