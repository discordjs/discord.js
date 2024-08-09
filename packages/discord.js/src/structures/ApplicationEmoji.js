'use strict';

const { Emoji } = require('./Emoji');

/**
 * Represents a custom emoji.
 * @extends {Emoji}
 */
class ApplicationEmoji extends Emoji {
  constructor(client, data, application) {
    super(client, data);

    /**
     * The application this emoji originates from
     * @type {ClientApplication}
     */
    this.application = application;

    /**
     * The user who created this emoji
     * @type {?User}
     */
    this.author = null;

    this.managed = null;
    this.requiresColons = null;

    this._patch(data);
  }

  _patch(data) {
    if ('name' in data) this.name = data.name;
    if (data.user) this.author = this.client.users._add(data.user);

    if ('managed' in data) {
      /**
       * Whether this emoji is managed by an external service
       * @type {?boolean}
       */
      this.managed = data.managed;
    }

    if ('require_colons' in data) {
      /**
       * Whether or not this emoji requires colons surrounding it
       * @type {?boolean}
       */
      this.requiresColons = data.require_colons;
    }
  }

  /**
   * Fetches the author for this emoji
   * @returns {Promise<User>}
   */
  fetchAuthor() {
    return this.application.emojis.fetchAuthor(this);
  }

  /**
   * Data for editing an emoji.
   * @typedef {Object} ApplicationEmojiEditOptions
   * @property {string} [name] The name of the emoji
   */

  /**
   * Edits the emoji.
   * @param {ApplicationEmojiEditOptions} options The options to provide
   * @returns {Promise<ApplicationEmoji>}
   * @example
   * // Edit an emoji
   * emoji.edit({ name: 'newemoji' })
   *   .then(emoji => console.log(`Edited emoji ${emoji}`))
   *   .catch(console.error);
   */
  edit(options) {
    return this.application.emojis.edit(this.id, options);
  }

  /**
   * Sets the name of the emoji.
   * @param {string} name The new name for the emoji
   * @returns {Promise<ApplicationEmoji>}
   */
  setName(name) {
    return this.edit({ name });
  }

  /**
   * Deletes the emoji.
   * @returns {Promise<ApplicationEmoji>}
   */
  async delete() {
    await this.application.emojis.delete(this.id);
    return this;
  }

  /**
   * Whether this emoji is the same as another one.
   * @param {ApplicationEmoji|APIEmoji} other The emoji to compare it to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof ApplicationEmoji) {
      return (
        other.animated === this.animated &&
        other.id === this.id &&
        other.name === this.name &&
        other.managed === this.managed &&
        other.requiresColons === this.requiresColons
      );
    }

    return other.id === this.id && other.name === this.name;
  }
}

module.exports = ApplicationEmoji;
