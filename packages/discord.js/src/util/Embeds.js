'use strict';

/**
 * @typedef {Object} EmbedData
 * @property {?string} title
 * @property {?EmbedType} type
 * @property {?string} description
 * @property {?string} url
 * @property {?string} timestamp
 * @property {?number} color
 * @property {?EmbedFooterData} footer
 * @property {?EmbedImageData} image
 * @property {?EmbedImageData} thumbnail
 * @property {?EmbedProviderData} provider
 * @property {?EmbedAuthorData} author
 * @property {?EmbedFieldData[]} fields
 */

/**
 * @typedef {Object} EmbedFooterData
 * @property {string} text
 * @property {?string} iconURL
 */

/**
 * @typedef {Object} EmbedImageData
 * @property {?string} url
 */

/**
 * @typedef {Object} EmbedProviderData
 * @property {?string} name
 * @property {?string} url
 */

/**
 * @typedef {Object} EmbedAuthorData
 * @property {string} name
 * @property {?string} url
 * @property {?string} iconURL
 */

/**
 * @typedef {Object} EmbedFieldData
 * @property {string} name
 * @property {string} value
 * @property {?boolean} inline
 */

class Embeds extends null {
  /**
   * Transforms json data into api-compatible json data.
   * @param {EmbedData|APIEmbed} data The data to transform.
   * @returns {APIEmbed}
   */
  static transformJSON(data) {
    return {
      title: data?.title,
      type: data?.type,
      description: data?.description,
      url: data?.url,
      timestamp: data?.timestamp,
      color: data?.color,
      footer: {
        test: data?.footer?.text,
        icon_url: data?.footer?.iconURL ?? data?.footer?.icon_url,
      },
      image: data?.image,
      thumbnail: data?.thumbnail,
      provider: data?.provider,
      author: {
        name: data?.author?.name,
        text: data?.author?.text,
        icon_url: data?.author?.iconURL ?? data?.author?.icon_url,
      },
      fields: data?.fields,
    };
  }
}

module.exports = Embeds;
