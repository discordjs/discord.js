'use strict';

const BaseComponent = require('./BaseComponent');
const MediaGalleryItem = require('./MediaGalleryItem');

/**
 * Represents a media gallery component
 * @extends {BaseComponent}
 */
class MediaGalleryComponent extends BaseComponent {
  constructor({ items, ...data }) {
    super(data);

    /**
     * The items in this media gallery
     * @type {MediaGalleryItem[]}
     * @readonly
     */
    this.items = items.map(item => new MediaGalleryItem(item));
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIMediaGalleryComponent}
   */
  toJSON() {
    return { ...this.data, items: this.items.map(item => item.toJSON()) };
  }
}

module.exports = MediaGalleryComponent;
