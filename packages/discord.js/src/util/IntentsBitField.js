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
 * @param {GatewayIntentBits} [bits=0] Bit(s) to read from
 */

/**
 * Numeric WebSocket intents
 * @type {GatewayIntentBits}
 */
IntentsBitField.Flags = GatewayIntentBits;

module.exports = IntentsBitField;
