'use strict';

const APIMessage = require('./APIMessage');
const Channel = require('./Channel');
const { WebhookTypes } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const SnowflakeUtil = require('../util/SnowflakeUtil');

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
    this.type = WebhookTypes[data.type];

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

    /**
     * The owner of the webhook
     * @type {?User|Object}
     */
    this.owner = data.user ? this.client.users?.add(data.user) ?? data.user : null;

    /**
     * The source guild of the webhook
     * @type {?Guild|Object}
     */
    this.sourceGuild = data.source_guild
      ? this.client.guilds?.add(data.source_guild, false) ?? data.source_guild
      : null;

    /**
     * The source channel of the webhook
     * @type {?Channel|Object}
     */
    this.sourceChannel = this.client.channels?.resolve(data.source_channel?.id) ?? data.source_channel ?? null;
  }

  /**
   * Options that can be passed into send.
   * @typedef {BaseMessageOptions} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {MessageEmbed[]|Object[]} [embeds] An array of embeds for the message
   */

  /**
   * Options that can be passed into editMessage.
   * @typedef {Object} WebhookEditMessageOptions
   * @property {MessageEmbed[]|Object[]} [embeds] See {@link WebhookMessageOptions#embeds}
   * @property {StringResolvable} [content] See {@link WebhookMessageOptions#content}
   * @property {FileOptions[]|string[]} [files] See {@link WebhookMessageOptions#files}
   * @property {MessageMentionOptions} [allowedMentions] See {@link WebhookMessageOptions#allowedMentions}
   */

  /**
   * Sends a message with this webhook.
   * @param {StringResolvable|APIMessage} [content=''] The content to send
   * @param {WebhookMessageOptions|MessageAdditions} [options={}] The options to provide
   * @returns {Promise<Message|Object>}
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
  async send(content, options) {
    let apiMessage;

    if (content instanceof APIMessage) {
      apiMessage = content.resolveData();
    } else {
      apiMessage = APIMessage.create(this, content, options).resolveData();
      if (Array.isArray(apiMessage.data.content)) {
        return Promise.all(apiMessage.split().map(this.send.bind(this)));
      }
    }

    const { data, files } = await apiMessage.resolveFiles();
    return this.client.api
      .webhooks(this.id, this.token)
      .post({
        data,
        files,
        query: { wait: true },
        auth: false,
      })
      .then(d => {
        const channel = this.client.channels ? this.client.channels.cache.get(d.channel_id) : undefined;
        if (!channel) return d;
        return channel.messages.add(d, false);
      });
  }

  /**
   * Sends a raw slack message with this webhook.
   * @param {Object} body The raw body to send
   * @returns {Promise<boolean>}
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
    return this.client.api
      .webhooks(this.id, this.token)
      .slack.post({
        query: { wait: true },
        auth: false,
        data: body,
      })
      .then(data => data.toString() === 'ok');
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
  async edit({ name = this.name, avatar, channel }, reason) {
    if (avatar && typeof avatar === 'string' && !avatar.startsWith('data:')) {
      avatar = await DataResolver.resolveImage(avatar);
    }
    if (channel) channel = channel instanceof Channel ? channel.id : channel;
    const data = await this.client.api.webhooks(this.id, channel ? undefined : this.token).patch({
      data: { name, avatar, channel_id: channel },
      reason,
    });

    this.name = data.name;
    this.avatar = data.avatar;
    this.channelID = data.channel_id;
    return this;
  }

  /**
   * Gets a message that was sent by this webhook.
   * @param {Snowflake|'@original'} message The ID of the message to fetch
   * @param {boolean} [cache=true] Whether to cache the message
   * @returns {Promise<Message|Object>} Returns the raw message data if the webhook was instantiated as a
   * {@link WebhookClient} or if the channel is uncached, otherwise a {@link Message} will be returned
   */
  async fetchMessage(message, cache = true) {
    const data = await this.client.api.webhooks(this.id, this.token).messages(message).get();
    return this.client.channels?.cache.get(data.channel_id)?.messages.add(data, cache) ?? data;
  }

  /**
   * Edits a message that was sent by this webhook.
   * @param {MessageResolvable|'@original'} message The message to edit
   * @param {StringResolvable|APIMessage} [content] The new content for the message
   * @param {WebhookEditMessageOptions|MessageEmbed|MessageEmbed[]} [options] The options to provide
   * @returns {Promise<Message|Object>} Returns the raw message data if the webhook was instantiated as a
   * {@link WebhookClient} or if the channel is uncached, otherwise a {@link Message} will be returned
   */
  async editMessage(message, content, options) {
    const { data, files } = await (
      content.resolveData?.() ?? APIMessage.create(this, content, options).resolveData()
    ).resolveFiles();
    const d = await this.client.api
      .webhooks(this.id, this.token)
      .messages(typeof message === 'string' ? message : message.id)
      .patch({ data, files });

    const messageManager = this.client.channels?.cache.get(d.channel_id)?.messages;
    if (!messageManager) return d;

    const existing = messageManager.cache.get(d.id);
    if (!existing) return messageManager.add(d);

    const clone = existing._clone();
    clone._patch(d);
    return clone;
  }

  /**
   * Deletes the webhook.
   * @param {string} [reason] Reason for deleting this webhook
   * @returns {Promise}
   */
  delete(reason) {
    return this.client.api.webhooks(this.id, this.token).delete({ reason });
  }

  /**
   * Delete a message that was sent by this webhook.
   * @param {MessageResolvable|'@original'} message The message to delete
   * @returns {Promise<void>}
   */
  async deleteMessage(message) {
    await this.client.api
      .webhooks(this.id, this.token)
      .messages(typeof message === 'string' ? message : message.id)
      .delete();
  }

  /**
   * The timestamp the webhook was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
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
   * The url of this webhook
   * @type {string}
   * @readonly
   */
  get url() {
    return this.client.options.http.api + this.client.api.webhooks(this.id, this.token);
  }

  /**
   * A link to the webhook's avatar.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  avatarURL({ format, size } = {}) {
    if (!this.avatar) return null;
    return this.client.rest.cdn.Avatar(this.id, this.avatar, format, size);
  }

  static applyToClass(structure) {
    for (const prop of [
      'send',
      'sendSlackMessage',
      'fetchMessage',
      'edit',
      'editMessage',
      'delete',
      'deleteMessage',
      'createdTimestamp',
      'createdAt',
      'url',
    ]) {
      Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(Webhook.prototype, prop));
    }
  }
}

module.exports = Webhook;
