'use strict';

const { isJSONEncodable } = require('@discordjs/builders');
const isEqual = require('fast-deep-equal');
const Util = require('../util/Util');

/**
 * Represents an attachment.
 */
class Attachment {
  /**
   * Creates a new attachment from API data
   * @param {APIAttachment} data The API attachment's data
   */
  constructor(data) {
    /**
     * The API data associated with this attachment.
     * @type {APIAttachment}
     */
    this.data = data;
  }

  /**
   * The attachment's id
   * @type {Snowflake}
   */
  get id() {
    return this.data.id ?? null;
  }

  /**
   * The media type of this attachment
   * @type {?string}
   */
  get contentType() {
    return this.data.content_type ?? this.data.contentType ?? null;
  }

  /**
   * The name of this attachment
   * @type {?string}
   */
  get name() {
    return this.data.filename ?? this.data.name ?? null;
  }

  /**
   * The description (alt text) of this attachment
   * @type {?string}
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * Whether this attachment is ephemeral
   * @type {boolean}
   */
  get ephemeral() {
    return this.data.ephemeral ?? false;
  }

  /**
   * The size of this attachment in bytes
   * @type {number}
   */
  get size() {
    return this.data.size ?? null;
  }

  /**
   * The URL to this attachment
   * @type {string}
   */
  get url() {
    return this.data.url ?? null;
  }

  /**
   * The proxy URL to this attachment
   * @type {string}
   */
  get proxyURL() {
    return this.data.proxy_url ?? this.data.proxyURL ?? null;
  }

  /**
   * The height of this attachment (if an image or video)
   * @type {?number}
   */
  get height() {
    return this.data.height ?? null;
  }

  /**
   * The width of this attachment (if an image or video)
   * @type {?number}
   */
  get width() {
    return this.data.width ?? null;
  }

  /**
   * Whether or not this attachment has been marked as a spoiler
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return Util.basename(this.url ?? this.name).startsWith('SPOILER_');
  }

  /**
   * Creates a new attachment builder from JSON data
   * @param {JSONEncodable<APIAttachment>|APIAttachment} other The other data
   * @returns {AttachmentBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }

  /**
   * Returns the API-compatible JSON for this attachment
   * @returns {APIAttachment}
   */
  toJSON() {
    return { ...this.data };
  }

  /**
   * Whether or not the given attachments are equal
   * @param {Attachment|APIAttachment} other The attachment to compare against
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof Attachment) {
      return isEqual(other.data, this.data);
    }
    return isEqual(other, this.data);
  }
}

module.exports = Attachment;

/**
 * @external APIAttachment
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object}
 */
