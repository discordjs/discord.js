import { bc } from './patch.test.js';
export class Attachment {
  constructor() {}

  _patch(data) {
    bc.cover(1);
    /**
     * The attachment's id
     * @type {Snowflake}
     */
    this.id = data.id;

    if ('size' in data) {
      bc.cover(2);
      /**
       * The size of this attachment in bytes
       * @type {number}
       */
      this.size = data.size;
    }

    if ('url' in data) {
      bc.cover(3);
      /**
       * The URL to this attachment
       * @type {string}
       */
      this.url = data.url;
    }

    if ('proxy_url' in data) {
      bc.cover(4);
      /**
       * The Proxy URL to this attachment
       * @type {string}
       */
      this.proxyURL = data.proxy_url;
    }

    if ('height' in data) {
      bc.cover(5);
      /**
       * The height of this attachment (if an image or video)
       * @type {?number}
       */
      this.height = data.height;
    } else {
      bc.cover(6);
      this.height ??= null;
    }

    if ('width' in data) {
      bc.cover(7);
      /**
       * The width of this attachment (if an image or video)
       * @type {?number}
       */
      this.width = data.width;
    } else {
      bc.cover(8);
      this.width ??= null;
    }

    if ('content_type' in data) {
      bc.cover(9);
      /**
       * The media (MIME) type of this attachment
       * @type {?string}
       * @see {@link https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types}
       */
      this.contentType = data.content_type;
    } else {
      bc.cover(10);
      this.contentType ??= null;
    }

    if ('description' in data) {
      bc.cover(11);
      /**
       * The description (alt text) of this attachment
       * @type {?string}
       */
      this.description = data.description;
    } else {
      bc.cover(12);
      this.description ??= null;
    }

    /**
     * Whether this attachment is ephemeral
     * @type {boolean}
     */
    this.ephemeral = data.ephemeral ?? false;

    if ('duration_secs' in data) {
      bc.cover(13);
      /**
       * The duration of this attachment in seconds
       * <info>This will only be available if the attachment is an audio file.</info>
       * @type {?number}
       */
      this.duration = data.duration_secs;
    } else {
      bc.cover(14);
      this.duration ??= null;
    }

    if ('waveform' in data) {
      bc.cover(15);
      /**
       * The base64 encoded byte array representing a sampled waveform
       * <info>This will only be available if the attachment is an audio file.</info>
       * @type {?string}
       */
      this.waveform = data.waveform;
    } else {
      bc.cover(16);
      this.waveform ??= null;
    }

    if ('flags' in data) {
      bc.cover(17);
      /**
       * The flags of this attachment
       * @type {Readonly<AttachmentFlagsBitField>}
       */
      this.flags = new AttachmentFlagsBitField(data.flags).freeze();
    } else {
      bc.cover(18);
      this.flags ??= new AttachmentFlagsBitField().freeze();
    }

    if ('title' in data) {
      bc.cover(19);
      /**
       * The title of this attachment
       * <info>This will only be available if the attachment name contains special characters.</info>
       * @type {?string}
       */
      this.title = data.title;
    } else {
      bc.cover(20);
      this.title ??= null;
    }
  }
}
