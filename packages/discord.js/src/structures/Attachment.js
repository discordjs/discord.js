'use strict';

const Util = require('../util/Util');

/**
 * @typedef {Object} AttachmentPayload
 * @property {?string} name
 * @property {Stream|BufferResolvable} attachment
 * @property {?string} description
 */

/**
 * Represents an attachment
 */
class Attachment {
  /**
   * @param {BufferResolvable|Stream} attachment The file
   * @param {string} [name=null] The name of the file, if any
   * @param {APIAttachment} [data] Extra data
   */
  constructor(attachment, name = null, data) {
    this.attachment = attachment;
    /**
     * The name of this attachment
     * @type {?string}
     */
    this.name = name;
    if (data) this._patch(data);
  }

  _patch(data) {
    /**
     * The attachment's id
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('size' in data) {
      /**
       * The size of this attachment in bytes
       * @type {number}
       */
      this.size = data.size;
    }

    if ('url' in data) {
      /**
       * The URL to this attachment
       * @type {string}
       */
      this.url = data.url;
    }

    if ('proxy_url' in data) {
      /**
       * The Proxy URL to this attachment
       * @type {string}
       */
      this.proxyURL = data.proxy_url;
    }

    if ('height' in data) {
      /**
       * The height of this attachment (if an image or video)
       * @type {?number}
       */
      this.height = data.height;
    } else {
      this.height ??= null;
    }

    if ('width' in data) {
      /**
       * The width of this attachment (if an image or video)
       * @type {?number}
       */
      this.width = data.width;
    } else {
      this.width ??= null;
    }

    if ('content_type' in data) {
      /**
       * The media type of this attachment
       * @type {?string}
       */
      this.contentType = data.content_type;
    } else {
      this.contentType ??= null;
    }

    if ('description' in data) {
      /**
       * The description (alt text) of this attachment
       * @type {?string}
       */
      this.description = data.description;
    } else {
      this.description ??= null;
    }

    /**
     * Whether this attachment is ephemeral
     * @type {boolean}
     */
    this.ephemeral = data.ephemeral ?? false;
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
   * Serializes this into an API-compatible payload.
   * @returns {JSONEncodable<AttachmentPayload>}
   */
  toJSON() {
    return Util.flatten(this);
  }
}

module.exports = Attachment;
