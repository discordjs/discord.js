'use strict';

const GuildChannel = require('./GuildChannel');
const Webhook = require('./Webhook');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const Collection = require('../util/Collection');
const DataResolver = require('../util/DataResolver');
const MessageStore = require('../stores/MessageStore');

/**
 * Represents a guild text channel on Discord.
 * @extends {GuildChannel}
 * @implements {TextBasedChannel}
 */
class TextChannel extends GuildChannel {
  /**
   * @param {Guild} guild The guild the text channel is part of
   * @param {Object} data The data for the text channel
   */
  constructor(guild, data) {
    super(guild, data);
    /**
     * A collection containing the messages sent to this channel
     * @type {MessageStore<Snowflake, Message>}
     */
    this.messages = new MessageStore(this);
    this._typing = new Map();
  }

  _patch(data) {
    super._patch(data);

    /**
     * The topic of the text channel
     * @type {?string}
     */
    this.topic = data.topic;

    /**
     * If the guild considers this channel NSFW
     * @type {boolean}
     * @readonly
     */
    this.nsfw = data.nsfw || /^nsfw(-|$)/.test(this.name);

    /**
     * The ID of the last message sent in this channel, if one was sent
     * @type {?Snowflake}
     */
    this.lastMessageID = data.last_message_id;

    /**
     * The ratelimit per user for this channel in seconds
     * @type {number}
     */
    this.rateLimitPerUser = data.rate_limit_per_user || 0;

    /**
     * The timestamp when the last pinned message was pinned, if there was one
     * @type {?number}
     */
    this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp).getTime() : null;

    if (data.messages) for (const message of data.messages) this.messages.add(message);
  }

  /**
   * Sets the rate limit per user for this channel.
   * @param {number} rateLimitPerUser The new ratelimit in seconds
   * @param {string} [reason] Reason for changing the channel's ratelimits
   * @returns {Promise<TextChannel>}
   */
  setRateLimitPerUser(rateLimitPerUser, reason) {
    return this.edit({ rateLimitPerUser }, reason);
  }

  /**
   * Sets whether this channel is flagged as NSFW.
   * @param {boolean} nsfw Whether the channel should be considered NSFW
   * @param {string} [reason] Reason for changing the channel's NSFW flag
   * @returns {Promise<TextChannel>}
   */
  setNSFW(nsfw, reason) {
    return this.edit({ nsfw }, reason);
  }

  /**
   * Creates an invite to this guild channel.
   * @param {Object} [options={}] Options for the invite
   * @param {boolean} [options.temporary=false] Whether members that joined via the invite should be automatically
   * kicked after 24 hours if they have not yet received a role
   * @param {number} [options.maxAge=86400] How long the invite should last (in seconds, 0 for forever)
   * @param {number} [options.maxUses=0] Maximum number of uses
   * @param {boolean} [options.unique=false] Create a unique invite, or use an existing one with similar settings
   * @param {string} [options.reason] Reason for creating this
   * @returns {Promise<Invite>}
   * @example
   * // Create an invite to a channel
   * channel.createInvite()
   *   .then(invite => console.log(`Created an invite with a code of ${invite.code}`))
   *   .catch(console.error);
   */
  createInvite({ temporary = false, maxAge = 86400, maxUses = 0, unique, reason } = {}) {
    return this.client.api.channels(this.id).invites.post({ data: {
      temporary, max_age: maxAge, max_uses: maxUses, unique,
    }, reason })
      .then(invite => new Invite(this.client, invite));
  }

  /**
   * Fetches a collection of invites to this guild channel.
   * Resolves with a collection mapping invites by their codes.
   * @returns {Promise<Collection<string, Invite>>}
   */
  async fetchInvites() {
    const inviteItems = await this.client.api.channels(this.id).invites.get();
    const invites = new Collection();
    for (const inviteItem of inviteItems) {
      const invite = new Invite(this.client, inviteItem);
      invites.set(invite.code, invite);
    }
    return invites;
  }

  /**
   * Fetches all webhooks for the channel.
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   * @example
   * // Fetch webhooks
   * channel.fetchWebhooks()
   *   .then(hooks => console.log(`This channel has ${hooks.size} hooks`))
   *   .catch(console.error);
   */
  fetchWebhooks() {
    return this.client.api.channels[this.id].webhooks.get().then(data => {
      const hooks = new Collection();
      for (const hook of data) hooks.set(hook.id, new Webhook(this.client, hook));
      return hooks;
    });
  }

  /**
   * Creates a webhook for the channel.
   * @param {string} name The name of the webhook
   * @param {Object} [options] Options for creating the webhook
   * @param {BufferResolvable|Base64Resolvable} [options.avatar] Avatar for the webhook
   * @param {string} [options.reason] Reason for creating the webhook
   * @returns {Promise<Webhook>} webhook The created webhook
   * @example
   * // Create a webhook for the current channel
   * channel.createWebhook('Snek', {
   *   avatar: 'https://i.imgur.com/mI8XcpG.jpg',
   *   reason: 'Needed a cool new Webhook'
   * })
   *   .then(console.log)
   *   .catch(console.error)
   */
  async createWebhook(name, { avatar, reason } = {}) {
    if (typeof avatar === 'string' && !avatar.startsWith('data:')) {
      avatar = await DataResolver.resolveImage(avatar);
    }
    return this.client.api.channels[this.id].webhooks.post({ data: {
      name, avatar,
    }, reason }).then(data => new Webhook(this.client, data));
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  get lastMessage() {}
  get lastPinAt() {}
  send() {}
  startTyping() {}
  stopTyping() {}
  get typing() {}
  get typingCount() {}
  createMessageCollector() {}
  awaitMessages() {}
  bulkDelete() {}
  acknowledge() {}
}

TextBasedChannel.applyToClass(TextChannel, true);

module.exports = TextChannel;
