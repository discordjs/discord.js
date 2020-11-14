'use strict';

const { RangeError } = require('../errors');
const Util = require('../util/Util');

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 */
class MessageEmbed {
  /**
   * @name MessageEmbed
   * @kind constructor
   * @memberof MessageEmbed
   * @param {MessageEmbed|Object} [data={}] MessageEmbed to clone or raw embed data
   */

  constructor(data = {}, skipValidation = false) {
    this.setup(data, skipValidation);
  }

  setup(data, skipValidation) {
    /**
     * The type of this embed, either:
     * * `rich` - a rich embed
     * * `image` - an image embed
     * * `video` - a video embed
     * * `gifv` - a gifv embed
     * * `article` - an article embed
     * * `link` - a link embed
     * @type {string}
     */
    this.type = data.type || 'rich';

    /**
     * The title of this embed
     * @type {?string}
     */
    this.title = 'title' in data ? data.title : null;

    /**
     * The description of this embed
     * @type {?string}
     */
    this.description = 'description' in data ? data.description : null;

    /**
     * The URL of this embed
     * @type {?string}
     */
    this.url = 'url' in data ? data.url : null;

    /**
     * The color of this embed
     * @type {?number}
     */
    this.color = 'color' in data ? Util.resolveColor(data.color) : null;

    /**
     * The timestamp of this embed
     * @type {?number}
     */
    this.timestamp = 'timestamp' in data ? new Date(data.timestamp).getTime() : null;

    /**
     * Represents a field of a MessageEmbed
     * @typedef {Object} EmbedField
     * @property {string} name The name of this field
     * @property {string} value The value of this field
     * @property {boolean} inline If this field will be displayed inline
     */

    /**
     * The fields of this embed
     * @type {EmbedField[]}
     */
    this.fields = [];
    if (data.fields) {
      this.fields = skipValidation ? data.fields.map(Util.cloneObject) : this.constructor.normalizeFields(data.fields);
    }

    /**
     * Represents the thumbnail of a MessageEmbed
     * @typedef {Object} MessageEmbedThumbnail
     * @property {string} url URL for this thumbnail
     * @property {string} proxyURL ProxyURL for this thumbnail
     * @property {number} height Height of this thumbnail
     * @property {number} width Width of this thumbnail
     */

    /**
     * The thumbnail of this embed (if there is one)
     * @type {?MessageEmbedThumbnail}
     */
    this.thumbnail = data.thumbnail
      ? {
          url: data.thumbnail.url,
          proxyURL: data.thumbnail.proxyURL || data.thumbnail.proxy_url,
          height: data.thumbnail.height,
          width: data.thumbnail.width,
        }
      : null;

    /**
     * Represents the image of a MessageEmbed
     * @typedef {Object} MessageEmbedImage
     * @property {string} url URL for this image
     * @property {string} proxyURL ProxyURL for this image
     * @property {number} height Height of this image
     * @property {number} width Width of this image
     */

    /**
     * The image of this embed, if there is one
     * @type {?MessageEmbedImage}
     */
    this.image = data.image
      ? {
          url: data.image.url,
          proxyURL: data.image.proxyURL || data.image.proxy_url,
          height: data.image.height,
          width: data.image.width,
        }
      : null;

    /**
     * Represents the video of a MessageEmbed
     * @typedef {Object} MessageEmbedVideo
     * @property {string} url URL of this video
     * @property {string} proxyURL ProxyURL for this video
     * @property {number} height Height of this video
     * @property {number} width Width of this video
     */

    /**
     * The video of this embed (if there is one)
     * @type {?MessageEmbedVideo}
     * @readonly
     */
    this.video = data.video
      ? {
          url: data.video.url,
          proxyURL: data.video.proxyURL || data.video.proxy_url,
          height: data.video.height,
          width: data.video.width,
        }
      : null;

    /**
     * Represents the author field of a MessageEmbed
     * @typedef {Object} MessageEmbedAuthor
     * @property {string} name The name of this author
     * @property {string} url URL of this author
     * @property {string} iconURL URL of the icon for this author
     * @property {string} proxyIconURL Proxied URL of the icon for this author
     */

    /**
     * The author of this embed (if there is one)
     * @type {?MessageEmbedAuthor}
     */
    this.author = data.author
      ? {
          name: data.author.name,
          url: data.author.url,
          iconURL: data.author.iconURL || data.author.icon_url,
          proxyIconURL: data.author.proxyIconURL || data.author.proxy_icon_url,
        }
      : null;

    /**
     * Represents the provider of a MessageEmbed
     * @typedef {Object} MessageEmbedProvider
     * @property {string} name The name of this provider
     * @property {string} url URL of this provider
     */

    /**
     * The provider of this embed (if there is one)
     * @type {?MessageEmbedProvider}
     */
    this.provider = data.provider
      ? {
          name: data.provider.name,
          url: data.provider.name,
        }
      : null;

    /**
     * Represents the footer field of a MessageEmbed
     * @typedef {Object} MessageEmbedFooter
     * @property {string} text The text of this footer
     * @property {string} iconURL URL of the icon for this footer
     * @property {string} proxyIconURL Proxied URL of the icon for this footer
     */

    /**
     * The footer of this embed
     * @type {?MessageEmbedFooter}
     */
    this.footer = data.footer
      ? {
          text: data.footer.text,
          iconURL: data.footer.iconURL || data.footer.icon_url,
          proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
        }
      : null;

    /**
     * The files of this embed
     * @type {Array<FileOptions|string|MessageAttachment>}
     */
    this.files = data.files || [];
  }

