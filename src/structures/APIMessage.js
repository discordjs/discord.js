const DataResolver = require('../util/DataResolver');
const MessageEmbed = require('./MessageEmbed');
const MessageAttachment = require('./MessageAttachment');
const { browser } = require('../util/Constants');
const Util = require('../util/Util');
const { RangeError } = require('../errors');

class APIMessage {
  constructor(channel, options) {
    this.channel = channel;
    this.options = options;
    this.data = null;
    this.files = null;
  }

  get isWebhook() {
    const Webhook = require('./Webhook');
    const WebhookClient = require('../client/WebhookClient');
    return this.channel instanceof Webhook || this.channel instanceof WebhookClient;
  }

  get isUser() {
    const User = require('./User');
    const GuildMember = require('./GuildMember');
    return this.channel instanceof User || this.channel instanceof GuildMember;
  }

  // eslint-disable-next-line complexity
  makeContent() {
    const GuildMember = require('./GuildMember');

    // eslint-disable-next-line eqeqeq
    let content = Util.resolveString(this.options.content == null ? '' : this.options.content);
    const isSplit = typeof this.options.split !== 'undefined' && this.options.split !== false;
    const isCode = typeof this.options.code !== 'undefined' && this.options.code !== false;
    const splitOptions = isSplit ? {
      prepend: this.options.split.prepend,
      append: this.options.split.append,
    } : undefined;

    let mentionPart = '';
    if (this.options.reply && !this.isUser && this.channel.type !== 'dm') {
      const id = this.channel.client.users.resolveID(this.options.reply);
      mentionPart = `<@${this.options.reply instanceof GuildMember && this.options.reply.nickname ? '!' : ''}${id}>, `;
      if (isSplit) {
        splitOptions.prepend = `${mentionPart}${splitOptions.prepend || ''}`;
      }
    }

    if (content || mentionPart) {
      if (isCode) {
        const codeName = typeof this.options.code === 'string' ? this.options.code : '';
        content = `${mentionPart}\`\`\`${codeName}\n${Util.escapeMarkdown(content, true)}\n\`\`\``;
        if (isSplit) {
          splitOptions.prepend = `${splitOptions.prepend || ''}\`\`\`${codeName}\n`;
          splitOptions.append = `\n\`\`\`${splitOptions.append || ''}`;
        }
      } else if (mentionPart) {
        content = `${mentionPart}${content}`;
      }

      const disableEveryone = typeof this.options.disableEveryone === 'undefined' ?
        this.channel.client.options.disableEveryone :
        this.options.disableEveryone;
      if (disableEveryone) {
        content = content.replace(/@(everyone|here)/g, '@\u200b$1');
      }

      if (isSplit) {
        content = Util.splitMessage(content, splitOptions);
      }
    }

    return content;
  }

  async resolve() {
    this.resolveData();
    await this.resolveFiles();
    return this;
  }

  resolveData() {
    if (this.data) {
      return this;
    }

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
      username = this.options.username || this.channel.name;
      if (this.options.avatarURL) avatarURL = this.options.avatarURL;
    }

    const data = {
      content,
      tts,
      nonce,
      embed: this.options.embed === null ? null : embeds[0],
      embeds,
      username,
      avatar_url: avatarURL,
    };

    this.data = data;
    return this;
  }

  async resolveFiles() {
    if (this.files) {
      return this;
    }

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

    if (typeof fileLike === 'string' || (!browser && Buffer.isBuffer(fileLike))) {
      attachment = fileLike;
      name = findName(attachment);
    } else {
      attachment = fileLike.attachment;
      name = fileLike.name || findName(attachment);
    }

    const resource = await DataResolver.resolveFile(attachment);
    return { attachment, name, file: resource };
  }

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

  static transformOptions(content, options, extra = {}, isWebhook = false) {
    if (!options && typeof content === 'object' && !(content instanceof Array)) {
      options = content;
      content = '';
    }

    if (!options) {
      options = {};
    }

    if (options instanceof MessageEmbed) {
      return Object.assign(isWebhook ? { content, embeds: [options] } : { content, embed: options }, extra);
    }

    if (options instanceof MessageAttachment) {
      return Object.assign({ content, files: [options] }, extra);
    }

    if (options instanceof Array) {
      const [embeds, files] = this.partitionMessageAdditions(options);
      return Object.assign(isWebhook ? { content, embeds, files } : { content, embed: embeds[0], files }, extra);
    } else if (content instanceof Array) {
      const [embeds, files] = this.partitionMessageAdditions(content);
      if (embeds.length || files.length) {
        return Object.assign(isWebhook ? { embeds, files } : { embed: embeds[0], files }, extra);
      }
    }

    return Object.assign({ content }, options, extra);
  }

  static create(channel, content, options, extra = {}) {
    const Webhook = require('./Webhook');
    const WebhookClient = require('../client/WebhookClient');

    const isWebhook = channel instanceof Webhook || channel instanceof WebhookClient;
    const transformed = this.transformOptions(content, options, extra, isWebhook);
    return new this(channel, transformed);
  }
}

module.exports = APIMessage;
