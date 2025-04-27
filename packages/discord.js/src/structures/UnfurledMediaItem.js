'use strict';

/**
 * Represents a media item in a component
 */
class UnfurledMediaItem {
  constructor(data) {
    /**
     * The API data associated with this media item
     * @type {APIUnfurledMediaItem}
     */
    this.data = data;
  }

  /**
   * The URL of this media gallery item
   * @type {string}
   * @readonly
   */
  get url() {
    return this.data.url;
  }

  /**
   * Returns the API-compatible JSON for this media item
   * @returns {APIUnfurledMediaItem}
   */
  toJSON() {
    return { ...this.data };
  }
}

module.exports = UnfurledMediaItem;
