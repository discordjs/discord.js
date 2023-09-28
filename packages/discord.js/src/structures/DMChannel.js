'use strict';

const { userMention } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v10');
const { BaseChannel } = require('./BaseChannel');
const TextBasedChannel = require('./interfaces/TextBasedChannel');
const DMMessageManager = require('../managers/DMMessageManager');
const Partials = require('../util/Partials');

/**
 * Represents a direct message channel between two users.
 * @extends {BaseChannel}
 * @implements {TextBasedChannel}
 */
class DMChannel extends BaseChannel {
  constructor(client, data) {
    super(client, data);

    // Override the channel type so partials have a known type
    this.type = ChannelType.DM;

    /**
     * A manager of the messages belonging to this channel
     * @type {DMMessageManager}
     */
    this.messages = new DMMessageManager(this);
  }

  _patch(data) {
    super._patch(data);

    if (data.recipients) {
      const recipient = data.recipients[0];

      /**
       * The recipient's id
       * @type {Snowflake}
       */
      this.recipientId = recipient.id;

      if ('username' in recipient || this.client.options.partials.includes(Partials.User)) {
        this.client.users._add(recipient);
      }
    }

    if ('last_message_id' in data) {
      /**
       * The channel's last message id, if one was sent
       * @type {?Snowflake}
       */
      this.lastMessageId = data.last_message_id;
    }

    if ('last_pin_timestamp' in data) {
      /**
       * The timestamp when the last pinned message was pinned, if there was one
       * @type {?number}
       */
      this.lastPinTimestamp = Date.parse(data.last_pin_timestamp);
    } else {
      this.lastPinTimestamp ??= null;
    }
  }

  /**
   * Whether this DMChannel is a partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.lastMessageId === undefined;
  }

  /**
   * The recipient on the other end of the DM
   * @type {?User}
   * @readonly
   */
  get recipient() {
    return this.client.users.resolve(this.recipientId);
  }

  /**
   * Fetch this DMChannel.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<DMChannel>}
   */
  fetch(force = true) {
    return this.client.users.createDM(this.recipientId, { force });
  }

  /**
   * When concatenated with a string, this automatically returns the recipient's mention instead of the
   * DMChannel object.
   * @returns {string}
   * @example
   * // Logs: Hello from <@123456789012345678>!
   * console.log(`Hello from ${channel}!`);
   */
  toString() {
    return userMention(this.recipientId);
  }

  // These are here only for documentation purposes - they are implemented by TextBasedChannel
  /* eslint-disable no-empty-function */
  get lastMessage() {}
  get lastPinAt() {}
  send() {}
  sendTyping() {}
  createMessageCollector() {}
  awaitMessages() {}
  createMessageComponentCollector() {}
  awaitMessageComponent() {}
  // Doesn't work on DM channels; bulkDelete() {}
  // Doesn't work on DM channels; fetchWebhooks() {}
  // Doesn't work on DM channels; createWebhook() {}
  // Doesn't work on DM channels; setRateLimitPerUser() {}
  // Doesn't work on DM channels; setNSFW() {}
}

TextBasedChannel.applyToClass(DMChannel, true, [
  'bulkDelete',
  'fetchWebhooks',
  'createWebhook',
  'setRateLimitPerUser',
  'setNSFW',
]);

module.exports = DMChannel;
