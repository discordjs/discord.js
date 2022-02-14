'use strict';

// This file contains the typedefs for camel-cased json data

/**
 * @typedef {Object} BaseComponentData
 * @property {ComponentType} type The type of component
 */
/**
 * @typedef {BaseComponentData} ActionRowData
 * @property {ComponentData[]} components The components in this action row
 */
/**
 * @typedef {BaseComponentData} ButtonComponentData
 * @property {ButtonStyle} style The style of the button
 * @property {?boolean} disabled Whether or not this button is disabled
 * @property {string} label The label of this button
 * @property {?APIComponentEmoji} emoji The emoji on this button
 * @property {?string} customId The custom id of the button
 * @property {?string} url The url of the button
 */
/**
 * @typedef {object} SelectMenuComponentOptionData
 * @property {string} label The label of the option
 * @property {string} value The value of the option
 * @property {?string} description The description of the option
 * @property {?APIComponentEmoji} emoji The emoji on the option
 * @property {?boolean} default Whether or not this option is selected by default
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
 * @property {string} customId
 * @property {TextInputStyle} style
 * @property {string} label
 * @property {?number} minLength
 * @property {?number} maxLength
 * @property {?boolean} required
 * @property {?string} value
 * @property {?string} placeholder
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData|TextInputComponentData} ComponentData
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
