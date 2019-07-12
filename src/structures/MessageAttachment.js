'use strict';

const Util = require('../util/Util');

/**
 * Represents an attachment in a message.
 */
class MessageAttachment {
  /**
   * @param {BufferResolvable|Stream} attachment The file
   * @param {string} [name=null] The name of the file, if any
   * @param {Object} [data] Extra data
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

  /**
   * Sets the file of this attachment.
   * @param {BufferResolvable|Stream} attachment The file
   * @param {string} [name=null] The name of the file, if any
   * @returns {MessageAttachment} This attachment
   */
  setFile(attachment, name = null) {
    this.attachment = attachment;
    this.name = name;
    return this;
  }

  /**
   * Sets the name of this attachment.
   * @param {string} name The name of the file
   * @returns {MessageAttachment} This attachment
   */
  setName(name) {
    this.name = name;
    return this;
  }

  _patch(data) {
    /**
     * The ID of this attachment
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The size of this attachment in bytes
     * @type {number}
     */
    this.size = data.size;

    /**
     * The URL to this attachment
     * @type {string}
     */
    this.url = data.url;

    /**
     * The Proxy URL to this attachment
     * @type {string}
     */
    this.proxyURL = data.proxy_url;

    /**
     * The height of this attachment (if an image or video)
     * @type {?number}
     */
    this.height = typeof data.height !== 'undefined' ? data.height : null;

    /**
     * The width of this attachment (if an image or video)
     * @type {?number}
     */
    this.width = typeof data.width !== 'undefined' ? data.width : null;
  }

  toJSON() {
    return Util.flatten(this);
  }
}

module.exports = MessageAttachment;
