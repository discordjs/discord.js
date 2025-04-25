'use strict';

const Component = require('./Component');
const UnfurledMediaItem = require('./UnfurledMediaItem');

/**
 * Represents a thumbnail component
 * @extends {Component}
 */
class ThumbnailComponent extends Component {
  constructor({ media, ...data }) {
    super(data);

    /**
     * The media associated with this thumbnail
     * @type {UnfurledMediaItem}
     * @readonly
     */
    this.media = new UnfurledMediaItem(media);
  }

  /**
   * The description of this thumbnail
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * Whether this thumbnail is spoilered
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return this.data.spoiler ?? false;
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIThumbnailComponent}
   */
  toJSON() {
    return { ...this.data, media: this.media.toJSON() };
  }
}

module.exports = ThumbnailComponent;
