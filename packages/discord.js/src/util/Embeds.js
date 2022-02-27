'use strict';

/**
 * @typedef {Object} EmbedData
 * @property {?string} title The title of the embed
 * @property {?EmbedType} type The type of the embed
 * @property {?string} description The description of the embed
 * @property {?string} url The URL of the embed
 * @property {?string} timestamp The timestamp on the embed
 * @property {?number} color The color of the embed
 * @property {?EmbedFooterData} footer The footer of the embed
 * @property {?EmbedImageData} image The image of the embed
 * @property {?EmbedImageData} thumbnail The thumbnail of the embed
 * @property {?EmbedProviderData} provider The provider of the embed
 * @property {?EmbedAuthorData} author The author in the embed
 * @property {?EmbedFieldData[]} fields The fields in this embed
 */

/**
 * @typedef {Object} EmbedFooterData
 * @property {string} text The text of the footer
 * @property {?string} iconURL The URL of the icon
 */

/**
 * @typedef {Object} EmbedImageData
 * @property {?string} url The URL of the image
 */

/**
 * @typedef {Object} EmbedProviderData
 * @property {?string} name The name of the provider
 * @property {?string} url The URL of the provider
 */

/**
 * @typedef {Object} EmbedAuthorData
 * @property {string} name The name of the author
 * @property {?string} url The URL of the author
 * @property {?string} iconURL The icon URL of the author
 */

/**
 * @typedef {Object} EmbedFieldData
 * @property {string} name The name of the field
 * @property {string} value The value of the field
 * @property {?boolean} inline Whether to inline this field
 */
