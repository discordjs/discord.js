'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const MessageEmbed = require('./MessageEmbed');
const { Error, RangeError } = require('../errors');
const { MessageComponentTypes } = require('../util/Constants');
const DataResolver = require('../util/DataResolver');
const MessageFlags = require('../util/MessageFlags');
const Util = require('../util/Util');

/**
 * Represents a message to be sent to the API.
 */
class MessageBuilder {
  /**
   * @param {MessageTarget} target - The target for this message to be sent to
   * @param {MessageOptions|WebhookMessageOptions} [options={}] - Options passed in from send
   */
  constructor(target, options = {}) {
    /**
     * The target for this message to be sent to
     * @type {MessageTarget}
     */
    this.target = target;

    /**
     * Options passed in from send
     * @type {MessageOptions|WebhookMessageOptions}
     */
    this.options = options;

    /**
     * Data sendable to the API
     * @type {?Object}
     */
    this.data = null;

    /**
     * Files sendable to the API
     * @type {?Object[]}
     */
    this.files = null;
  }

  /**
   * Whether or not the target is a webhook
   * @type {boolean}
   * @readonly
   */
  get isWebhook() {
    const Webhook = require('./Webhook');
    const WebhookClient = require('../client/WebhookClient');
    return this.target instanceof Webhook || this.target instanceof WebhookClient;
  }

  /**
   * Whether or not the target is a user
   * @type {boolean}
   * @readonly
   */
  get isUser() {
    const User = require('./User');
    const GuildMember = require('./GuildMember');
    return this.target instanceof User || this.target instanceof GuildMember;
  }

  /**
   * Whether or not the target is a message
   * @type {boolean}
   * @readonly
   */
  get isMessage() {
    const Message = require('./Message');
    return this.target instanceof Message;
  }

  /**
   * Whether or not the target is an interaction
   * @type {boolean}
   * @readonly
   */
  get isInteraction() {
    const Interaction = require('./Interaction');
    const InteractionWebhook = require('./InteractionWebhook');
    return this.target instanceof Interaction || this.target instanceof InteractionWebhook;
  }

  /**
   * Makes the content of this message.
   * @returns {?(string|string[])}
   */
  makeContent() {
    let {
      options: { content },
    } = this.setContent(this.options.content);
    if (typeof content !== 'string') return content;

    const isSplit = typeof this.options.split !== 'undefined' && this.options.split !== false;
    const isCode = typeof this.options.code !== 'undefined' && this.options.code !== false;
    const splitOptions = isSplit ? { ...this.options.split } : undefined;

    if (content) {
      if (isCode) {
        const codeName = typeof this.options.code === 'string' ? this.options.code : '';
        content = `\`\`\`${codeName}\n${Util.cleanCodeBlockContent(content)}\n\`\`\``;
        if (isSplit) {
          splitOptions.prepend = `${splitOptions.prepend || ''}\`\`\`${codeName}\n`;
          splitOptions.append = `\n\`\`\`${splitOptions.append || ''}`;
        }
      }

      if (isSplit) {
        content = Util.splitMessage(content, splitOptions);
      }
    }

    return content;
  }

  /**
   * Resolves data.
   * @returns {MessageBuilder}
   */
  resolveData() {
    if (this.data) return this;
    const isInteraction = this.isInteraction;
    const isWebhook = this.isWebhook;

    const content = this.makeContent();
    const tts = Boolean(this.options.tts);

    const {
      options: { nonce },
    } = this.setNonce(this.options.nonce);

    const components = this.options.components?.map(c =>
      BaseMessageComponent.create(
        Array.isArray(c) ? { type: MessageComponentTypes.ACTION_ROW, components: c } : c,
      ).toJSON(),
    );

    let username;
    let avatarURL;
    if (isWebhook) {
      username = this.options.username || this.target.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
    }

    let flags;
    if (this.isMessage) {
      // eslint-disable-next-line eqeqeq
      flags = this.options.flags != null ? new MessageFlags(this.options.flags).bitfield : this.target.flags.bitfield;
    } else if (isInteraction && this.options.ephemeral) {
      flags = MessageFlags.FLAGS.EPHEMERAL;
    }

    let allowedMentions =
      typeof this.options.allowedMentions === 'undefined'
        ? this.target.client.options.allowedMentions
        : this.options.allowedMentions;

    if (allowedMentions) {
      allowedMentions = Util.cloneObject(allowedMentions);
      allowedMentions.replied_user = allowedMentions.repliedUser;
      delete allowedMentions.repliedUser;
    }

    let message_reference;
    if (typeof this.options.reply === 'object') {
      const message_id = this.isMessage
        ? this.target.channel.messages.resolveID(this.options.reply.messageReference)
        : this.target.messages.resolveID(this.options.reply.messageReference);
      if (message_id) {
        message_reference = {
          message_id,
          fail_if_not_exists: this.options.reply.failIfNotExists ?? true,
        };
      }
    }

    this.data = {
      content,
      tts,
      nonce,
      embeds: this.options.embeds?.map(embed => new MessageEmbed(embed).toJSON()),
      components,
      username,
      avatar_url: avatarURL,
      allowed_mentions:
        typeof content === 'undefined' && typeof message_reference === 'undefined' ? undefined : allowedMentions,
      flags,
      message_reference,
      attachments: this.options.attachments,
    };
    return this;
  }

