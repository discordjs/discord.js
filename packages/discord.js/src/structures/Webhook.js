'use strict';

const { makeURLSearchParams } = require('@discordjs/rest');
const { lazy } = require('@discordjs/util');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { Routes, WebhookType } = require('discord-api-types/v10');
const { MessagePayload } = require('./MessagePayload.js');
const { DiscordjsError, ErrorCodes } = require('../errors/index.js');
const { resolveImage } = require('../util/DataResolver.js');

const getMessage = lazy(() => require('./Message.js').Message);

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
    if ('name' in data) {
      /**
       * The name of the webhook
       * @type {string}
       */
      this.name = data.name;
    }

    /**
     * The token for the webhook, unavailable for follower webhooks and webhooks owned by another application.
     * @name Webhook#token
     * @type {?string}
     */
    Object.defineProperty(this, 'token', {
      value: data.token ?? null,
      writable: true,
      configurable: true,
    });

    if ('avatar' in data) {
      /**
       * The avatar for the webhook
       * @type {?string}
       */
      this.avatar = data.avatar;
    }

    /**
     * The webhook's id
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('type' in data) {
      /**
       * The type of the webhook
       * @type {WebhookType}
       */
      this.type = data.type;
    }

    if ('guild_id' in data) {
      /**
       * The guild the webhook belongs to
       * @type {Snowflake}
       */
      this.guildId = data.guild_id;
    }

    if ('channel_id' in data) {
      /**
       * The id of the channel the webhook belongs to
       * @type {Snowflake}
       */
      this.channelId = data.channel_id;
    }

    if ('user' in data) {
      /**
       * The owner of the webhook
       * @type {?(User|APIUser)}
       */
      this.owner = this.client.users?._add(data.user) ?? data.user;
    } else {
      this.owner ??= null;
    }

    if ('application_id' in data) {
      /**
       * The application that created this webhook
       * @type {?Snowflake}
       */
      this.applicationId = data.application_id;
    } else {
      this.applicationId ??= null;
    }

    if ('source_guild' in data) {
      /**
       * The source guild of the webhook
       * @type {?(Guild|APIGuild)}
       */
      this.sourceGuild = this.client.guilds?.cache.get(data.source_guild.id) ?? data.source_guild;
    } else {
      this.sourceGuild ??= null;
    }

    if ('source_channel' in data) {
      /**
       * The source channel of the webhook
       * @type {?(AnnouncementChannel|APIChannel)}
       */
      this.sourceChannel = this.client.channels?.cache.get(data.source_channel?.id) ?? data.source_channel;
    } else {
      this.sourceChannel ??= null;
    }
  }

  /**
   * Options that can be passed into send.
   * @typedef {BaseMessageOptionsWithPoll} WebhookMessageCreateOptions
   * @property {boolean} [tts=false] Whether the message should be spoken aloud
   * @property {MessageFlags} [flags] Which flags to set for the message.
   * <info>Only the {@link MessageFlags.SuppressEmbeds} flag can be set.</info>
   * @property {string} [username=this.name] Username override for the message
   * @property {string} [avatarURL] Avatar URL override for the message
   * @property {Snowflake} [threadId] The id of the thread in the channel to send to.
   * <info>For interaction webhooks, this property is ignored</info>
   * @property {string} [threadName] Name of the thread to create (only available if the webhook is in a forum channel)
   * @property {Snowflake[]} [appliedTags]
   * The tags to apply to the created thread (only available if the webhook is in a forum channel)
   * @property {boolean} [withComponents] Whether to allow sending non-interactive components in the message.
   * <info>For application-owned webhooks, this property is ignored</info>
   */

  /**
   * Options that can be passed into editMessage.
   * @typedef {MessageEditOptions} WebhookMessageEditOptions
   * @property {Snowflake} [threadId] The id of the thread this message belongs to
   * <info>For interaction webhooks, this property is ignored</info>
   * @property {boolean} [withComponents] Whether to allow sending non-interactive components in the message.
   * <info>For application-owned webhooks, this property is ignored</info>
   */

  /**
   * The channel the webhook belongs to
   * @type {?(TextChannel|VoiceChannel|StageChannel|AnnouncementChannel|ForumChannel|MediaChannel)}
   * @readonly
   */
  get channel() {
    return this.client.channels.resolve(this.channelId);
  }

  /**
   * Sends a message with this webhook.
   * @param {string|MessagePayload|WebhookMessageCreateOptions} options The options to provide
   * @returns {Promise<Message>}
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
   *   files: ['https://github.com/discordjs.png']
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
    if (!this.token) throw new DiscordjsError(ErrorCodes.WebhookTokenUnavailable);

    let messagePayload;

    if (options instanceof MessagePayload) {
      messagePayload = options.resolveBody();
    } else {
      messagePayload = MessagePayload.create(this, options).resolveBody();
    }

    const query = makeURLSearchParams({
      wait: true,
      thread_id: messagePayload.options.threadId,
      with_components: messagePayload.options.withComponents,
    });

    const { body, files } = await messagePayload.resolveFiles();
    const d = await this.client.rest.post(Routes.webhook(this.id, this.token), {
      body,
      files,
      query,
      auth: false,
    });

    if (!this.client.channels) return d;
    return this.client.channels.cache.get(d.channel_id)?.messages._add(d, false) ?? new (getMessage())(this.client, d);
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
   *     'ts': Date.now() / 1_000
   *   }]
   * }).catch(console.error);
   * @see {@link https://api.slack.com/messaging/webhooks}
   */
  async sendSlackMessage(body) {
    if (!this.token) throw new DiscordjsError(ErrorCodes.WebhookTokenUnavailable);

    const data = await this.client.rest.post(Routes.webhookPlatform(this.id, this.token, 'slack'), {
      query: makeURLSearchParams({ wait: true }),
      auth: false,
      body,
    });
    return data.toString() === 'ok';
  }

  /**
   * Options used to edit a {@link Webhook}.
   * @typedef {Object} WebhookEditOptions
   * @property {string} [name=this.name] The new name for the webhook
   * @property {?(BufferResolvable)} [avatar] The new avatar for the webhook
   * @property {GuildTextChannelResolvable|VoiceChannel|StageChannel|ForumChannel|MediaChannel} [channel]
   * The new channel for the webhook
   * @property {string} [reason] Reason for editing the webhook
   */

  /**
   * Edits this webhook.
   * @param {WebhookEditOptions} options Options for editing the webhook
   * @returns {Promise<Webhook>}
   */
  async edit({ name = this.name, avatar: newAvatar, channel: newChannel, reason }) {
    let avatar = newAvatar;
    if (avatar && !(typeof avatar === 'string' && avatar.startsWith('data:'))) {
      avatar = await resolveImage(avatar);
    }
    const channel = newChannel?.id ?? newChannel;
    const data = await this.client.rest.patch(Routes.webhook(this.id, channel ? undefined : this.token), {
      body: { name, avatar, channel_id: channel },
      reason,
      auth: !this.token || Boolean(channel),
    });

    this.name = data.name;
    this.avatar = data.avatar;
    this.channelId = data.channel_id;
    return this;
  }

  /**
   * Options that can be passed into fetchMessage.
   * @typedef {options} WebhookFetchMessageOptions
   * @property {boolean} [cache=true] Whether to cache the message.
   * @property {Snowflake} [threadId] The id of the thread this message belongs to.
   * <info>For interaction webhooks, this property is ignored</info>
   */

  /**
   * Gets a message that was sent by this webhook.
   * @param {Snowflake|'@original'} message The id of the message to fetch
   * @param {WebhookFetchMessageOptions} [options={}] The options to provide to fetch the message.
   * @returns {Promise<Message>} Returns the message sent by this webhook
   */
  async fetchMessage(message, { threadId } = {}) {
    if (!this.token) throw new DiscordjsError(ErrorCodes.WebhookTokenUnavailable);

    const data = await this.client.rest.get(Routes.webhookMessage(this.id, this.token, message), {
      query: threadId ? makeURLSearchParams({ thread_id: threadId }) : undefined,
      auth: false,
    });

    if (!this.client.channels) return data;
    return (
      this.client.channels.cache.get(data.channel_id)?.messages._add(data, false) ??
      new (getMessage())(this.client, data)
    );
  }

  /**
   * Edits a message that was sent by this webhook.
   * @param {MessageResolvable|'@original'} message The message to edit
   * @param {string|MessagePayload|WebhookMessageEditOptions} options The options to provide
   * @returns {Promise<Message>} Returns the message edited by this webhook
   */
  async editMessage(message, options) {
    if (!this.token) throw new DiscordjsError(ErrorCodes.WebhookTokenUnavailable);

    let messagePayload;

    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { body, files } = await messagePayload.resolveBody().resolveFiles();

    const query = makeURLSearchParams({
      thread_id: messagePayload.options.threadId,
      with_components: messagePayload.options.withComponents,
    });

    const d = await this.client.rest.patch(
      Routes.webhookMessage(this.id, this.token, typeof message === 'string' ? message : message.id),
      {
        body,
        files,
        query,
        auth: false,
      },
    );

    const channelManager = this.client.channels;
    if (!channelManager) return d;

    const messageManager = channelManager.cache.get(d.channel_id)?.messages;
    if (!messageManager) return new (getMessage())(this.client, d);

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
  delete(reason) {
    return this.client.deleteWebhook(this.id, { token: this.token, reason });
  }

  /**
   * Delete a message that was sent by this webhook.
   * @param {MessageResolvable|'@original'} message The message to delete
   * @param {Snowflake} [threadId] The id of the thread this message belongs to
   * @returns {Promise<void>}
   */
  async deleteMessage(message, threadId) {
    if (!this.token) throw new DiscordjsError(ErrorCodes.WebhookTokenUnavailable);

    await this.client.rest.delete(
      Routes.webhookMessage(this.id, this.token, typeof message === 'string' ? message : message.id),
      {
        query: threadId ? makeURLSearchParams({ thread_id: threadId }) : undefined,
        auth: false,
      },
    );
  }

  /**
   * The timestamp the webhook was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return DiscordSnowflake.timestampFrom(this.id);
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
   * The URL of this webhook
   * @type {string}
   * @readonly
   */
  get url() {
    return this.client.options.rest.api + Routes.webhook(this.id, this.token);
  }

  /**
   * A link to the webhook's avatar.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  avatarURL(options = {}) {
    return this.avatar && this.client.rest.cdn.avatar(this.id, this.avatar, options);
  }

  /**
   * Whether this webhook is created by a user.
   * @returns {boolean}
   */
  isUserCreated() {
    return Boolean(this.type === WebhookType.Incoming && this.owner && !this.owner.bot);
  }

  /**
   * Whether this webhook is created by an application.
   * @returns {boolean}
   */
  isApplicationCreated() {
    return this.type === WebhookType.Application;
  }

  /**
   * Whether or not this webhook is a channel follower webhook.
   * @returns {boolean}
   */
  isChannelFollower() {
    return this.type === WebhookType.ChannelFollower;
  }

  /**
   * Whether or not this webhook is an incoming webhook.
   * @returns {boolean}
   */
  isIncoming() {
    return this.type === WebhookType.Incoming;
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

exports.Webhook = Webhook;
