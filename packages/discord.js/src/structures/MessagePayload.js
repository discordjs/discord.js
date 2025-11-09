'use strict';

const { Buffer } = require('node:buffer');
const { isJSONEncodable } = require('@discordjs/util');
const { DiscordSnowflake } = require('@sapphire/snowflake');
const { DiscordjsError, DiscordjsRangeError, ErrorCodes } = require('../errors/index.js');
const { resolveFile } = require('../util/DataResolver.js');
const { MessageFlagsBitField } = require('../util/MessageFlagsBitField.js');
const { findName, verifyString, resolvePartialEmoji } = require('../util/Util.js');

/**
 * Represents a message to be sent to the API.
 */
class MessagePayload {
  /**
   * @param {MessageTarget} target The target for this message to be sent to
   * @param {MessagePayloadOption} options The payload of this message
   */
  constructor(target, options) {
    /**
     * The target for this message to be sent to
     *
     * @type {MessageTarget}
     */
    this.target = target;

    /**
     * The payload of this message.
     *
     * @type {MessagePayloadOption}
     */
    this.options = options;

    /**
     * Body sendable to the API
     *
     * @type {?APIMessage}
     */
    this.body = null;

    /**
     * Files sendable to the API
     *
     * @type {?RawFile[]}
     */
    this.files = null;
  }

  /**
   * Whether or not the target is a {@link Webhook} or a {@link WebhookClient}
   *
   * @type {boolean}
   * @readonly
   */
  get isWebhook() {
    const { Webhook } = require('./Webhook.js');
    const { WebhookClient } = require('../client/WebhookClient.js');
    return this.target instanceof Webhook || this.target instanceof WebhookClient;
  }

  /**
   * Whether or not the target is a {@link User}
   *
   * @type {boolean}
   * @readonly
   */
  get isUser() {
    const { User } = require('./User.js');
    const { GuildMember } = require('./GuildMember.js');
    return this.target instanceof User || this.target instanceof GuildMember;
  }

  /**
   * Whether or not the target is a {@link Message}
   *
   * @type {boolean}
   * @readonly
   */
  get isMessage() {
    const { Message } = require('./Message.js');
    return this.target instanceof Message;
  }

  /**
   * Whether or not the target is a {@link MessageManager}
   *
   * @type {boolean}
   * @readonly
   */
  get isMessageManager() {
    const { MessageManager } = require('../managers/MessageManager.js');
    return this.target instanceof MessageManager;
  }

  /**
   * Makes the content of this message.
   *
   * @returns {?string}
   */
  makeContent() {
    let content;
    if (this.options.content === null) {
      content = '';
    } else if (this.options.content !== undefined) {
      content = verifyString(this.options.content, DiscordjsRangeError, ErrorCodes.MessageContentType, true);
    }

    return content;
  }

