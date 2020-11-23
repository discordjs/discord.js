'use strict';

import type { FIXME } from '../types';

const Channel = require('./Channel');
const { Error: DiscordError } = require('../errors');

/**
 * Represents a Partial Group DM Channel on Discord.
 * @extends {Channel}
 */
class PartialGroupDMChannel extends Channel {
  constructor(client, data) {
    super(client, data);

    /**
     * The name of this Group DM Channel
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the channel icon
     * @type {?string}
     */
    this.icon = data.icon;
  }

  /**
   * The URL to this channel's icon.
   * @param {ImageURLOptions} [options={}] Options for the Image URL
   * @returns {?string}
   */
  iconURL({ format, size }: FIXME = {}) {
    if (!this.icon) return null;
    return this.client.rest.cdn.GDMIcon(this.id, this.icon, format, size);
  }

  delete() {
    return Promise.reject(new DiscordError('DELETE_GROUP_DM_CHANNEL'));
  }

  fetch() {
    return Promise.reject(new DiscordError('FETCH_GROUP_DM_CHANNEL'));
  }
}

export default PartialGroupDMChannel;
