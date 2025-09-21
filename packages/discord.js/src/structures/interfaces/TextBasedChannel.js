'use strict';

const { Collection } = require('@discordjs/collection');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { InteractionType, Routes } = require('discord-api-types/v10');
const { DiscordjsTypeError, DiscordjsError, ErrorCodes } = require('../../errors/index.js');
const { MaxBulkDeletableMessageAge } = require('../../util/Constants.js');
const { InteractionCollector } = require('../InteractionCollector.js');
// eslint-disable-next-line import-x/order
const { MessageCollector } = require('../MessageCollector.js');

/**
 * Interface for classes that have text-channel-like features.
 *
 * @interface
 */
class TextBasedChannel {
  constructor() {
    /**
     * A manager of the messages sent to this channel
     *
     * @type {GuildMessageManager}
     */
    // eslint-disable-next-line no-use-before-define
    this.messages = new GuildMessageManager(this);

    /**
     * The channel's last message id, if one was sent
     *
     * @type {?Snowflake}
     */
    this.lastMessageId = null;

    /**
     * The timestamp when the last pinned message was pinned, if there was one
     *
     * @type {?number}
     */
    this.lastPinTimestamp = null;
  }

  /**
   * The Message object of the last message in the channel, if one was sent
   *
   * @type {?Message}
   * @readonly
   */
  get lastMessage() {
    return this.messages.resolve(this.lastMessageId);
  }

  /**
   * The date when the last pinned message was pinned, if there was one
   *
   * @type {?Date}
   * @readonly
   */
  get lastPinAt() {
    return this.lastPinTimestamp && new Date(this.lastPinTimestamp);
  }

  /**
   * Represents the data for a poll answer.
   *
   * @typedef {Object} PollAnswerData
   * @property {string} text The text for the poll answer
   * @property {EmojiIdentifierResolvable} [emoji] The emoji for the poll answer
   */

  /**
   * Represents the data for a poll.
   *
   * @typedef {Object} PollData
   * @property {PollQuestionMedia} question The question for the poll
   * @property {PollAnswerData[]} answers The answers for the poll
   * @property {number} duration The duration in hours for the poll
   * @property {boolean} allowMultiselect Whether the poll allows multiple answers
   * @property {PollLayoutType} [layoutType] The layout type for the poll
   */

  /**
   * The base message options for messages.
   *
   * @typedef {Object} BaseMessageOptions
   * @property {?string} [content=''] The content for the message. This can only be `null` when editing a message.
   * @property {Array<(EmbedBuilder|Embed|APIEmbed)>} [embeds] The embeds for the message
   * @property {MessageMentionOptions} [allowedMentions] Which mentions should be parsed from the message content
   * (see {@link https://discord.com/developers/docs/resources/message#allowed-mentions-object here} for more details)
   * @property {Array<(AttachmentBuilder|Attachment|AttachmentPayload|BufferResolvable)>} [files]
   * The files to send with the message.
   * @property {Array<(ActionRowBuilder|MessageTopLevelComponent|APIMessageTopLevelComponent)>} [components]
   * Action rows containing interactive components for the message (buttons, select menus) and other
   * top-level components.
   * <info>When using components v2, the flag {@link MessageFlags.IsComponentsV2} needs to be set
   * and `content`, `embeds`, `stickers`, and `poll` cannot be used.</info>
   */

  /**
   * The base message options for messages including a poll.
   *
   * @typedef {BaseMessageOptions} BaseMessageOptionsWithPoll
   * @property {PollData} [poll] The poll to send with the message
   */

  /**
   * The options for sending a message.
   *
   * @typedef {BaseMessageOptionsWithPoll} BaseMessageCreateOptions
   * @property {boolean} [tts=false] Whether the message should be spoken aloud
   * @property {string} [nonce] The nonce for the message
   * <info>This property is required if `enforceNonce` set to `true`.</info>
   * @property {boolean} [enforceNonce] Whether the nonce should be checked for uniqueness in the past few minutes.
   * If another message was created by the same author with the same nonce,
   * that message will be returned and no new message will be created
   * @property {StickerResolvable[]} [stickers=[]] The stickers to send in the message
   * @property {MessageFlags} [flags] Which flags to set for the message.
   * <info>Only {@link MessageFlags.SuppressEmbeds}, {@link MessageFlags.SuppressNotifications},
   * {@link MessageFlags.IsComponentsV2}, and {@link MessageFlags.IsVoiceMessage} can be set.</info>
   * <info>{@link MessageFlags.IsComponentsV2} is required if passing components that aren't action rows</info>
   */

  /**
   * @typedef {MessageReference} MessageReferenceOptions
   * @property {boolean} [failIfNotExists=this.client.options.failIfNotExists] Whether to error if the
   * referenced message doesn't exist instead of sending as a normal (non-reply) message
   */