  /**
   * Resolves the body.
   *
   * @returns {MessagePayload}
   */
  resolveBody() {
    if (this.body) return this;
    const isWebhook = this.isWebhook;

    const content = this.makeContent();
    const tts = Boolean(this.options.tts);

    let nonce;
    if (this.options.nonce !== undefined) {
      nonce = this.options.nonce;
      if (typeof nonce === 'number' ? !Number.isInteger(nonce) : typeof nonce !== 'string') {
        throw new DiscordjsRangeError(ErrorCodes.MessageNonceType);
      }
    }

    let enforce_nonce = Boolean(this.options.enforceNonce);

    // If `nonce` isn't provided, generate one & set `enforceNonce`
    // Unless `enforceNonce` is explicitly set to `false`(not just falsy)
    if (nonce === undefined) {
      if (this.options.enforceNonce !== false && this.target.client.options.enforceNonce) {
        nonce = DiscordSnowflake.generate().toString();
        enforce_nonce = true;
      } else if (enforce_nonce) {
        throw new DiscordjsError(ErrorCodes.MessageNonceRequired);
      }
    }

    const components = this.options.components?.map(component =>
      isJSONEncodable(component) ? component.toJSON() : this.target.client.options.jsonTransformer(component),
    );

    let username;
    let avatarURL;
    let threadName;
    let appliedTags;
    if (isWebhook) {
      username = this.options.username ?? this.target.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
      if (this.options.threadName) threadName = this.options.threadName;
      if (this.options.appliedTags) appliedTags = this.options.appliedTags;
    }

    let flags;
    if (
      // eslint-disable-next-line eqeqeq
      this.options.flags != null
    ) {
      flags = new MessageFlagsBitField(this.options.flags).bitfield;
    }

    let allowedMentions =
      this.options.allowedMentions === undefined
        ? this.target.client.options.allowedMentions
        : this.options.allowedMentions;

    if (allowedMentions?.repliedUser !== undefined) {
      allowedMentions = { ...allowedMentions, replied_user: allowedMentions.repliedUser };
      delete allowedMentions.repliedUser;
    }

    let message_reference;
    if (this.options.messageReference) {
      const reference = this.options.messageReference;

      if (reference.messageId) {
        message_reference = {
          message_id: reference.messageId,
          channel_id: reference.channelId,
          guild_id: reference.guildId,
          type: reference.type,
          fail_if_not_exists: reference.failIfNotExists ?? this.target.client.options.failIfNotExists,
        };
      }
    }

    const attachments = this.options.files?.map((file, index) => ({
      id: index.toString(),
      description: file.description,
      title: file.title,
      waveform: file.waveform,
      duration_secs: file.duration,
    }));
    if (Array.isArray(this.options.attachments)) {
      this.options.attachments.push(...(attachments ?? []));
    } else {
      this.options.attachments = attachments;
    }

    let poll;
    if (this.options.poll) {
      poll = isJSONEncodable(this.options.poll)
        ? this.options.poll.toJSON()
        : {
            question: {
              text: this.options.poll.question.text,
            },
            answers: this.options.poll.answers.map(answer => ({
              poll_media: { text: answer.text, emoji: resolvePartialEmoji(answer.emoji) },
            })),
            duration: this.options.poll.duration,
            allow_multiselect: this.options.poll.allowMultiselect,
            layout_type: this.options.poll.layoutType,
          };
    }

    this.body = {
      content,
      tts,
      nonce,
      enforce_nonce,
      embeds: this.options.embeds?.map(embed =>
        isJSONEncodable(embed) ? embed.toJSON() : this.target.client.options.jsonTransformer(embed),
      ),
      components,
      username,
      avatar_url: avatarURL,
      allowed_mentions:
        this.isMessage && message_reference === undefined && this.target.author.id !== this.target.client.user.id
          ? undefined
          : allowedMentions,
      flags,
      message_reference,
      attachments: this.options.attachments,
      sticker_ids: this.options.stickers?.map(sticker => sticker.id ?? sticker),
      thread_name: threadName,
      applied_tags: appliedTags,
      poll,
    };
    return this;
  }

  /**
   * Resolves files.
   *
   * @returns {Promise<MessagePayload>}
   */
  async resolveFiles() {
    if (this.files) return this;

    this.files = await Promise.all(this.options.files?.map(file => this.constructor.resolveFile(file)) ?? []);
    return this;
  }

  /**
   * Resolves a single file into an object sendable to the API.
   *
   * @param {AttachmentPayload|BufferResolvable|Stream} fileLike Something that could be resolved to a file
   * @returns {Promise<RawFile>}
   */
  static async resolveFile(fileLike) {
    let attachment;
    let name;

    const ownAttachment =
      typeof fileLike === 'string' || fileLike instanceof Buffer || typeof fileLike.pipe === 'function';
    if (ownAttachment) {
      attachment = fileLike;
      name = findName(attachment);
    } else {
      attachment = fileLike.attachment;
      name = fileLike.name ?? findName(attachment);
    }

    const { data, contentType } = await resolveFile(attachment);
    return { data, name, contentType };
  }

  /**
   * Creates a {@link MessagePayload} from user-level arguments.
   *
   * @param {MessageTarget} target Target to send to
   * @param {string|MessagePayloadOption} options Options or content to use
   * @param {MessagePayloadOption} [extra={}] Extra options to add onto specified options
   * @returns {MessagePayload}
   */
  static create(target, options, extra = {}) {
    return new this(
      target,
      typeof options !== 'object' || options === null ? { content: options, ...extra } : { ...options, ...extra },
    );
  }
}

exports.MessagePayload = MessagePayload;

/**
 * A target for a message.
 *
 * @typedef {TextBasedChannels|ChannelManager|Webhook|WebhookClient|BaseInteraction|InteractionWebhook|
 * Message|MessageManager} MessageTarget
 */

/**
 * A possible payload option.
 *
 * @typedef {MessageCreateOptions|MessageEditOptions|WebhookMessageCreateOptions|WebhookMessageEditOptions|
 * InteractionReplyOptions|InteractionUpdateOptions} MessagePayloadOption
 */

/**
 * @external RawFile
 * @see {@link https://discord.js.org/docs/packages/rest/stable/RawFile:Interface}
 */
