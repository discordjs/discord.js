'use strict';

/**
 * @typedef {Object} BaseComponentData
 * @property {ComponentType} type
 */

/**
 * @typedef {BaseComponentData} ActionRowData
 * @property {ComponentData[]} components
 */

/**
 * @typedef {BaseComponentData} ButtonComponentData
 * @property {ButtonStyle} style
 * @property {?boolean} disabled
 * @property {string} label
 * @property {?APIComponentEmoji} emoji
 * @property {?string} customId
 * @property {?string} url
 */

/**
 * @typedef {object} SelectMenuComponentOptionData
 * @property {string} label
 * @property {string} value
 * @property {?string} description
 * @property {?APIComponentEmoji} emoji
 * @property {?boolean} default
 */

/**
 * @typedef {BaseComponentData} SelectMenuComponentData
 * @property {string} customId
 * @property {?boolean} disabled
 * @property {?number} maxValues
 * @property {?number} minValues
 * @property {?SelectMenuComponentOptionData[]} options
 * @property {?string} placeholder
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData} ComponentData
 */

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
