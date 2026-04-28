'use strict';

const { UnfurledMediaItemFlagsBitField } = require('../util/UnfurledMediaItemFlagsBitField.js');

/**
 * Represents a media item in a component
 */
class UnfurledMediaItem {
  constructor(data) {
    /**
     * The API data associated with this media item
     *
     * @type {APIUnfurledMediaItem}
     */
    this.data = data;
  }

  /**
   * The flags of this media item.
   *
   * @type {Readonly<UnfurledMediaItemFlagsBitField>}
   * @readonly
   */
  get flags() {
    return new UnfurledMediaItemFlagsBitField(this.data.flags ?? 0).freeze();
  }

  /**
   * ThumbHash placeholder (if image or video)
   *
   * @type {?string}
   * @readonly
   */
  get placeholder() {
    return this.data.placeholder ?? null;
  }

  /**
   * Version of the placeholder (if image or video)
   *
   * @type {?number}
   * @readonly
   */
  get placeholderVersion() {
    return this.data.placeholder_version ?? null;
  }

  /**
   * The URL of this media item
   *
   * @type {string}
   * @readonly
   */
  get url() {
    return this.data.url;
  }

  /**
   * Returns the API-compatible JSON for this media item
   *
   * @returns {APIUnfurledMediaItem}
   */
  toJSON() {
    return { ...this.data };
  }
}

exports.UnfurledMediaItem = UnfurledMediaItem;
