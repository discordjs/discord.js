const ClientDataResolver = require('../client/ClientDataResolver');

/**
 * A rich embed to be sent with a message with a fluent interface for creation
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
     * @type {string}
     */
    this.file = data.file;
  }

  /**
   * Sets the title of this embed
   * @param {StringResolvable} title The title
   * @returns {RichEmbed} This embed
   */
  setTitle(title) {
    title = resolveString(title);
    if (title.length > 256) throw new RangeError('RichEmbed titles may not exceed 256 characters.');
    this.title = title;
    return this;
  }

  /**
   * Sets the description of this embed
   * @param {StringResolvable} description The description
   * @returns {RichEmbed} This embed
   */
  setDescription(description) {
    description = resolveString(description);
    if (description.length > 2048) throw new RangeError('RichEmbed descriptions may not exceed 2048 characters.');
    this.description = description;
    return this;
  }

  /**
   * Sets the URL of this embed
   * @param {string} url The URL
   * @returns {RichEmbed} This embed
   */
  setURL(url) {
    this.url = url;
    return this;
  }

  /**
   * Sets the color of this embed
   * @param {ColorResolvable} color The color of the embed
   * @returns {RichEmbed} This embed
   */
  setColor(color) {
    this.color = ClientDataResolver.resolveColor(color);
    return this;
  }

  /**
   * Sets the author of this embed
   * @param {StringResolvable} name The name of the author
   * @param {string} [icon] The icon URL of the author
   * @param {string} [url] The URL of the author
   * @returns {RichEmbed} This embed
   */
  setAuthor(name, icon, url) {
    this.author = { name: resolveString(name), icon_url: icon, url };
    return this;
  }

  /**
   * Sets the timestamp of this embed
   * @param {Date} [timestamp=current date] The timestamp
   * @returns {RichEmbed} This embed
   */
  setTimestamp(timestamp = new Date()) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Validates a field before it is added
   * @param {string} name The name of the field
   * @param {string} value The value of the field
   * @param {boolean} inline Set the field to display inline
   * @returns {boolean} Validity of the field
   * @private
   */
  _validateField({ name, value, inline }) {
    if (name.length > 256) throw new RangeError('RichEmbed field names may not exceed 256 characters.');
    if (!/\S/.test(name)) throw new RangeError('RichEmbed field names may not be empty.');
    if (value.length > 1024) throw new RangeError('RichEmbed field values may not exceed 1024 characters.');
    if (!/\S/.test(value)) throw new RangeError('RichEmbed field values may not be empty.');
    if (typeof inline !== 'boolean') throw new TypeError('Richembed field inline must be a boolean');
    return true;
  }

  /**
   * Adds a field to the embed (max 25)
   * @param {StringResolvable} name The name of the field
   * @param {StringResolvable} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {RichEmbed} This embed
   */
  addField(name, value, inline = false) {
    if (this.fields.length >= 25) throw new RangeError('RichEmbeds may not exceed 25 fields.');
    name = resolveString(name);
    value = resolveString(value);
    this._validateField({ name, value, inline });
    this.fields.push({ name, value, inline });
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
   * Changes properties of a field at a specified index, parameters can be made
   * `null` or `undefined` to inherit properties of the field being changed
   * @param {number} index The index number of the field, starting from 0
   * @param {StringResolvable} name The new name of the field
   * @param {StringResolvable} value The new value of the field
   * @param {boolean} inline The new inline value of the field
   * @returns {RichEmbed} This embed
   */
  setField(index, name, value, inline) {
    if (typeof index !== 'number') throw new TypeError('Field index must be a number');
    if (!this.fields[index]) throw new RangeError('No field exists at specified index');
    if (name == null) name = this.fields[index].name;
    if (value == null) value = this.fields[index].value;
    if (inline == null) inline = this.fields[index].inline;
    name = resolveString(name);
    value = resolveString(value);
    this._validateField({ name, value, inline });
    this.fields[index] = { name, value, inline };
    return this;
  }

  /**
   * Set the thumbnail of this embed
   * @param {string} url The URL of the thumbnail
   * @returns {RichEmbed} This embed
   */
  setThumbnail(url) {
    this.thumbnail = { url };
    return this;
  }

  /**
   * Set the image of this embed
   * @param {string} url The URL of the image
   * @returns {RichEmbed} This embed
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the footer of this embed
   * @param {StringResolvable} text The text of the footer
   * @param {string} [icon] The icon URL of the footer
   * @returns {RichEmbed} This embed
   */
  setFooter(text, icon) {
    text = resolveString(text);
    if (text.length > 2048) throw new RangeError('RichEmbed footer text may not exceed 2048 characters.');
    this.footer = { text, icon_url: icon };
    return this;
  }

  /**
   * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
   * setting an embed image or author/footer icons. Only one file may be attached.
   * @param {FileOptions|string} file Local path or URL to the file to attach, or valid FileOptions for a file to attach
   * @returns {RichEmbed} This embed
   */
  attachFile(file) {
    if (this.file) throw new RangeError('You may not upload more than one file at once.');
    this.file = file;
    return this;
  }
}

module.exports = RichEmbed;

function resolveString(data) {
  if (typeof data === 'string') return data;
  if (data instanceof Array) return data.join('\n');
  return String(data);
}
