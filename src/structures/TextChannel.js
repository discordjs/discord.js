const GuildChannel = require('./GuildChannel');
const Webhook = require('./Webhook');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const Collection = require('../util/Collection');

/**
 * Represents a guild text channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.type = 'text';
    this.messages = new Collection();
    this._typing = new Map();
  }

  setup(data) {
    super.setup(data);

    /**
     * The topic of the text channel
     * @type {?string}
     */
    this.topic = data.topic;

    /**
     * If the Discord considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = Boolean(data.nsfw);

    this.lastMessageID = data.last_message_id;
  }

  /**
   * A collection of members that can see this channel, mapped by their ID
   * @type {Collection<Snowflake, GuildMember>}
   * @readonly
   */
  get members() {
    const members = new Collection();
    for (const member of this.guild.members.values()) {
      if (this.permissionsFor(member).has('READ_MESSAGES')) {
        members.set(member.id, member);
      }
    }
    return members;
  }

  /**
   * Fetch all webhooks for the channel.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   */
  fetchWebhooks() {
    return this.client.api.channels[this.id].webhooks.get().then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  /**
   * Create a webhook for the channel.
   * @param {string} name The name of the webhook
   * @param {BufferResolvable|Base64Resolvable} avatar The avatar for the webhook
   * @param {string} [reason] Reason for creating this webhook
   * @returns {Promise<Webhook>} webhook The created webhook
   * @example
   * channel.createWebhook('Snek', 'http://snek.s3.amazonaws.com/topSnek.png')
   *  .then(webhook => console.log(`Created webhook ${webhook}`))
   *  .catch(console.error)
   */
  createWebhook(name, avatar, reason) {
    if (typeof avatar === 'string' && avatar.startsWith('data:')) {
      return this.client.api.channels[this.id].webhooks.post({ data: {
        name, avatar,
      }, reason }).then(data => new Webhook(this.client, data));
    } else {
      return this.client.resolver.resolveBuffer(avatar).then(data =>
        this.createWebhook(name, this.client.resolver.resolveBase64(data) || null));
    }
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  send() {}
  fetchMessage() {}
  fetchMessages() {}
  fetchPinnedMessages() {}
  search() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  bulkDelete() {}
  acknowledge() {}
  _cacheMessage() {}
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;
