'use strict';

const MessagePayload = require('./MessagePayload');
const { Error } = require('../errors');
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
     * The token for the webhook, unavailable for follower webhooks and webhooks owned by another application.
     * @name Webhook#token
     * @type {?string}
     */
    Object.defineProperty(this, 'token', { value: data.token ?? null, writable: true, configurable: true });

    /**
     * The avatar for the webhook
     * @type {?string}
     */
    this.avatar = data.avatar;

    /**
     * The webhook's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The type of the webhook
     * @type {WebhookType}
     */
    this.type = WebhookTypes[data.type];

    /**
     * The guild the webhook belongs to
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    /**
     * The channel the webhook belongs to
     * @type {Snowflake}
     */
    this.channelId = data.channel_id;

    /**
     * The owner of the webhook
     * @type {?(User|APIUser)}
     */
    this.owner = data.user ? this.client.users?._add(data.user) ?? data.user : null;

    /**
     * The source guild of the webhook
     * @type {?(Guild|APIGuild)}
     */
    this.sourceGuild = data.source_guild
      ? this.client.guilds?._add(data.source_guild, false) ?? data.source_guild
      : null;

    /**
     * The source channel of the webhook
     * @type {?(Channel|APIChannel)}
     */
    this.sourceChannel = this.client.channels?.resolve(data.source_channel?.id) ?? data.source_channel ?? null;
  }

  /**
   * Options that can be passed into send.
   * @typedef {BaseMessageOptions} WebhookMessageOptions
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {Snowflake} [threadId] The id of the thread in the channel to send to.
   * <info>For interaction webhooks, this property is ignored</info>
   */

  /**
   * Options that can be passed into editMessage.
   * @typedef {Object} WebhookEditMessageOptions
   * @property {MessageEmbed[]|APIEmbed[]} [embeds] See {@link WebhookMessageOptions#embeds}
   * @property {string} [content] See {@link BaseMessageOptions#content}
   * @property {FileOptions[]|BufferResolvable[]|MessageAttachment[]} [files] See {@link BaseMessageOptions#files}
   * @property {MessageMentionOptions} [allowedMentions] See {@link BaseMessageOptions#allowedMentions}
   * @property {MessageActionRow[]|MessageActionRowOptions[]} [components]
   * Action rows containing interactive components for the message (buttons, select menus)
   */

  /**
   * Sends a message with this webhook.
   * @param {string|MessagePayload|WebhookMessageOptions} options The options to provide
   * @returns {Promise<Message|APIMessage>}
   * @example
   * // Send a basic message
   * webhook.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   * @example
   * // Send a basic message in a thread
   * webhook.send({ content: 'hello!', threadId: '836856309672348295' })
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
   * webhook.send({
   *   content: 'This is an embed',
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
  async send(options) {
    if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveData();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveData();
    }

    const { data, files } = await messagePayload.resolveFiles();
    const d = await this.client.api.webhooks(this.id, this.token).post({
      data,
      files,
      query: { thread_id: messagePayload.options.threadId, wait: true },
      auth: false,
    });
    return this.client.channels?.cache.get(d.channel_id)?.messages._add(d, false) ?? d;
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
   * @see {@link https://api.slack.com/messaging/webhooks}
   */
  async sendSlackMessage(body) {
    if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');

    const data = await this.client.api.webhooks(this.id, this.token).slack.post({
      query: { wait: true },
      auth: false,
      data: body,
    });
    return data.toString() === 'ok';
  }

  /**
   * Options used to edit a {@link Webhook}.
   * @typedef {Object} WebhookEditData
   * @property {string} [name=this.name] The new name for the webhook
   * @property {BufferResolvable} [avatar] The new avatar for the webhook
   * @property {GuildTextChannelResolvable} [channel] The new channel for the webhook
   */

  /**
   * Edits this webhook.
   * @param {WebhookEditData} options Options for editing the webhook
   * @param {string} [reason] Reason for editing the webhook
   * @returns {Promise<Webhook>}
   */
  async edit({ name = this.name, avatar, channel }, reason) {
    if (avatar && !(typeof avatar === 'string' && avatar.startsWith('data:'))) {
      avatar = await DataResolver.resolveImage(avatar);
    }
    if (channel) channel = channel?.id ?? channel;
    const data = await this.client.api.webhooks(this.id, channel ? undefined : this.token).patch({
      data: { name, avatar, channel_id: channel },
      reason,
    });

    this.name = data.name;
    this.avatar = data.avatar;
    this.channelId = data.channel_id;
    return this;
  }

  /**
   * Gets a message that was sent by this webhook.
   * @param {Snowflake|'@original'} message The id of the message to fetch
   * @param {boolean} [cache=true] Whether to cache the message
   * @returns {Promise<Message|APIMessage>} Returns the raw message data if the webhook was instantiated as a
   * {@link WebhookClient} or if the channel is uncached, otherwise a {@link Message} will be returned
   */
  async fetchMessage(message, cache = true) {
    if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');

    const data = await this.client.api.webhooks(this.id, this.token).messages(message).get();
    return this.client.channels?.cache.get(data.channel_id)?.messages._add(data, cache) ?? data;
  }

  /**
   * Edits a message that was sent by this webhook.
   * @param {MessageResolvable|'@original'} message The message to edit
   * @param {string|MessagePayload|WebhookEditMessageOptions} options The options to provide
   * @returns {Promise<Message|APIMessage>} Returns the raw message data if the webhook was instantiated as a
   * {@link WebhookClient} or if the channel is uncached, otherwise a {@link Message} will be returned
   */
  async editMessage(message, options) {
    if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');

    let messagePayload;

    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { data, files } = await messagePayload.resolveData().resolveFiles();

    const d = await this.client.api
      .webhooks(this.id, this.token)
      .messages(typeof message === 'string' ? message : message.id)
      .patch({ data, files });

    const messageManager = this.client.channels?.cache.get(d.channel_id)?.messages;
    if (!messageManager) return d;

    const existing = messageManager.cache.get(d.id);
    if (!existing) return messageManager._add(d);

    const clone = existing._clone();
    clone._patch(d);
    return clone;
  }

  /**
   * Deletes the webhook.
   * @param {string} [reason] Reason for deleting this webhook
   * @returns {Promise<void>}
   */
  async delete(reason) {
    await this.client.api.webhooks(this.id, this.token).delete({ reason });
  }

  /**
   * Delete a message that was sent by this webhook.
   * @param {MessageResolvable|'@original'} message The message to delete
   * @returns {Promise<void>}
   */
  async deleteMessage(message) {
    if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');

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
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  avatarURL({ format, size } = {}) {
    if (!this.avatar) return null;
    return this.client.rest.cdn.Avatar(this.id, this.avatar, format, size);
  }

  static applyToClass(structure, ignore = []) {
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
      if (ignore.includes(prop)) continue;
      Object.defineProperty(structure.prototype, prop, Object.getOwnPropertyDescriptor(Webhook.prototype, prop));
    }
  }
}

module.exports = Webhook;