  /**
   * The options for sending a message.
   *
   * @typedef {BaseMessageCreateOptions} MessageCreateOptions
   * @property {MessageReferenceOptions} [messageReference] The options for a reference to a message
   */

  /**
   * Options provided to control parsing of mentions by Discord
   *
   * @typedef {Object} MessageMentionOptions
   * @property {MessageMentionTypes[]} [parse] Types of mentions to be parsed
   * @property {Snowflake[]} [users] Snowflakes of Users to be parsed as mentions
   * @property {Snowflake[]} [roles] Snowflakes of Roles to be parsed as mentions
   * @property {boolean} [repliedUser=true] Whether the author of the Message being replied to should be pinged
   */

  /**
   * Types of mentions to enable in MessageMentionOptions.
   * - `roles`
   * - `users`
   * - `everyone`
   *
   * @typedef {string} MessageMentionTypes
   */

  /**
   * Sends a message to this channel.
   *
   * @param {string|MessagePayload|MessageCreateOptions} options The options to provide
   * @returns {Promise<Message>}
   * @example
   * // Send a basic message
   * channel.send('hello!')
   *   .then(message => console.log(`Sent message: ${message.content}`))
   *   .catch(console.error);
   * @example
   * // Send a remote file
   * channel.send({
   *   files: ['https://github.com/discordjs.png']
   * })
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Send a local file
   * channel.send({
   *   files: [{
   *     attachment: 'entire/path/to/file.jpg',
   *     name: 'file.jpg',
   *     description: 'A description of the file'
   *   }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async send(options) {
    return this.client.channels.createMessage(this, options);
  }

  /**
   * Sends a typing indicator in the channel.
   *
   * @returns {Promise<void>} Resolves upon the typing status being sent
   * @example
   * // Start typing in a channel
   * channel.sendTyping();
   */
  async sendTyping() {
    await this.client.rest.post(Routes.channelTyping(this.id));
  }

  /**
   * Creates a Message Collector.
   *
   * @param {MessageCollectorOptions} [options={}] The options to pass to the collector
   * @returns {MessageCollector}
   * @example
   * // Create a message collector
   * const filter = message => message.content.includes('discord');
   * const collector = channel.createMessageCollector({ filter, time: 15_000 });
   * collector.on('collect', message => console.log(`Collected ${message.content}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageCollector(options = {}) {
    return new MessageCollector(this, options);
  }

  /**
   * An object containing the same properties as CollectorOptions, but a few more:
   *
   * @typedef {MessageCollectorOptions} AwaitMessagesOptions
   * @property {string[]} [errors] Stop/end reasons that cause the promise to reject
   */

