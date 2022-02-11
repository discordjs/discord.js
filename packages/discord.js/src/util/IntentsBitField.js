'use strict';
const { GatewayIntentBits } = require('discord-api-types/v9');
const BitField = require('./BitField');

/**
 * Data structure that makes it easy to calculate intents.
 * @extends {BitField}
 */
class IntentsBitField extends BitField {}

/**
 * @name IntentsBitField
 * @kind constructor
 * @memberof IntentsBitField
 * @param {IntentsResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Data that can be resolved to give a permission number. This can be:
 * * A string (see {@link IntentsBitField.Flags})
 * * An intents flag
 * * An instance of {@link IntentsBitField}
 * * An array of IntentsResolvable
 * @typedef {string|number|IntentsBitField|IntentsResolvable[]} IntentsResolvable
 */

/**
 * Numeric WebSocket intents
 * @type {GatewayIntentBits}
 */
IntentsBitField.Flags = GatewayIntentBits;

module.exports = IntentsBitField;
