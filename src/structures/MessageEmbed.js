/**
 * Represents an embed in an image - e.g. preview of image
 */
class MessageEmbed {
  constructor(message, data) {
    /**
     * The message this embed is part of
     * @type {Message}
     */
    this.message = message;
    /**
     * The client that instantiated this embed
     * @type {Client}
     */
    this.client = message.client;
    this.setup(data);
  }

  setup(data) {
    /**
     * The title of this embed, if there is one
     * @type {?string}
     */
    this.title = data.title;
    /**
     * The type of this embed
     * @type {string}
     */
    this.type = data.type;
    /**
     * The description of this embed, if there is one
     * @type {?string}
     */
    this.description = data.description;
    /**
     * The URL of this embed
     * @type {string}
     */
    this.url = data.url;
    if (data.thumbnail) {
      /**
       * The thumbnail of this embed, if there is one
       * @type {MessageEmbedThumbnail}
       */
      this.thumbnail = new MessageEmbedThumbnail(this, data.thumbnail);
    }
    if (data.provider) {
      /**
       * The provider of this embed, if there is one
       * @type {MessageEmbedProvider}
       */
      this.provider = new MessageEmbedProvider(this, data.provider);
    }
  }
}

/**
 * Represents a thumbnail for a Message embed
 */
class MessageEmbedThumbnail {
  constructor(embed, data) {
    /**
     * The embed this thumbnail is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;
    this.setup(data);
  }

  setup(data) {
    /**
     * The URL for this thumbnail
     * @type {string}
     */
    this.url = data.url;
    /**
     * The Proxy URL for this thumbnail
     * @type {string}
     */
    this.proxyURL = data.proxy_url;
    /**
     * The height of the thumbnail
     * @type {number}
     */
    this.height = data.height;
    /**
     * The width of the thumbnail
     * @type {number}
     */
    this.width = data.width;
  }
}

/**
 * Represents a Provider for a Message embed
 */
class MessageEmbedProvider {
  constructor(embed, data) {
    /**
     * The embed this provider is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;
    this.setup(data);
  }

  setup(data) {
    /**
     * The name of this provider
     * @type {string}
     */
    this.name = data.name;
    /**
     * The URL of this provider
     * @type {string}
     */
    this.url = data.url;
  }
}

module.exports = MessageEmbed;
