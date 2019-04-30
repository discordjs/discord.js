'use strict';

const DataResolver = require('../util/DataResolver');
const MessageEmbed = require('./MessageEmbed');
const MessageAttachment = require('./MessageAttachment');
const { browser } = require('../util/Constants');
const Util = require('../util/Util');
const { RangeError } = require('../errors');

/**
 * Represents a message to be sent to the API.
 */
class APIMessage {
  /**
   * @param {MessageTarget} target - The target for this message to be sent to
   * @param {MessageOptions|WebhookMessageOptions} options - Options passed in from send
   */
  constructor(target, options) {
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
   * Makes the content of this message.
   * @returns {?(string|string[])}
   */
  makeContent() { // eslint-disable-line complexity
    const GuildMember = require('./GuildMember');

    let content;
    if (this.options.content === null) {
      content = '';
    } else if (typeof this.options.content !== 'undefined') {
      content = Util.resolveString(this.options.content);
    }

    const isSplit = typeof this.options.split !== 'undefined' && this.options.split !== false;
    const isCode = typeof this.options.code !== 'undefined' && this.options.code !== false;
    const splitOptions = isSplit ? { ...this.options.split } : undefined;

    let mentionPart = '';
    if (this.options.reply && !this.isUser && this.target.type !== 'dm') {
      const id = this.target.client.users.resolveID(this.options.reply);
      mentionPart = `<@${this.options.reply instanceof GuildMember && this.options.reply.nickname ? '!' : ''}${id}>, `;
      if (isSplit) {
        splitOptions.prepend = `${mentionPart}${splitOptions.prepend || ''}`;
      }
    }

    if (content || mentionPart) {
      if (isCode) {
        const codeName = typeof this.options.code === 'string' ? this.options.code : '';
        content = `${mentionPart}\`\`\`${codeName}\n${Util.cleanCodeBlockContent(content || '')}\n\`\`\``;
        if (isSplit) {
          splitOptions.prepend = `${splitOptions.prepend || ''}\`\`\`${codeName}\n`;
          splitOptions.append = `\n\`\`\`${splitOptions.append || ''}`;
        }
      } else if (mentionPart) {
        content = `${mentionPart}${content || ''}`;
      }

      const disableEveryone = typeof this.options.disableEveryone === 'undefined' ?
        this.target.client.options.disableEveryone :
        this.options.disableEveryone;
      if (disableEveryone) {
        content = (content || '').replace(/@(everyone|here)/g, '@\u200b$1');
      }

      if (isSplit) {
        content = Util.splitMessage(content || '', splitOptions);
      }
    }

    return content;
  }

  /**
   * Resolves data.
   * @returns {APIMessage}
   */
  resolveData() {
    if (this.data) return this;

    const content = this.makeContent();
    const tts = Boolean(this.options.tts);
    let nonce;
    if (typeof this.options.nonce !== 'undefined') {
      nonce = parseInt(this.options.nonce);
      if (isNaN(nonce) || nonce < 0) throw new RangeError('MESSAGE_NONCE_TYPE');
    }

    const embedLikes = [];
    if (this.isWebhook) {
      if (this.options.embeds) {
        embedLikes.push(...this.options.embeds);
      }
    } else if (this.options.embed) {
      embedLikes.push(this.options.embed);
    }
    const embeds = embedLikes.map(e => new MessageEmbed(e)._apiTransform());

    let username;
    let avatarURL;
    if (this.isWebhook) {
      username = this.options.username || this.target.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
    }

    this.data = {
      content,
      tts,
      nonce,
      embed: this.options.embed === null ? null : embeds[0],
      embeds,
      username,
      avatar_url: avatarURL,
    };
    return this;
  }

  /**
   * Resolves files.
   * @returns {Promise<APIMessage>}
   */
  async resolveFiles() {
    if (this.files) return this;

    const embedLikes = [];
    if (this.isWebhook) {
      if (this.options.embeds) {
        embedLikes.push(...this.options.embeds);
      }
    } else if (this.options.embed) {
      embedLikes.push(this.options.embed);
    }

    const fileLikes = [];
    if (this.options.files) {
      fileLikes.push(...this.options.files);
    }
    for (const embed of embedLikes) {
      if (embed.files) {
        fileLikes.push(...embed.files);
      }
    }

    this.files = await Promise.all(fileLikes.map(f => this.constructor.resolveFile(f)));
    return this;
  }

  /**
   * Converts this APIMessage into an array of APIMessages for each split content
   * @returns {APIMessage[]}
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
        data = { content: this.data.content[i], tts: this.data.tts };
        opt = { content: this.data.content[i], tts: this.data.tts };
      }

      const apiMessage = new APIMessage(this.target, opt);
      apiMessage.data = data;
      apiMessages.push(apiMessage);
    }

    return apiMessages;
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

    const ownAttachment = typeof fileLike === 'string' ||
      fileLike instanceof (browser ? ArrayBuffer : Buffer) ||
      typeof fileLike.pipe === 'function';
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
   * Partitions embeds and attachments.
   * @param {Array<MessageEmbed|MessageAttachment>} items Items to partition
   * @returns {Array<MessageEmbed[], MessageAttachment[]>}
   */
  static partitionMessageAdditions(items) {
    const embeds = [];
    const files = [];
    for (const item of items) {
      if (item instanceof MessageEmbed) {
        embeds.push(item);
      } else if (item instanceof MessageAttachment) {
        files.push(item);
      }
    }

    return [embeds, files];
  }

  /**
   * Transforms the user-level arguments into a final options object. Passing a transformed options object alone into
   * this method will keep it the same, allowing for the reuse of the final options object.
   * @param {StringResolvable} [content] Content to send
   * @param {MessageOptions|WebhookMessageOptions|MessageAdditions} [options={}] Options to use
   * @param {MessageOptions|WebhookMessageOptions} [extra={}] Extra options to add onto transformed options
   * @param {boolean} [isWebhook=false] Whether or not to use WebhookMessageOptions as the result
   * @returns {MessageOptions|WebhookMessageOptions}
   */
  static transformOptions(content, options, extra = {}, isWebhook = false) {
    if (!options && typeof content === 'object' && !Array.isArray(content)) {
      options = content;
      content = undefined;
    }

    if (!options) {
      options = {};
    } else if (options instanceof MessageEmbed) {
      return isWebhook ? { content, embeds: [options], ...extra } : { content, embed: options, ...extra };
    } else if (options instanceof MessageAttachment) {
      return { content, files: [options], ...extra };
    }

    if (Array.isArray(options)) {
      const [embeds, files] = this.partitionMessageAdditions(options);
      return isWebhook ? { content, embeds, files, ...extra } : { content, embed: embeds[0], files, ...extra };
    } else if (Array.isArray(content)) {
      const [embeds, files] = this.partitionMessageAdditions(content);
      if (embeds.length || files.length) {
        return isWebhook ? { embeds, files, ...extra } : { embed: embeds[0], files, ...extra };
      }
    }

    return { content, ...options, ...extra };
  }

  /**
   * Creates an `APIMessage` from user-level arguments.
   * @param {MessageTarget} target Target to send to
   * @param {StringResolvable} [content] Content to send
   * @param {MessageOptions|WebhookMessageOptions|MessageAdditions} [options={}] Options to use
   * @param {MessageOptions|WebhookMessageOptions} [extra={}] - Extra options to add onto transformed options
   * @returns {MessageOptions|WebhookMessageOptions}
   */
  static create(target, content, options, extra = {}) {
    const Webhook = require('./Webhook');
    const WebhookClient = require('../client/WebhookClient');

    const isWebhook = target instanceof Webhook || target instanceof WebhookClient;
    const transformed = this.transformOptions(content, options, extra, isWebhook);
    return new this(target, transformed);
  }
}

module.exports = APIMessage;

/**
 * A target for a message.
 * @typedef {TextChannel|DMChannel|User|GuildMember|Webhook|WebhookClient} MessageTarget
 */

/**
 * Additional items that can be sent with a message.
 * @typedef {MessageEmbed|MessageAttachment|Array<MessageEmbed|MessageAttachment>} MessageAdditions
 */
