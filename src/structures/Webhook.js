const path = require('path');
const Util = require('../util/Util');
const DataResolver = require('../util/DataResolver');
const Embed = require('./MessageEmbed');
const MessageAttachment = require('./MessageAttachment');
const MessageEmbed = require('./MessageEmbed');

/**
 * Represents a webhook.
 */
class Webhook {
  constructor(client, data) {
    /**
     * The client that instantiated the webhook
     * @name Webhook#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    if (data) this._patch(data);
  }

  _patch(data) {
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
     * @type {?string}
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
   * Options that can be passed into send.
   * @typedef {Object} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {boolean} [tts=false] Whether or not the message should be spoken aloud
   * @property {string} [nonce=''] The nonce for the message
   * @property {Object[]} [embeds] An array of embeds for the message
   * (see [here](https://discordapp.com/developers/docs/resources/channel#embed-object) for more details)
   * @property {boolean} [disableEveryone=this.client.options.disableEveryone] Whether or not @everyone and @here
   * should be replaced with plain-text
   * @property {FileOptions|BufferResolvable} [file] A file to send with the message
   * @property {FileOptions[]|string[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /* eslint-disable max-len */
  /**
   * Send a message with this webhook.
   * @param {StringResolvable} [content] The content to send
   * @param {WebhookMessageOptions|MessageEmbed|MessageAttachment|MessageAttachment[]} [options={}] The options to provide
   * @returns {Promise<Message|Object>}
   * @example
   * // Send a message
   * webhook.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   */
  /* eslint-enable max-len */
  send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    } else if (!options) {
      options = {};
    }

    if (options instanceof MessageAttachment) options = { files: [options.file] };
    if (options instanceof MessageEmbed) options = { embeds: [options] };
    if (options.embed) options = { embeds: [options.embed] };

    if (content instanceof Array || options instanceof Array) {
      const which = content instanceof Array ? content : options;
      const attachments = which.filter(item => item instanceof MessageAttachment);
      const embeds = which.filter(item => item instanceof MessageEmbed);
      if (attachments.length) options = { files: attachments };
      if (embeds.length) options = { embeds };
      if ((embeds.length || attachments.length) && content instanceof Array) content = '';
    }

    if (!options.username) options.username = this.name;
    if (options.avatarURL) {
      options.avatar_url = options.avatarURL;
      options.avatarURL = null;
    }

    if (content) {
      content = Util.resolveString(content);
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
    options.content = content;

    if (options.embeds) options.embeds = options.embeds.map(embed => new Embed(embed)._apiTransform());

    if (options.files) {
      for (let i = 0; i < options.files.length; i++) {
        let file = options.files[i];
        if (typeof file === 'string' || Buffer.isBuffer(file)) file = { attachment: file };
        if (!file.name) {
          if (typeof file.attachment === 'string') {
            file.name = path.basename(file.attachment);
          } else if (file.attachment && file.attachment.path) {
            file.name = path.basename(file.attachment.path);
          } else if (file instanceof MessageAttachment) {
            file = { attachment: file.file, name: path.basename(file.file) || 'file.jpg' };
          } else {
            file.name = 'file.jpg';
          }
        } else if (file instanceof MessageAttachment) {
          file = file.file;
        }
        options.files[i] = file;
      }

      return Promise.all(options.files.map(file =>
        DataResolver.resolveFile(file.attachment, this.client.browser).then(resource => {
          file.file = resource;
          return file;
        })
      )).then(files => this.client.api.webhooks(this.id, this.token).post({
        data: options,
        query: { wait: true },
        files,
        auth: false,
      }));
    }

    if (content instanceof Array) {
      return new Promise((resolve, reject) => {
        const messages = [];
        (function sendChunk() {
          const opt = content.length ? null : { embeds: options.embeds, files: options.files };
          this.client.api.webhooks(this.id, this.token).post({
            data: { content: content.shift(), opt },
            query: { wait: true },
            auth: false,
          })
            .then(message => {
              messages.push(message);
              if (content.length === 0) return resolve(messages);
              return sendChunk.call(this);
            })
            .catch(reject);
        }.call(this));
      });
    }

    return this.client.api.webhooks(this.id, this.token).post({
      data: options,
      query: { wait: true },
      auth: false,
    }).then(data => {
      if (!this.client.channels) return data;
      return this.client.channels.get(data.channel_id).messages.create(data, false);
    });
  }

  /**
   * Send a raw slack message with this webhook.
   * @param {Object} body The raw body to send
   * @returns {Promise<Message|Object>}
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
    return this.client.api.webhooks(this.id, this.token).slack.post({
      query: { wait: true },
      auth: false,
      data: body,
    }).then(data => {
      if (!this.client.channels) return data;
      return this.client.channels.get(data.channel_id).messages.create(data, false);
    });
  }

  /**
   * Edit the webhook.
   * @param {Object} options Options
   * @param {string} [options.name=this.name] New name for this webhook
   * @param {BufferResolvable} [options.avatar] New avatar for this webhook
   * @param {string} [reason] Reason for editing this webhook
   * @returns {Promise<Webhook>}
   */
  edit({ name = this.name, avatar }, reason) {
    if (avatar && (typeof avatar === 'string' && !avatar.startsWith('data:'))) {
      return DataResolver.resolveImage(avatar, this.client.browser).then(image =>
        this.edit({ name, avatar: image }, reason)
      );
    }
    return this.client.api.webhooks(this.id, this.token).patch({
      data: { name, avatar },
      reason,
    }).then(data => {
      this.name = data.name;
      this.avatar = data.avatar;
      return this;
    });
  }

  /**
   * Delete the webhook.
   * @param {string} [reason] Reason for deleting this webhook
   * @returns {Promise}
   */
  delete(reason) {
    return this.client.api.webhooks(this.id, this.token).delete({ reason });
  }

  static applyToClass(structure) {
    for (const prop of [
      'send',
      'sendSlackMessage',
      'edit',
      'delete',
    ]) {
      Object.defineProperty(structure.prototype, prop,
        Object.getOwnPropertyDescriptor(Webhook.prototype, prop));
    }
  }
}

module.exports = Webhook;
