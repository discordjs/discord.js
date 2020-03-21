'use strict';

const Emoji = require('./Emoji');

/**
 * Parent class for `GuildEmoji` and `GuildPreviewEmoji`.
 * @extends {Emoji}
 */
class BaseEmoji extends Emoji {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the emoji
   * @param {Guild} guild The guild the emoji is a part of
   */
  constructor(client, data, guild) {
    super(client, data);

    /**
     * The guild this emoji is a part of
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * Whether or not this emoji is animated
     * @type {boolean}
     */
    this.animated = data.animated;

    /**
     * The ID of this emoji
     * @type {Snowflake}
     * @name BaseEmoji#id
     */

    this._patch(data);
  }

  _patch(data) {
    if (data.name) this.name = data.name;

    /**
     * Whether or not this emoji requires colons surrounding it
     * @type {boolean}
     * @name BaseEmoji#requiresColons
     */
    if (typeof data.require_colons !== 'undefined') this.requiresColons = data.require_colons;

    /**
     * Whether this emoji is managed by an external service
     * @type {boolean}
     * @name BaseEmoji#managed
     */
    if (typeof data.managed !== 'undefined') this.managed = data.managed;

    /**
     * Whether the emoji is available
     * @type {boolean}
     * @name BaseEmoji#available
     */
    if (typeof data.available !== 'undefined') this.available = data.available;
  }

  _clone() {
    const clone = super._clone();
    return clone;
  }
}

module.exports = BaseEmoji;
