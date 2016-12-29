/**
 * Represents an attachment in a message
 */
class MessageAttachment {
  constructor(message, data) {
    /**
     * The Client that instantiated this MessageAttachment.
     * @name MessageAttachment#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: message.client });

    /**
     * The message this attachment is part of.
     * @type {Message}
     */
    this.message = message;

    this.setup(data);
  }

  setup(data) {
    /**
     * The ID of this attachment
     * @type {string}
     */
    this.id = data.id;

    /**
     * The file name of this attachment
     * @type {string}
     */
    this.filename = data.filename;

    /**
     * The size of this attachment in bytes
     * @type {number}
     */
    this.filesize = data.size;

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
