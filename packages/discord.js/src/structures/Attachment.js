'use strict';

const AttachmentFlagsBitField = require('../util/AttachmentFlagsBitField.js');
const { basename, flatten } = require('../util/Util');

/**
 * @typedef {Object} AttachmentPayload
 * @property {?string} name The name of the attachment
 * @property {Stream|BufferResolvable} attachment The attachment in this payload
 * @property {?string} description The description of the attachment
 */

/**
 * Represents an attachment
 */
class Attachment {
  constructor(data) {
    this.attachment = data.url;
    /**
     * The name of this attachment
     * @type {string}
     */
    this.name = data.filename;
    this._patch(data);
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
       * The media (MIME) type of this attachment
       * @type {?string}
       * @see {@link https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types}
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

    if ('duration_secs' in data) {
      /**
       * The duration of this attachment in seconds
       * <info>This will only be available if the attachment is an audio file.</info>
       * @type {?number}
       */
      this.duration = data.duration_secs;
    } else {
      this.duration ??= null;
    }

    if ('waveform' in data) {
      /**
       * The base64 encoded byte array representing a sampled waveform
       * <info>This will only be available if the attachment is an audio file.</info>
       * @type {?string}
       */
      this.waveform = data.waveform;
    } else {
      this.waveform ??= null;
    }

    if ('flags' in data) {
      /**
       * The flags of this attachment
       * @type {Readonly<AttachmentFlagsBitField>}
       */
      this.flags = new AttachmentFlagsBitField(data.flags).freeze();
    } else {
      this.flags ??= new AttachmentFlagsBitField().freeze();
    }
  }

  /**
   * Whether or not this attachment has been marked as a spoiler
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return basename(this.url ?? this.name).startsWith('SPOILER_');
  }

  toJSON() {
    return flatten(this);
  }
}

module.exports = Attachment;
