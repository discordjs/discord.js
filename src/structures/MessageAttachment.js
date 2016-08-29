/**
 * Represents an Attachment in a Message
 */
class MessageAttachment {
  constructor(message, data) {
    /**
     * The Client that instantiated this Message.
     * @type {Client}
     */
    this.client = message.client;
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
     * @type {String}
     */
    this.id = data.id;
    /**
     * The file name of this attachment
     * @type {String}
     */
    this.filename = data.filename;
    /**
     * The size of this attachment in bytes
     * @type {Number}
     */
    this.filesize = data.size;
    /**
     * The URL to this attachment
     * @type {String}
     */
    this.url = data.url;
    /**
     * The Proxy URL to this attachment
     * @type {String}
     */
    this.proxyURL = data.url;
    /**
     * The height of this attachment (if an image)
     * @type {?Number}
     */
    this.height = data.height;
    /**
     * The width of this attachment (if an image)
     * @type {?Number}
     */
    this.width = data.width;
  }
}

module.exports = MessageAttachment;
