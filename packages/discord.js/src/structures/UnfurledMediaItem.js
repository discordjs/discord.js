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
   * The id of the uploaded attachment
   * <info>Only present if the media item was uploaded as an attachment.</info>
   *
   * @type {?Snowflake}
   * @readonly
   */
  get attachmentId() {
    return this.data.attachment_id ?? null;
  }

  /**
   * The media (MIME) type of the content
   *
   * @type {?string}
   * @readonly
   * @see {@link https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types}
   */
  get contentType() {
    return this.data.content_type ?? null;
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
   * 	The height of this media item (if image or video)
   *
   * @type {?number}
   * @readonly
   */
  get height() {
    return this.data.height ?? null;
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
   * The proxied URL of this media item
   *
   * @type {?string}
   * @readonly
   */
  get proxyURL() {
    return this.data.proxy_url ?? null;
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
   * The width of this media item (if image or video)
   *
   * @type {?number}
   * @readonly
   */
  get width() {
    return this.data.width ?? null;
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
