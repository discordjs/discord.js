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
 * @property {?boolean} disabled Whether this button is disabled
 * @property {string} label The label of this button
 * @property {?APIComponentEmoji} emoji The emoji on this button
 * @property {?string} customId The custom id of the button
 * @property {?string} url The URL of the button
 */
/**
 * @typedef {object} SelectMenuComponentOptionData
 * @property {string} label The label of the option
 * @property {string} value The value of the option
 * @property {?string} description The description of the option
 * @property {?APIComponentEmoji} emoji The emoji on the option
 * @property {?boolean} default Whether this option is selected by default
 */
/**
 * @typedef {BaseComponentData} SelectMenuComponentData
 * @property {string} customId The custom id of the select menu
 * @property {?boolean} disabled Whether the select menu is disabled or not
 * @property {?number} maxValues The maximum amount of options that can be selected
 * @property {?number} minValues The minimum amount of options that can be selected
 * @property {?SelectMenuComponentOptionData[]} options The options in this select menu
 * @property {?string} placeholder The placeholder of the select menu
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData} MessageComponentData
 /

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData|TextInputComponentData} ComponentData
 */
