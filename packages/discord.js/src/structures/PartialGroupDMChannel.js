'use strict';

const { BaseChannel } = require('./BaseChannel');
const { DiscordjsError, ErrorCodes } = require('../errors');
const PartialGroupDMMessageManager = require('../managers/PartialGroupDMMessageManager');

/**
 * Represents a Partial Group DM Channel on Discord.
 * @extends {BaseChannel}
 */
class PartialGroupDMChannel extends BaseChannel {
  constructor(client, data) {
    super(client, data);

    // No flags are present when fetching partial group DM channels.
    this.flags = null;

    /**
     * The name of this Group DM Channel
     * @type {?string}
     */
    this.name = data.name;

    /**
     * The hash of the channel icon
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * Recipient data received in a {@link PartialGroupDMChannel}.
     * @typedef {Object} PartialRecipient
     * @property {string} username The username of the recipient
     */

    /**
     * The recipients of this Group DM Channel.
     * @type {PartialRecipient[]}
     */
    this.recipients = data.recipients;

    /**
     * A manager of the messages belonging to this channel
     * @type {PartialGroupDMMessageManager}
     */
    this.messages = new PartialGroupDMMessageManager(this);

    if ('owner_id' in data) {
      /**
       * The user id of the owner of this Group DM Channel
       * @type {?Snowflake}
       */
      this.ownerId = data.owner_id;
    } else {
      this.ownerId ??= null;
    }
  }

  /**
   * The URL to this channel's icon.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL(options = {}) {
    return this.icon && this.client.rest.cdn.channelIcon(this.id, this.icon, options);
  }

  /**
   * Fetches the owner of this Group DM Channel.
   * @param {BaseFetchOptions} [options] The options for fetching the user
   * @returns {Promise<User>}
   */
  async fetchOwner(options) {
    if (!this.ownerId) {
      throw new DiscordjsError(ErrorCodes.FetchOwnerId, 'group DM');
    }

    return this.client.users.fetch(this.ownerId, options);
  }

  delete() {
    return Promise.reject(new DiscordjsError(ErrorCodes.DeleteGroupDMChannel));
  }

  fetch() {
    return Promise.reject(new DiscordjsError(ErrorCodes.FetchGroupDMChannel));
  }
}

module.exports = PartialGroupDMChannel;
