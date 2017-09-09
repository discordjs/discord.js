const MessageAttachment = require('./MessageAttachment');
const Util = require('../util/Util');
const { RangeError } = require('../errors');

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 */
class MessageEmbed {
  constructor(data = {}) {
    this.setup(data);
  }

  setup(data) { // eslint-disable-line complexity
    /**
     * The type of this embed
     * @type {string}
     */
    this.type = data.type;

    /**
     * The title of this embed
     * @type {?string}
     */
    this.title = data.title;

    /**
     * The description of this embed
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The URL of this embed
     * @type {?string}
     */
    this.url = data.url;

    /**
     * The color of the embed
     * @type {?number}
     */
    this.color = data.color;

    /**
     * The timestamp of this embed
     * @type {?number}
     */
    this.timestamp = data.timestamp ? new Date(data.timestamp).getTime() : null;

    /**
     * The fields of this embed
     * @type {Object[]}
     * @property {string} name The name of this field
     * @property {string} value The value of this field
     * @property {boolean} inline If this field will be displayed inline
     */
    this.fields = data.fields ? data.fields.map(Util.cloneObject) : [];

    /**
     * The thumbnail of this embed (if there is one)
     * @type {?Object}
     * @property {string} url URL for this thumbnail
     * @property {string} proxyURL ProxyURL for this thumbnail
     * @property {number} height Height of this thumbnail
     * @property {number} width Width of this thumbnail
     */
    this.thumbnail = data.thumbnail ? {
      url: data.thumbnail.url,
      proxyURL: data.thumbnail.proxy_url,
      height: data.height,
      width: data.width,
    } : null;

    /**
     * The image of this embed, if there is one
     * @type {?Object}
     * @property {string} url URL for this image
     * @property {string} proxyURL ProxyURL for this image
     * @property {number} height Height of this image
     * @property {number} width Width of this image
     */
    this.image = data.image ? {
      url: data.image.url,
      proxyURL: data.image.proxy_url,
      height: data.height,
      width: data.width,
    } : null;

    /**
     * The video of this embed (if there is one)
     * @type {?Object}
     * @property {string} url URL of this video
     * @property {number} height Height of this video
     * @property {number} width Width of this video
     * @readonly
     */
    this.video = data.video;

    /**
     * The author of this embed (if there is one)
     * @type {?Object}
     * @property {string} name The name of this author
     * @property {string} url URL of this author
     * @property {string} iconURL URL of the icon for this author
     * @property {string} proxyIconURL Proxied URL of the icon for this author
     */
    this.author = data.author ? {
      name: data.author.name,
      url: data.author.url,
      iconURL: data.author.iconURL || data.author.icon_url,
      proxyIconURL: data.author.proxyIconUrl || data.author.proxy_icon_url,
    } : null;

    /**
     * The provider of this embed (if there is one)
     * @type {?Object}
     * @property {string} name The name of this provider
     * @property {string} url URL of this provider
     */
    this.provider = data.provider;

    /**
     * The footer of this embed
     * @type {?Object}
     * @property {string} text The text of this footer
     * @property {string} iconURL URL of the icon for this footer
     * @property {string} proxyIconURL Proxied URL of the icon for this footer
     */
    this.footer = data.footer ? {
      text: data.footer.text,
      iconURL: data.footer.iconURL || data.footer.icon_url,
      proxyIconURL: data.footer.proxyIconURL || data.footer.proxy_icon_url,
    } : null;

    /**
     * The files of this embed
     * @type {?Object}
     * @property {Array<FileOptions|string|MessageAttachment>} files Files to attach
     */
    if (data.files) {
      this.files = data.files.map(file => {
        if (file instanceof MessageAttachment) {
          return typeof file.file === 'string' ? file.file : Util.cloneObject(file.file);
        }
        return file;
      });
    }
  }

  /**
   * The date this embed was created
   * @type {?Date}
   * @readonly
   */
  get createdAt() {
    return this.timestamp ? new Date(this.timestamp) : null;
  }

  /**
   * The hexadecimal version of the embed color, with a leading hash
   * @type {string}
   * @readonly
   */
  get hexColor() {
    return this.color ? `#${this.color.toString(16).padStart(6, '0')}` : null;
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {MessageEmbed}
   */
  addField(name, value, inline = false) {
    if (this.fields.length >= 25) throw new RangeError('EMBED_FIELD_COUNT');
    name = Util.resolveString(name);
    if (!String(name) || name.length > 256) throw new RangeError('EMBED_FIELD_NAME');
    value = Util.resolveString(value);
    if (!String(value) || value.length > 1024) throw new RangeError('EMBED_FIELD_VALUE');
    this.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Convenience function for `<MessageEmbed>.addField('\u200B', '\u200B', inline)`.
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {MessageEmbed}
   */
  addBlankField(inline = false) {
    return this.addField('\u200B', '\u200B', inline);
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Only one file may be attached.
   * @param {Array<FileOptions|string|MessageAttachment>} files Files to attach
   * @returns {MessageEmbed}
   */
  attachFiles(files) {
    if (this.files) this.files = this.files.concat(files);
    else this.files = files;
    for (let file of files) {
      if (file instanceof MessageAttachment) file = file.file;
    }
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
    if (description.length > 2048) throw new RangeError('EMBED_DESCRIPTION');
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
    if (text.length > 2048) throw new RangeError('EMBED_FOOTER_TEXT');
    this.footer = { text, iconURL };
    return this;
  }

  /**
   * Set the image of this embed.
   * @param {string} url The URL of the image
   * @returns {MessageEmbed}
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Set the thumbnail of this embed.
   * @param {string} url The URL of the thumbnail
   * @returns {MessageEmbed}
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param {Date} [timestamp=current date] The timestamp
   * @returns {MessageEmbed}
   */
  setTimestamp(timestamp = new Date()) {
    this.timestamp = timestamp.getTime();
    return this;
  }

  /**
   * Sets the title of this embed.
   * @param {StringResolvable} title The title
   * @returns {MessageEmbed}
   */
  setTitle(title) {
    title = Util.resolveString(title);
    if (title.length > 256) throw new RangeError('EMBED_TITLE');
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
   * Transforms the embed object to be processed.
   * @returns {Object} The raw data of this embed
   * @private
   */
  _apiTransform() {
    return {
      title: this.title,
      type: 'rich',
      description: this.description,
      url: this.url,
      timestamp: this.timestamp ? new Date(this.timestamp) : null,
      color: this.color,
      fields: this.fields,
      files: this.files,
      thumbnail: this.thumbnail,
      image: this.image,
      author: this.author ? {
        name: this.author.name,
        url: this.author.url,
        icon_url: this.author.iconURL,
      } : null,
      footer: this.footer ? {
        text: this.footer.text,
        icon_url: this.footer.iconURL,
      } : null,
    };
  }
}

module.exports = MessageEmbed;