  /**
   * The date displayed on this embed
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash
   * @type {?string}
   * @readonly
   */
  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  /**
   * The accumulated length for the embed title, description, fields and footer text
   * @type {number}
   * @readonly
   */
  get length() {
    return (
      (this.title ? this.title.length : 0) +
      (this.description ? this.description.length : 0) +
      (this.fields.length >= 1
        ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0)
        : 0) +
      (this.footer ? this.footer.text.length : 0)
    );
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of this field
   * @param {StringResolvable} value The value of this field
   * @param {boolean} [inline=false] If this field will be displayed inline
   * @returns {MessageEmbed}
   */
  addField(name, value, inline) {
    return this.addFields({ name, value, inline });
  }

  /**
   * Adds fields to the embed (max 25).
   * @param {...EmbedFieldData|EmbedFieldData[]} fields The fields to add
   * @returns {MessageEmbed}
   */
  addFields(...fields) {
    this.fields.push(...this.constructor.normalizeFields(fields));
    return this;
  }

  /**
   * Removes, replaces, and inserts fields in the embed (max 25).
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of fields to remove
   * @param {...EmbedFieldData|EmbedFieldData[]} [fields] The replacing field objects
   * @returns {MessageEmbed}
   */
  spliceFields(index, deleteCount, ...fields) {
    this.fields.splice(index, deleteCount, ...this.constructor.normalizeFields(...fields));
    return this;
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Multiple files can be attached.
   * @param {Array<FileOptions|string|MessageAttachment>} files Files to attach
   * @returns {MessageEmbed}
   */
  attachFiles(files) {
    this.files = this.files.concat(files);
    return this;
  }

  /**
   * Sets the author of this embed.
   * @param {StringResolvable} name The name of the author
   * @param {string} [iconURL] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {MessageEmbed}
   */
  setAuthor(name, iconURL, url) {
    this.author = { name: Util.resolveString(name), iconURL, url };
    return this;
  }

  /**
   * Sets the color of this embed.
   * @param {ColorResolvable} color The color of the embed
   * @returns {MessageEmbed}
   */
  setColor(color) {
    this.color = Util.resolveColor(color);
    return this;
  }

  /**
   * Sets the description of this embed.
   * @param {StringResolvable} description The description
   * @returns {MessageEmbed}
   */
  setDescription(description) {
    description = Util.resolveString(description);
    this.description = description;
    return this;
  }

  /**
   * Sets the footer of this embed.
   * @param {StringResolvable} text The text of the footer
   * @param {string} [iconURL] The icon URL of the footer
   * @returns {MessageEmbed}
   */
  setFooter(text, iconURL) {
    text = Util.resolveString(text);
    this.footer = { text, iconURL };
    return this;
  }

  /**
   * Sets the image of this embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the thumbnail of this embed.
   * @param {string} url The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param {Date|number} [timestamp=Date.now()] The timestamp or date
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Sets the title of this embed.
   * @param {StringResolvable} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    title = Util.resolveString(title);
    this.title = title;
    return this;
  }

  /**
   * Sets the URL of this embed.
   * @param {string} url The URL
   * @returns {MessageEmbed}
   */
  setURL(url) {
    this.url = url;
    return this;
  }

  /**
   * Transforms the embed to a plain object.
   * @returns {Object} The raw data of this embed
   */
  toJSON() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author
        ? {
            name: this.author.name,
            url: this.author.url,
            icon_url: this.author.iconURL,
          }
        : null,
      footer: this.footer
        ? {
            text: this.footer.text,
            icon_url: this.footer.iconURL,
          }
        : null,
    };
  }

  /**
   * Normalizes field input and resolves strings.
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {EmbedField}
   */
  static normalizeField(name, value, inline = false) {
    name = Util.resolveString(name);
    if (!name) throw new RangeError('EMBED_FIELD_NAME');
    value = Util.resolveString(value);
    if (!value) throw new RangeError('EMBED_FIELD_VALUE');
    return { name, value, inline };
  }

  /**
   * @typedef {Object} EmbedFieldData
   * @property {StringResolvable} name The name of this field
   * @property {StringResolvable} value The value of this field
   * @property {boolean} [inline] If this field will be displayed inline
   */

  /**
   * Normalizes field input and resolves strings.
   * @param  {...EmbedFieldData|EmbedFieldData[]} fields Fields to normalize
   * @returns {EmbedField[]}
   */
  static normalizeFields(...fields) {
    return fields
      .flat(2)
      .map(field =>
        this.normalizeField(
          field && field.name,
          field && field.value,
          field && typeof field.inline === 'boolean' ? field.inline : false,
        ),
      );
  }
}

module.exports = MessageEmbed;
