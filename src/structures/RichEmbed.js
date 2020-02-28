const Attachment = require('./Attachment');
const MessageEmbed = require('./MessageEmbed');
const util = require('../util/Util');
let ClientDataResolver;

/**
 * A rich embed to be sent with a message with a fluent interface for creation.
 * @param {Object} [data] Data to set in the rich embed
 */
class RichEmbed {
  constructor(data = {}) {
    /**
     * Title for this Embed
     * @type {string}
     */
    this.title = data.title;

    /**
     * Description for this Embed
     * @type {string}
     */
    this.description = data.description;

    /**
     * URL for this Embed
     * @type {string}
     */
    this.url = data.url;

    /**
     * Color for this Embed
     * @type {number}
     */
    this.color = data.color;

    /**
     * Author for this Embed
     * @type {Object}
     */
    this.author = data.author;

    /**
     * Timestamp for this Embed
     * @type {Date}
     */
    this.timestamp = data.timestamp;

    /**
     * Fields for this Embed
     * @type {Object[]}
     */
    this.fields = data.fields || [];

    /**
     * Thumbnail for this Embed
     * @type {Object}
     */
    this.thumbnail = data.thumbnail;

    /**
     * Image for this Embed
     * @type {Object}
     */
    this.image = data.image;

    /**
     * Footer for this Embed
     * @type {Object}
     */
    this.footer = data.footer;

    /**
     * File to upload alongside this Embed
     * @type {FileOptions|string|Attachment}
     */
    this.file = data.file;

    /**
     * The files to upload alongside this Embed
     * @type {Array<FileOptions|string|Attachment>}
     */
    this.files = [];
  }

  /**
   * Sets the title of this embed.
   * @param {StringResolvable} title The title
   * @returns {RichEmbed} This embed
   */
  setTitle(title) {
    title = util.resolveString(title);
    if (title.length > 256) throw new RangeError('RichEmbed titles may not exceed 256 characters.');
    this.title = title;
    return this;
  }

  /**
   * Sets the description of this embed.
   * @param {StringResolvable} description The description
   * @returns {RichEmbed} This embed
   */
  setDescription(description) {
    description = util.resolveString(description);
    if (description.length > 2048) throw new RangeError('RichEmbed descriptions may not exceed 2048 characters.');
    this.description = description;
    return this;
  }

  /**
   * Sets the URL of this embed.
   * @param {string} url The URL
   * @returns {RichEmbed} This embed
   */
  setURL(url) {
    this.url = url;
    return this;
  }

  /**
   * Sets the color of this embed.
   * @param {ColorResolvable} color The color of the embed
   * @returns {RichEmbed} This embed
   */
  setColor(color) {
    if (!ClientDataResolver) ClientDataResolver = require('../client/ClientDataResolver');
    this.color = ClientDataResolver.resolveColor(color);
    return this;
  }

  /**
   * Sets the author of this embed.
   * @param {StringResolvable} name The name of the author
   * @param {string} [icon] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {RichEmbed} This embed
   */
  setAuthor(name, icon, url) {
    this.author = { name: util.resolveString(name), icon_url: icon, url };
    return this;
  }

  /**
   * Sets the timestamp of this embed.
   * @param {Date|number} [timestamp=Date.now()] The timestamp or date
   * @returns {RichEmbed} This embed
   */
  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Adds a field to the embed (max 25).
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {RichEmbed} This embed
   */
  addField(name, value, inline = false) {
    if (this.fields.length >= 25) throw new RangeError('RichEmbeds may not exceed 25 fields.');
    this.fields.push(this.constructor.normalizeField(name, value, inline));
    return this;
  }

  /**
   * Convenience function for `<RichEmbed>.addField('\u200B', '\u200B', inline)`.
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {RichEmbed} This embed
   */
  addBlankField(inline = false) {
    return this.addField('\u200B', '\u200B', inline);
  }

  /**
  * @typedef {Object} EmbedField
  * @property {string} name The name of this field
  * @property {string} value The value of this field
  * @property {boolean} inline If this field will be displayed inline
  */

