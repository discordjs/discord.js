'use strict';

const { Channel } = require('./Channel');
const { Error } = require('../errors');

/**
 * Represents a Partial Group DM Channel on Discord.
 * @extends {Channel}
 */
class PartialGroupDMChannel extends Channel {
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
   * @param {StaticImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size } = {}) {
    return this.icon && this.client.rest.cdn.GDMIcon(this.id, this.icon, format, size);
  }

  delete() {
    return Promise.reject(new Error('DELETE_GROUP_DM_CHANNEL'));
  }

  fetch() {
    return Promise.reject(new Error('FETCH_GROUP_DM_CHANNEL'));
  }
}

module.exports = PartialGroupDMChannel;
