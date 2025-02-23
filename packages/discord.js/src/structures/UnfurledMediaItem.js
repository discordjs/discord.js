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
}

module.exports = UnfurledMediaItem;
