'use strict';

const { Component } = require('./Component.js');
const { MediaGalleryItem } = require('./MediaGalleryItem.js');

/**
 * Represents a media gallery component
 *
 * @extends {Component}
 */
class MediaGalleryComponent extends Component {
  constructor({ items, ...data }) {
    super(data);

    /**
     * The items in this media gallery
     *
     * @type {MediaGalleryItem[]}
     * @readonly
     */
    this.items = items.map(item => new MediaGalleryItem(item));
  }

  /**
   * Returns the API-compatible JSON for this component
   *
   * @returns {APIMediaGalleryComponent}
   */
  toJSON() {
    return { ...this.data, items: this.items.map(item => item.toJSON()) };
  }
}

exports.MediaGalleryComponent = MediaGalleryComponent;
