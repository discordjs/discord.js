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
