const GuildChannel = require('./GuildChannel');
const TextBasedChannel = require('./interface/TextBasedChannel');
const Collection = require('../util/Collection');

/**
 * Represents a Server Text Channel on Discord.
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
     * The topic of the Text Channel, if there is one.
     * @type {?string}
     */
    this.topic = data.topic;

    this.lastMessageID = data.last_message_id;
  }

  /**
   * A collection of members that can see this channel, mapped by their ID.
   * @type {Collection<string, GuildMember>}
   * @readonly
   */
  get members() {
    const members = new Collection();
    for (const member of this.guild.members.values()) {
      if (this.permissionsFor(member).hasPermission('READ_MESSAGES')) {
        members.set(member.id, member);
      }
    }
    return members;
  }

  /**
   * Fetch all webhooks for the channel.
   * @returns {Promise<Collection<string, Webhook>>}
   */
  fetchWebhooks() {
    return this.client.rest.methods.getChannelWebhooks(this);
  }

  /**
   * Create a webhook for the channel.
   * @param {string} name The name of the webhook.
   * @param {FileResolvable} avatar The avatar for the webhook.
   * @returns {Promise<Webhook>} webhook The created webhook.
   * @example
   * channel.createWebhook('Snek', 'http://snek.s3.amazonaws.com/topSnek.png')
   *  .then(webhook => console.log(`Created Webhook ${webhook}`))
   *  .catch(console.error)
   */
  createWebhook(name, avatar) {
    return new Promise((resolve, reject) => {
      if (avatar) {
        this.client.resolver.resolveFile(avatar).then(file => {
          let base64 = new Buffer(file, 'binary').toString('base64');
          let dataURI = `data:;base64,${base64}`;
          this.client.rest.methods.createWebhook(this, name, dataURI).then(resolve).catch(reject);
        }).catch(reject);
      } else {
        this.client.rest.methods.createWebhook(this, name).then(resolve).catch(reject);
      }
    });
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  sendMessage() { return; }
  sendTTSMessage() { return; }
  sendFile() { return; }
  sendCode() { return; }
  fetchMessage() { return; }
  fetchMessages() { return; }
  fetchPinnedMessages() { return; }
  startTyping() { return; }
  stopTyping() { return; }
  get typing() { return; }
  get typingCount() { return; }
  createCollector() { return; }
  awaitMessages() { return; }
  bulkDelete() { return; }
  _cacheMessage() { return; }
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;