  /**
   * Resolves files.
   * @returns {Promise<MessageBuilder>}
   */
  async resolveFiles() {
    if (this.files) return this;

    this.files = await Promise.all(this.options.files?.map(file => this.constructor.resolveFile(file)) ?? []);
    return this;
  }

  /**
   * Converts this MessageBuilder into an array of MessageBuilders for each split content
   * @returns {MessageBuilder[]}
   */
  split() {
    if (!this.data) this.resolveData();

    if (!Array.isArray(this.data.content)) return [this];

    const apiMessages = [];

    for (let i = 0; i < this.data.content.length; i++) {
      let data;
      let opt;

      if (i === this.data.content.length - 1) {
        data = { ...this.data, content: this.data.content[i] };
        opt = { ...this.options, content: this.data.content[i] };
      } else {
        data = { content: this.data.content[i], tts: this.data.tts, allowed_mentions: this.options.allowedMentions };
        opt = { content: this.data.content[i], tts: this.data.tts, allowedMentions: this.options.allowedMentions };
      }

      const apiMessage = new MessageBuilder(this.target, opt);
      apiMessage.data = data;
      apiMessages.push(apiMessage);
    }

    return apiMessages;
  }

  /**
   * Add components to this message
   * @param {MessageActionRow[]|MessageActionRowOptions[]|(MessageActionRowComponentResolvable[])[]} components
   * Action rows containing interactive components for the message (buttons, select menus)
   * @returns {MessageBuilder}
   */
  addComponents(components) {
    this.options.components = [...(this.options.components ?? []), ...components];
    return this;
  }

  /**
   * Add embeds to this message (max 10).
   * @param {MessageEmbed[]|MessageEmbedOptions[]} embeds The embeds for the message
   * @returns {MessageBuilder}
   */
  addEmbeds(embeds) {
    this.options.embeds = [...(this.options.embeds ?? []), ...embeds];
    return this;
  }

  /**
   * Adds file attachments to this message
   * @param {FileOptions[]|BufferResolvable[]|MessageAttachment[]} files Files to send with the message
   * @returns {MessageBuilder}
   */
  addFiles(files) {
    this.options.files = [...(this.options.files ?? []), ...files];
    return this;
  }

  /**
   * Set the mentions that should be parsed for this message
   * @param {MessageMentionOptions} options Which mentions should be parsed from the message content
   * (see [here](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) for more details)
   * @returns {MessageBuilder}
   */
  setAllowedMentions(options) {
    this.options.allowedMentions = options;
    return this;
  }

  /**
   * For webhooks, set the avatar override for this message
   * @param {string} avatar The avatar URL to be used
   * @returns {MessageBuilder}
   */
  setAvatarURL(avatar) {
    if (!this.isWebhook) throw new Error('TARGET_NOT_WEBHOOK');
    this.options.avatarURL = avatar;
    return this;
  }

  /**
   * Set this message to be wrapped in a codeblock, with optional language formatting
   * @param {string|boolean} code Language for optional codeblock formatting to apply
   * @returns {MessageBuilder}
   */
  setCode(code) {
    this.options.code = code;
    return this;
  }

  /**
   * Set the content for this message
   * @param {string|null} content The content for the message
   * @returns {MessageBuilder}
   */
  setContent(content) {
    if (content === null) {
      this.options.content = '';
    } else if (typeof this.options.content !== 'undefined') {
      this.options.content = Util.verifyString(this.options.content, RangeError, 'MESSAGE_CONTENT_TYPE', false);
    }
    return this;
  }

  /**
   * Set this message to be ephemeral
   * @param {boolean} ephemeral Whether this message should be ephemeral
   * @returns {MessageBuilder}
   */
  setEphemeral(ephemeral) {
    if (!this.isInteraction) throw new Error('TARGET_NOT_INTERACTION');
    this.options.ephemeral = ephemeral;
    return this;
  }

