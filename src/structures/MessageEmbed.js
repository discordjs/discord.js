/**
 * Represents an embed in an image - e.g. preview of image
 */
class MessageEmbed {
  constructor(message, data) {
    /**
     * The client that instantiated this embed
     * @type {Client}
     */
    this.client = message.client;
    Object.defineProperty(this, 'client', { enumerable: false, configurable: false });

    /**
     * The message this embed is part of
     * @type {Message}
     */
    this.message = message;

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

    /**
     * The fields of this embed
     * @type {Array<Object>}
     */
    this.fields = data.fields;

    /**
     * The timestamp of this embed
     * @type {Date}
     */
    this.timestamp = new Date(data.timestamp);

    /**
     * The thumbnail of this embed, if there is one
     * @type {MessageEmbedThumbnail}
     */
    this.thumbnail = data.thumbnail ? new MessageEmbedThumbnail(this, data.thumbnail) : null;

    /**
     * The author of this embed, if there is one
     * @type {MessageEmbedAuthor}
     */
    this.author = data.author ? new MessageEmbedAuthor(this, data.author) : null;

    /**
     * The provider of this embed, if there is one
     * @type {MessageEmbedProvider}
     */
    this.provider = data.provider ? new MessageEmbedProvider(this, data.provider) : null;

    /**
     * The footer of this embed
     * @type {MessageEmbedFooter}
     */
    this.footer = data.footer ? new MessageEmbedFooter(data.footer) : null;
  }
}

/**
 * Represents a thumbnail for a message embed
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
 * Represents a provider for a message embed
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

/**
 * Represents a author for a message embed
 */
class MessageEmbedAuthor {
  constructor(embed, data) {
    /**
     * The embed this author is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The name of this author
     * @type {string}
     */
    this.name = data.name;

    /**
     * The URL of this author
     * @type {string}
     */
    this.url = data.url;
  }
}

class MessageEmbedFooter {
  constructor(embed, data) {
    /**
     * The embed this footer is part of
     * @type {MessageEmbed}
     */
    this.embed = embed;

    this.setup(data);
  }

  setup(data) {
    /**
     * The text in this footer
     * @type {string}
     */
    this.text = data.text;

    /**
     * The icon URL of this footer
     * @type {string}
     */
    this.iconUrl = data.icon_url;
  }
}

MessageEmbed.Thumbnail = MessageEmbedThumbnail;
MessageEmbed.Provider = MessageEmbedProvider;
MessageEmbed.Author = MessageEmbedAuthor;
MessageEmbed.Footer = MessageEmbedFooter;

module.exports = MessageEmbed;
