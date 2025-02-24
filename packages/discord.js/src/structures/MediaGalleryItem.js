'use strict';

const UnfurledMediaItem = require('./UnfurledMediaItem');

/**
 * Represents an item in a media gallery
 */
class MediaGalleryItem {
  constructor({ media, ...data }) {
    /**
     * The API data associated with this component
     * @type {APIMediaGalleryItem}
     */
    this.data = data;

    /**
     * The media associated with this media gallery item
     * @type {UnfurledMediaItem}
     * @readonly
     */
    this.media = new UnfurledMediaItem(media);
  }

  /**
   * The description of this media gallery item
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * Whether this media gallery item is spoilered
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return this.data.spoiler ?? false;
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIMediaGalleryItem}
   */
  toJSON() {
    return { ...this.data, media: this.media.toJSON() };
  }
}

module.exports = MediaGalleryItem;