  /**
   * Set the nonce for this message
   * @param {string | number} nonce The nonce to be used
   * @returns {MessageBuilder}
   */
  setNonce(nonce) {
    if (typeof nonce !== 'undefined') {
      if (typeof nonce === 'number' ? !Number.isInteger(nonce) : typeof nonce !== 'string') {
        throw new RangeError('MESSAGE_NONCE_TYPE');
      } else {
        this.options.nonce = nonce;
      }
    }
    return this;
  }

  /**
   * Set this message to be a reply to another message
   * @param {ReplyOptions} options The options for replying to a message
   * @returns {MessageBuilder}
   */
  setReply(options) {
    this.options.reply = options;
    return this;
  }

  /**
   * Sets whether or not the message should be split into multiple messages if
   * it exceeds the character limit. If an object is provided, these are the options for splitting the message
   * @param {boolean|SplitOptions} options Boolean, or ptions to split the message by
   * @returns {MessageBuilder}
   */
  setSplitOptions(options) {
    this.options.split = options;
    return this;
  }

  /**
   * Sets whether or not the message should be spoken aloud
   * @param {boolean} tts Whether or not the message should be spoken aloud
   * @returns {MessageBuilder}
   */
  setTTS(tts) {
    this.options.tts = tts;
    return this;
  }

  /**
   * For webhooks, set the username override for this message
   * @param {string} username The username to be used
   * @returns {MessageBuilder}
   */
  setUsername(username) {
    if (!this.isWebhook) throw new Error('TARGET_NOT_WEBHOOK');
    this.options.username = username;
    return this;
  }

  /**
   * Removes, replaces and inserts components for this message
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of components to remove
   * @param {MessageActionRow[]|MessageActionRowOptions[]|(MessageActionRowComponentResolvable[])[]} components
   * Action rows containing interactive components for the message (buttons, select menus)
   * @returns {MessageBuilder}
   */
  spliceComponents(index, deleteCount, components) {
    const _components = this.options.components ?? [];
    _components.splice(index, deleteCount, ...components);
    this.options.components = _components;
    return this;
  }

  /**
   * Removes, replaces and inserts embeds for this message (max 10).
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of embeds to remove
   * @param  {MessageEmbed[]|MessageEmbedOptions[]} embeds The replacing embed objects
   * @returns {MessageBuilder}
   */
  spliceEmbeds(index, deleteCount, embeds) {
    const _embeds = this.options.embeds ?? [];
    _embeds.splice(index, deleteCount, ...embeds);
    this.options.embeds = _embeds;
    return this;
  }

  /**
   * Remove, replaces and inserts file attachments for this message.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of files to remove
   * @param {FileOptions[]|BufferResolvable[]|MessageAttachment[]} files The replacing file objects
   * @returns {MessageBuilder}
   */
  spliceFiles(index, deleteCount, files) {
    const _files = this.options.files ?? [];
    _files.splice(index, deleteCount, ...files);
    this.options.files = _files;
    return this;
  }

  /**
   * Resolves a single file into an object sendable to the API.
   * @param {BufferResolvable|Stream|FileOptions|MessageAttachment} fileLike Something that could be resolved to a file
   * @returns {Object}
   */
  static async resolveFile(fileLike) {
    let attachment;
    let name;

    const findName = thing => {
      if (typeof thing === 'string') {
        return Util.basename(thing);
      }

      if (thing.path) {
        return Util.basename(thing.path);
      }

      return 'file.jpg';
    };

    const ownAttachment =
      typeof fileLike === 'string' || fileLike instanceof Buffer || typeof fileLike.pipe === 'function';
    if (ownAttachment) {
      attachment = fileLike;
      name = findName(attachment);
    } else {
      attachment = fileLike.attachment;
      name = fileLike.name || findName(attachment);
    }

    const resource = await DataResolver.resolveFile(attachment);
    return { attachment, name, file: resource };
  }

  /**
   * Creates a `MessageBuilder` from user-level arguments.
   * @param {MessageTarget} target Target to send to
   * @param {string|MessageOptions|WebhookMessageOptions} options Options or content to use
   * @param {MessageOptions|WebhookMessageOptions} [extra={}] - Extra options to add onto specified options
   * @returns {MessageOptions|WebhookMessageOptions}
   */
  static create(target, options, extra = {}) {
    return new this(
      target,
      typeof options !== 'object' || options === null ? { content: options, ...extra } : { ...options, ...extra },
    );
  }
}

module.exports = MessageBuilder;

/**
 * A target for a message.
 * @typedef {TextChannel|DMChannel|User|GuildMember|Webhook|WebhookClient|Interaction|InteractionWebhook} MessageTarget
 */
