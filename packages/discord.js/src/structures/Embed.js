'use strict';

const { embedLength } = require('@discordjs/builders');
const isEqual = require('fast-deep-equal');

/**
 * Represents an embed.
 */
class Embed {
  constructor(data) {
    /**
     * The API embed data.
     *
     * @type {APIEmbed}
     * @readonly
     */
    this.data = { ...data };
  }

  /**
   * An array of fields of this embed.
   *
   * @type {Array<APIEmbedField>}
   * @readonly
   */
  get fields() {
    return this.data.fields ?? [];
  }

  /**
   * The title of this embed.
   *
   * @type {?string}
   * @readonly
   */
  get title() {
    return this.data.title ?? null;
  }

  /**
   * The description of this embed.
   *
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * The URL of this embed.
   *
   * @type {?string}
   * @readonly
   */
  get url() {
    return this.data.url ?? null;
  }

  /**
   * The color of this embed.
   *
   * @type {?number}
   * @readonly
   */
  get color() {
    return this.data.color ?? null;
  }

  /**
   * The timestamp of this embed. This is in an ISO 8601 format.
   *
   * @type {?string}
   * @readonly
   */
  get timestamp() {
    return this.data.timestamp ?? null;
  }

  /**
   * @typedef {Object} EmbedAssetData
   * @property {?string} url The URL of the image
   * @property {?string} proxyURL The proxy URL of the image
   * @property {?number} height The height of the image
   * @property {?number} width The width of the image
   */

  /**
   * The thumbnail of this embed.
   *
   * @type {?EmbedAssetData}
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
   * The image of this embed.
   *
   * @type {?EmbedAssetData}
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
   * The video of this embed.
   *
   * @type {?EmbedAssetData}
   * @readonly
   */
  get video() {
    if (!this.data.video) return null;
    return {
      url: this.data.video.url,
      proxyURL: this.data.video.proxy_url,
      height: this.data.video.height,
      width: this.data.video.width,
    };
  }

  /**
   * @typedef {Object} EmbedAuthorData
   * @property {string} name The name of the author
   * @property {?string} url The URL of the author
   * @property {?string} iconURL The icon URL of the author
   * @property {?string} proxyIconURL The proxy icon URL of the author
   */

  /**
   * The author of this embed.
   *
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
   * The provider of this embed.
   *
   * @type {?APIEmbedProvider}
   * @readonly
   */
  get provider() {
    return this.data.provider ?? null;
  }

  /**
   * @typedef {Object} EmbedFooterData
   * @property {string} text The text of the footer
   * @property {?string} iconURL The URL of the icon
   * @property {?string} proxyIconURL The proxy URL of the icon
   */

  /**
   * The footer of this embed.
   *
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
   * The accumulated length for the embed title, description, fields, footer text, and author name.
   *
   * @type {number}
   * @readonly
   */
  get length() {
    return embedLength(this.data);
  }

  /**
   * The hex color of this embed.
   *
   * @type {?string}
   * @readonly
   */
  get hexColor() {
    return typeof this.data.color === 'number'
      ? `#${this.data.color.toString(16).padStart(6, '0')}`
      : (this.data.color ?? null);
  }

  /**
   * Returns the API-compatible JSON for this embed.
   *
   * @returns {APIEmbed}
   */
  toJSON() {
    return { ...this.data };
  }

  /**
   * Whether the given embeds are equal.
   *
   * @param {Embed|APIEmbed} other The embed to compare against
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof Embed) {
      return isEqual(this.data, other.data);
    }

    return (
      this.author?.iconURL === other.author?.icon_url &&
      this.author?.name === other.author?.name &&
      this.author?.url === other.author?.url &&
      this.color === (other.color ?? null) &&
      this.description === (other.description ?? null) &&
      this.footer?.iconURL === other.footer?.icon_url &&
      this.footer?.text === other.footer?.text &&
      this.image?.url === other.image?.url &&
      this.thumbnail?.url === other.thumbnail?.url &&
      (this.timestamp && Date.parse(this.timestamp)) === (other.timestamp ? Date.parse(other.timestamp) : null) &&
      this.title === (other.title ?? null) &&
      this.url === (other.url ?? null) &&
      this.video?.url === other.video?.url &&
      isEqual(this.fields, other.fields?.map(field => ({ ...field, inline: field.inline ?? false })) ?? []) &&
      isEqual(this.provider, other.provider ?? null)
    );
  }
}

exports.Embed = Embed;
