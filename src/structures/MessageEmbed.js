/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 */
class MessageEmbed {
  constructor(message, data) {
    /**
     * The client that instantiated this embed
     * @name MessageEmbed#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: message.client });

    /**
     * The message this embed is part of
     * @type {Message}
     */
    this.message = message;

    this.setup(data);
  }

  setup(data) {
    /**
     * The type of this embed
     * @type {string}
     */
    this.type = data.type;

    /**
     * The title of this embed, if there is one
     * @type {?string}
     */
    this.title = data.title;

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
     * The color of the embed
     * @type {number}
     */
    this.color = data.color;

    /**
     * The fields of this embed
     * @type {MessageEmbedField[]}
     */
    this.fields = [];
    if (data.fields) for (const field of data.fields) this.fields.push(new MessageEmbedField(this, field));

    /**
     * The timestamp of this embed
     * @type {number}
     */
    this.createdTimestamp = data.timestamp;

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
    this.footer = data.footer ? new MessageEmbedFooter(this, data.footer) : null;
  }

  /**
   * The date this embed was created
   * @type {Date}
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash.
   * @type {string}
   * @readonly
   */
  get hexColor() {
    let col = this.color.toString(16);
    while (col.length < 6) col = `0${col}`;
    return `#${col}`;
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
 * Represents an author for a message embed
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

    /**
     * The icon URL of this author
     * @type {string}
     */
    this.iconURL = data.icon_url;
  }
}

/**
 * Represents a field for a message embed
 */
class MessageEmbedField {
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
     * The name of this field
     * @type {string}
     */
    this.name = data.name;

    /**
     * The value of this field
     * @type {string}
     */
    this.value = data.value;

    /**
     * If this field is displayed inline
     * @type {boolean}
     */
    this.inline = data.inline;
  }
}

/**
 * Represents the footer of a message embed
 */
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
    this.iconURL = data.icon_url;

    /**
     * The proxy icon URL of this footer
     * @type {string}
     */
    this.proxyIconUrl = data.proxy_icon_url;
  }
}

MessageEmbed.Thumbnail = MessageEmbedThumbnail;
MessageEmbed.Provider = MessageEmbedProvider;
MessageEmbed.Author = MessageEmbedAuthor;
MessageEmbed.Field = MessageEmbedField;
MessageEmbed.Footer = MessageEmbedFooter;

module.exports = MessageEmbed;
