/**
 * Represents an attachment in a message.
 * @param {BufferResolvable|Stream} file The file
 * @param {string} [name] The name of the file, if any
 */
class MessageAttachment {
  constructor(file, name, data) {
    this.file = null;
    if (data) this._patch(data);
    if (name) this.setAttachment(file, name);
    else this._attach(file);
  }

  /**
    * The name of the file
    * @type {?string}
    * @readonly
    */
  get name() {
    return this.file.name;
  }

  /**
    * The file
    * @type {?BufferResolvable|Stream}
    * @readonly
    */
  get attachment() {
    return this.file.attachment;
  }

  /**
    * Sets the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @returns {MessageAttachment} This attachment
    */
  setAttachment(file, name) {
    this.file = { attachment: file, name };
    return this;
  }

  /**
    * Sets the file of this attachment.
    * @param {BufferResolvable|Stream} attachment The file
    * @returns {MessageAttachment} This attachment
    */
  setFile(attachment) {
    this.file = { attachment };
    return this;
  }

  /**
    * Sets the name of this attachment.
    * @param {string} name The name of the image
    * @returns {MessageAttachment} This attachment
    */
  setName(name) {
    this.file.name = name;
    return this;
  }

  /**
    * Sets the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @private
    */
  _attach(file, name) {
    if (typeof file === 'string') this.file = file;
    else this.setAttachment(file, name);
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
     * The height of this attachment (if an image)
     * @type {?number}
     */
    this.height = data.height;

    /**
     * The width of this attachment (if an image)
     * @type {?number}
     */
    this.width = data.width;
  }
}

module.exports = MessageAttachment;
