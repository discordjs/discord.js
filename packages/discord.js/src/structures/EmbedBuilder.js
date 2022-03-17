'use strict';

const { EmbedBuilder: BuildersEmbed, isJSONEncodable } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');
const Util = require('../util/Util');

/**
 * Class used to build embeds to be sent through the API
 * @extends {BuildersEmbed}
 */
class EmbedBuilder extends BuildersEmbed {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }

  /**
   * Sets the color of this embed
   * @param {?ColorResolvable} color The color of the embed
   * @returns {EmbedBuilder}
   */
  setColor(color) {
    return super.setColor(color && Util.resolveColor(color));
  }

  /**
   * Creates a new embed builder from JSON data
   * @param {JSONEncodable<APIEmbed>|APIEmbed} other The other data
   * @returns {EmbedBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }

  /**
   * An array of fields of this embed
   * @type {?Array<APIEmbedField>}
   * @readonly
   */
  get fields() {
    return this.data.fields ?? null;
  }

  /**
   * The embed title
   * @type {?string}
   * @readonly
   */
  get title() {
    return this.data.title ?? null;
  }

  /**
   * The embed description
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * The embed URL
   * @type {?string}
   * @readonly
   */
  get url() {
    return this.data.url ?? null;
  }

  /**
   * The embed color
   * @type {?number}
   * @readonly
   */
  get color() {
    return this.data.color ?? null;
  }

  /**
   * The timestamp of the embed in an ISO 8601 format
   * @type {?string}
   * @readonly
   */
  get timestamp() {
    return this.data.timestamp ?? null;
  }

  /**
   * The embed thumbnail data
   * @type {?EmbedImageData}
   * @readonly
   */
  get thumbnail() {
    if (!this.data.thumbnail) return null;
    return {
      url: this.data.thumbnail.url,
      proxyURL: this.data.thumbnail.proxy_url,
      height: this.data.thumbnail.height,
      width: this.data.thumbnail.width,
    };
  }

  /**
   * The embed image data
   * @type {?EmbedImageData}
   * @readonly
   */
  get image() {
    if (!this.data.image) return null;
    return {
      url: this.data.image.url,
      proxyURL: this.data.image.proxy_url,
      height: this.data.image.height,
      width: this.data.image.width,
    };
  }

  /**
   * The embed author data
   * @type {?EmbedAuthorData}
   * @readonly
   */
  get author() {
    if (!this.data.author) return null;
    return {
      name: this.data.author.name,
      url: this.data.author.url,
      iconURL: this.data.author.icon_url,
      proxyIconURL: this.data.author.proxy_icon_url,
    };
  }

  /**
   * The embed footer data
   * @type {?EmbedFooterData}
   * @readonly
   */
  get footer() {
    if (!this.data.footer) return null;
    return {
      text: this.data.footer.text,
      iconURL: this.data.footer.icon_url,
      proxyIconURL: this.data.footer.proxy_icon_url,
    };
  }

  /**
   * The accumulated length for the embed title, description, fields, footer text, and author name
   * @type {number}
   * @readonly
   */
  get length() {
    return (
      (this.data.title?.length ?? 0) +
      (this.data.description?.length ?? 0) +
      (this.data.fields?.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) ?? 0) +
      (this.data.footer?.text.length ?? 0) +
      (this.data.author?.name.length ?? 0)
    );
  }

  /**
   * The hex color of the current color of the embed
   * @type {?string}
   * @readonly
   */
  get hexColor() {
    return typeof this.data.color === 'number'
      ? `#${this.data.color.toString(16).padStart(6, '0')}`
      : this.data.color ?? null;
  }
}

module.exports = EmbedBuilder;

/**
 * @external BuildersEmbed
 * @see {@link https://discord.js.org/#/docs/builders/main/class/EmbedBuilder}
 */
