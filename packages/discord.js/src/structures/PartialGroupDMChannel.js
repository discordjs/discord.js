'use strict';

const { BaseChannel } = require('./BaseChannel');
const { DiscordjsError, ErrorCodes } = require('../errors');

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
  }

  /**
   * The URL to this channel's icon.
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  iconURL(options = {}) {
    return this.icon && this.client.rest.cdn.channelIcon(this.id, this.icon, options);
  }

  delete() {
    return Promise.reject(new DiscordjsError(ErrorCodes.DeleteGroupDMChannel));
  }

  fetch() {
    return Promise.reject(new DiscordjsError(ErrorCodes.FetchGroupDMChannel));
  }
}

module.exports = PartialGroupDMChannel;