  /**
  * @typedef {Object} EmbedFieldData
  * @property {StringResolvable} name The name of this field
  * @property {StringResolvable} value The value of this field
  * @property {boolean} [inline=false] If this field will be displayed inline
  */

  /**
   * Removes, replaces, and inserts fields in the embed (max 25).
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of fields to remove
   * @param {...EmbedFieldData} [fields] The replacing field objects
   * @returns {RichEmbed}
   */
  spliceFields(index, deleteCount, ...fields) {
    if (fields) {
      const mapper = ({ name, value, inline }) => this.constructor.normalizeField(name, value, inline);
      this.fields.splice(index, deleteCount, ...fields.map(mapper));
    } else {
      this.fields.splice(index, deleteCount);
    }
    return this;
  }

  /**
   * Set the thumbnail of this embed.
   * @param {string} url The URL of the thumbnail
   * @returns {RichEmbed} This embed
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Set the image of this embed.
   * @param {string} url The URL of the image
   * @returns {RichEmbed} This embed
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the footer of this embed.
   * @param {StringResolvable} text The text of the footer
   * @param {string} [icon] The icon URL of the footer
   * @returns {RichEmbed} This embed
   */
  setFooter(text, icon) {
    text = util.resolveString(text);
    if (text.length > 2048) throw new RangeError('RichEmbed footer text may not exceed 2048 characters.');
    this.footer = { text, icon_url: icon };
    return this;
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Only one file may be attached.
   * @param {FileOptions|string|Attachment} file Local path or URL to the file to attach,
   * or valid FileOptions for a file to attach
   * @returns {RichEmbed} This embed
   */
  attachFile(file) {
    if (this.file) throw new RangeError('You may not upload more than one file at once.');
    if (file instanceof Attachment) file = file.file;
    this.file = file;
    return this;
  }

  /**
   * Sets the files to upload alongside the embed. A file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Multiple files can be attached.
   * @param {Array<FileOptions|string|Attachment>} files Files to attach
   * @returns {RichEmbed}
   */
  attachFiles(files) {
    files = files.map(file => file instanceof Attachment ? file.file : file);
    this.files = this.files.concat(files);
    return this;
  }

  /**
   * The accumulated length for the embed title, description, fields, author and footer text
   * @type {number}
   * @readonly
   */
  get length() {
    return (
      (this.title ? this.title.length : 0) +
      (this.description ? this.description.length : 0) +
      (this.fields.length >= 1 ? this.fields.reduce((prev, curr) =>
        prev + curr.name.length + curr.value.length, 0) : 0) +
      (this.footer ? this.footer.text.length : 0) +
      (this.author ? this.author.name.length : 0));
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
      fields: this.fields ?
        this.fields.map(field => ({ name: field.name, value: field.value, inline: field.inline })) :
        null,
      thumbnail: this.thumbnail ? {
        url: this.thumbnail.url,
      } : null,
      image: this.image ? {
        url: this.image.url,
      } : null,
      author: this.author ? {
        name: this.author.name,
        url: this.author.url,
        icon_url: this.author instanceof MessageEmbed.Author ? this.author.iconURL : this.author.icon_url,
      } : null,
      footer: this.footer ? {
        text: this.footer.text,
        icon_url: this.footer instanceof MessageEmbed.Footer ? this.footer.iconURL : this.footer.icon_url,
      } : null,
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
    name = util.resolveString(name);
    if (name.length > 256) throw new RangeError('RichEmbed field names may not exceed 256 characters.');
    if (!/\S/.test(name)) throw new RangeError('RichEmbed field names may not be empty.');
    value = util.resolveString(value);
    if (value.length > 1024) throw new RangeError('RichEmbed field values may not exceed 1024 characters.');
    if (!/\S/.test(value)) throw new RangeError('RichEmbed field values may not be empty.');
    return { name, value, inline };
  }
}

module.exports = RichEmbed;
