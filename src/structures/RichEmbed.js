class RichEmbed {
  constructor(data = {}) {
    this.title = data.title;
    this.description = data.description;
    this.url = data.url;
    this.color = data.color;
    this.author = data.author;
    this.timestamp = data.timestamp;
    this.fields = data.fields || [];
    this.thumbnail = data.thumbnail;
    this.image = data.image;
    this.footer = data.footer;
  }

  /**
   * Sets the title of this embed
   * @param {string} title The title
   * @returns {RichEmbed} This embed
   */
  setTitle(title) {
    this.title = title;
    return this;
  }

  /**
   * Sets the description of this embed
   * @param {string} description The description
   * @returns {RichEmbed} This embed
   */
  setDescription(description) {
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
   * @param {string|number|Array} color The color to set
   * @returns {RichEmbed} This embed
   */
  setColor(color) {
    if (color instanceof Array) {
      color = parseInt(((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2]).toString(16).slice(1), 16);
    } else if (typeof color === 'string' && color.startsWith('#')) {
      color = parseInt(color.replace('#', ''), 16);
    }
    this.color = color;
    return this;
  }

  /**
   * Sets the author of this embed
   * @param {string} name The name of the author
   * @param {string} [icon=] The icon of the author
   * @returns {RichEmbed} This embed
   */
  setAuthor(name, icon) {
    this.author = { name, icon_url: icon };
    return this;
  }

  /**
   * Sets the timestamp of this embed
   * @param {Date} [timestamp=new Date()] The timestamp
   * @returns {RichEmbed} This embed
   */
  addTimestamp(timestamp = new Date()) {
    this.timestamp = timestamp;
    return this;
  }

  /**
   * Adds a field to the embed (max 25)
   * @param {string} name The name of the field
   * @param {string} value The value of the field
   * @param {boolean} [inline=false] Set the field to display inline
   * @returns {RichEmbed} This embed
   */
  addField(name, value, inline = false) {
    if (this.fields.length >= 25) throw new Error('you may only add 25 fields to an embed!');
    this.fields.push({ name, value, inline });
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
   * @param {string} url The URL of the thumbnail
   * @returns {RichEmbed} This embed
   */
  setImage(url) {
    this.image = { url };
    return this;
  }

  /**
   * Sets the footer of this embed
   * @param {string} text The text of the footer
   * @param {string} icon The icon of the footer
   * @returns {RichEmbed} This embed
   */
  setFooter(text, icon) {
    this.footer = { text, icon_uri: icon };
    return this;
  }
}

module.exports = RichEmbed;
