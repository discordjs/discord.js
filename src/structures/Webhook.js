const DataResolver = require('../util/DataResolver');
const { createMessage } = require('./shared');

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
   * @property {FileOptions[]|string[]} [files] Files to send with the message
   * @property {string|boolean} [code] Language for optional codeblock formatting to apply
   * @property {boolean|SplitOptions} [split=false] Whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message.
   */

  /* eslint-disable max-len */
  /**
   * Sends a message with this webhook.
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
  async send(content, options) { // eslint-disable-line complexity
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = null;
    } else if (!options) {
      options = {};
    }
    if (!options.content) options.content = content;

    const { data, files } = await createMessage(this, options);

    if (data.content instanceof Array) {
      const messages = [];
      for (let i = 0; i < data.content.length; i++) {
        const opt = i === data.content.length - 1 ? { embeds: data.embeds, files } : {};
        Object.assign(opt, { avatarURL: data.avatar_url, content: data.content[i], username: data.username });
        // eslint-disable-next-line no-await-in-loop
        const message = await this.send(data.content[i], opt);
        messages.push(message);
      }
      return messages;
    }


    return this.client.api.webhooks(this.id, this.token).post({
      data, files,
      query: { wait: true },
      auth: false,
    }).then(d => {
      if (!this.client.channels) return d;
      return this.client.channels.get(d.channel_id).messages.create(d, false);
    });
  }

  /**
   * Sends a raw slack message with this webhook.
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
   * Edits the webhook.
   * @param {Object} options Options
   * @param {string} [options.name=this.name] New name for this webhook
   * @param {BufferResolvable} [options.avatar] New avatar for this webhook
   * @param {ChannelResolvable} [options.channel] New channel for this webhook
   * @param {string} [reason] Reason for editing this webhook
   * @returns {Promise<Webhook>}
   */
  edit({ name = this.name, avatar, channel }, reason) {
    if (avatar && (typeof avatar === 'string' && !avatar.startsWith('data:'))) {
      return DataResolver.resolveImage(avatar).then(image => this.edit({ name, avatar: image }, reason));
    }
    if (channel) channel = this.client.channels.resolveID(channel);
    return this.client.api.webhooks(this.id, channel ? undefined : this.token).patch({
      data: { name, avatar, channel_id: channel },
      reason,
    }).then(data => {
      this.name = data.name;
      this.avatar = data.avatar;
      this.channelID = data.channel_id;
      return this;
    });
  }

  /**
   * Deletes the webhook.
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
