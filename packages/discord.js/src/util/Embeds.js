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