  /**
   * Similar to createMessageCollector but in promise form.
   * Resolves with a collection of messages that pass the specified filter.
   *
   * @param {AwaitMessagesOptions} [options={}] Optional options to pass to the internal collector
   * @returns {Promise<Collection<Snowflake, Message>>}
   * @example
   * // Await !vote messages
   * const filter = m => m.content.startsWith('!vote');
   * // Errors: ['time'] treats ending because of the time limit as an error
   * channel.awaitMessages({ filter, max: 4, time: 60_000, errors: ['time'] })
   *   .then(collected => console.log(collected.size))
   *   .catch(collected => console.log(`After a minute, only ${collected.size} out of 4 voted.`));
   */
  async awaitMessages(options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createMessageCollector(options);
      collector.once('end', (collection, reason) => {
        if (options.errors?.includes(reason)) {
          reject(collection);
        } else {
          resolve(collection);
        }
      });
    });
  }

  /**
   * Creates a component interaction collector.
   *
   * @param {MessageComponentCollectorOptions} [options={}] Options to send to the collector
   * @returns {InteractionCollector}
   * @example
   * // Create a button interaction collector
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * const collector = channel.createMessageComponentCollector({ filter, time: 15_000 });
   * collector.on('collect', interaction => console.log(`Collected ${interaction.customId}`));
   * collector.on('end', collected => console.log(`Collected ${collected.size} items`));
   */
  createMessageComponentCollector(options = {}) {
    return new InteractionCollector(this.client, {
      ...options,
      interactionType: InteractionType.MessageComponent,
      channel: this,
    });
  }

  /**
   * Collects a single component interaction that passes the filter.
   * The Promise will reject if the time expires.
   *
   * @param {AwaitMessageComponentOptions} [options={}] Options to pass to the internal collector
   * @returns {Promise<MessageComponentInteraction>}
   * @example
   * // Collect a message component interaction
   * const filter = (interaction) => interaction.customId === 'button' && interaction.user.id === 'someId';
   * channel.awaitMessageComponent({ filter, time: 15_000 })
   *   .then(interaction => console.log(`${interaction.customId} was clicked!`))
   *   .catch(console.error);
   */
  async awaitMessageComponent(options = {}) {
    const _options = { ...options, max: 1 };
    return new Promise((resolve, reject) => {
      const collector = this.createMessageComponentCollector(_options);
      collector.once('end', (interactions, reason) => {
        const interaction = interactions.first();
        if (interaction) resolve(interaction);
        else reject(new DiscordjsError(ErrorCodes.InteractionCollectorError, reason));
      });
    });
  }

  /**
   * Bulk deletes given messages up to 2 weeks old.
   *
   * @param {Collection<Snowflake, Message>|MessageResolvable[]|number} messages
   * Messages or number of messages to delete
   * @param {boolean} [filterOld=false] Filter messages to remove those which are older than two weeks automatically
   * @returns {Promise<Snowflake[]>} Returns the deleted messages ids
   * @example
   * // Bulk delete messages
   * channel.bulkDelete(5)
   *   .then(messages => console.log(`Bulk deleted ${messages.length} messages`))
   *   .catch(console.error);
   */
  async bulkDelete(messages, filterOld = false) {
    if (Array.isArray(messages) || messages instanceof Collection) {
      let messageIds =
        messages instanceof Collection ? [...messages.keys()] : messages.map(message => message.id ?? message);

      if (filterOld) {
        messageIds = messageIds.filter(
          id => Date.now() - DiscordSnowflake.timestampFrom(id) < MaxBulkDeletableMessageAge,
        );
      }

      if (messageIds.length === 0) return [];

      if (messageIds.length === 1) {
        await this.client.rest.delete(Routes.channelMessage(this.id, messageIds[0]));
        return messageIds;
      }

      await this.client.rest.post(Routes.channelBulkDelete(this.id), { body: { messages: messageIds } });
      return messageIds;
    }

    if (!Number.isNaN(messages)) {
      const msgs = await this.messages.fetch({ limit: messages });
      return this.bulkDelete(msgs, filterOld);
    }

    throw new DiscordjsTypeError(ErrorCodes.MessageBulkDeleteType);
  }

  /**
   * Fetches all webhooks for the channel.
   *
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * channel.fetchWebhooks()
   *   .then(hooks => console.log(`This channel has ${hooks.size} hooks`))
   *   .catch(console.error);
   */
  async fetchWebhooks() {
    return this.guild.channels.fetchWebhooks(this.id);
  }

  /**
   * Options used to create a {@link Webhook}.
   *
   * @typedef {Object} ChannelWebhookCreateOptions
   * @property {string} name The name of the webhook
   * @property {?(BufferResolvable|Base64Resolvable)} [avatar] Avatar for the webhook
   * @property {string} [reason] Reason for creating the webhook
   */

  /**
   * Creates a webhook for the channel.
   *
   * @param {ChannelWebhookCreateOptions} [options] Options for creating the webhook
   * @returns {Promise<Webhook>} Returns the created Webhook
   * @example
   * // Create a webhook for the current channel
   * channel.createWebhook({
   *   name: 'Snek',
   *   avatar: 'https://i.imgur.com/mI8XcpG.jpg',
   *   reason: 'Needed a cool new Webhook'
   * })
   *   .then(console.log)
   *   .catch(console.error)
   */
  async createWebhook(options) {
    return this.guild.channels.createWebhook({ channel: this.id, ...options });
  }

  /**
   * Sets the rate limit per user (slowmode) for this channel.
   *
   * @param {number} rateLimitPerUser The new rate limit in seconds
   * @param {string} [reason] Reason for changing the channel's rate limit
   * @returns {Promise<this>}
   */
  async setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser, reason });
  }

  /**
   * Sets whether this channel is flagged as NSFW.
   *
   * @param {boolean} [nsfw=true] Whether the channel should be considered NSFW
   * @param {string} [reason] Reason for changing the channel's NSFW flag
   * @returns {Promise<this>}
   */
  async setNSFW(nsfw = true, reason = undefined) {
    return this.edit({ nsfw, reason });
  }

  static applyToClass(structure, ignore = []) {
    const props = [
      'lastMessage',
      'lastPinAt',
      'bulkDelete',
      'sendTyping',
      'createMessageCollector',
      'awaitMessages',
      'createMessageComponentCollector',
      'awaitMessageComponent',
      'fetchWebhooks',
      'createWebhook',
      'setRateLimitPerUser',
      'setNSFW',
      'send',
    ];

    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(
        structure.prototype,
        prop,
        Object.getOwnPropertyDescriptor(TextBasedChannel.prototype, prop),
      );
    }
  }
}

exports.TextBasedChannel = TextBasedChannel;

// Fixes Circular
// eslint-disable-next-line import-x/order
const { GuildMessageManager } = require('../../managers/GuildMessageManager.js');
