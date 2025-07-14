'use strict';

const { Emoji } = require('./Emoji');

/**
 * Parent class for {@link GuildEmoji} and {@link GuildPreviewEmoji}.
 * @extends {Emoji}
 * @abstract
 */
class BaseGuildEmoji extends Emoji {
  constructor(client, data, guild) {
    super(client, data);

    /**
     * The guild this emoji is a part of
     * @type {Guild|GuildPreview}
     */
    this.guild = guild;

    this.requiresColons = null;
    this.managed = null;
    this.available = null;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) this.name = data.name;

    if ('require_colons' in data) {
      /**
       * Whether or not this emoji requires colons surrounding it
       * @type {?boolean}
       */
      this.requiresColons = data.require_colons;
    }

    if ('managed' in data) {
      /**
       * Whether this emoji is managed by an external service
       * @type {?boolean}
       */
      this.managed = data.managed;
    }

    if ('available' in data) {
      /**
       * Whether this emoji is available
       * @type {?boolean}
       */
      this.available = data.available;
    }
  }
}

/**
 * Returns a URL for the emoji.
 * @method imageURL
 * @memberof BaseGuildEmoji
 * @instance
 * @param {EmojiURLOptions} [options] Options for the emoji URL
 * @returns {string}
 */

/**
 * Returns a URL for the emoji.
 * @name url
 * @memberof BaseGuildEmoji
 * @instance
 * @type {string}
 * @readonly
 * @deprecated Use {@link BaseGuildEmoji#imageURL} instead.
 */

/**
 * The emoji's name
 * @name name
 * @memberof BaseGuildEmoji
 * @instance
 * @type {string}
 * @readonly
 */

/**
 * Whether or not the emoji is animated
 * @name animated
 * @memberof BaseGuildEmoji
 * @instance
 * @type {boolean}
 * @readonly
 */

/**
 * The time the emoji was created at.
 * @name createdAt
 * @memberof BaseGuildEmoji
 * @instance
 * @type {Date}
 * @readonly
 */

/**
 * The timestamp the emoji was created at.
 * @name createdTimestamp
 * @memberof BaseGuildEmoji
 * @instance
 * @type {number}
 * @readonly
 */

module.exports = BaseGuildEmoji;
