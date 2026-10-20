/* eslint-disable jsdoc/check-values */
import { GatewayIntentBits } from 'discord-api-types/v10';
import { BitField } from './BitField.js';

/**
 * Data structure that makes it easy to calculate intents.
 *
 * @extends {BitField}
 */
export class IntentsBitField extends BitField {
  /**
   * Numeric WebSocket intents
   *
   * @type {GatewayIntentBits}
   * @memberof IntentsBitField
   */
  static Flags = GatewayIntentBits;
}

/**
 * @name IntentsBitField
 * @kind constructor
 * @memberof IntentsBitField
 * @param {IntentsResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Data that can be resolved to give a permission number. This can be:
 * - A string (see {@link IntentsBitField.Flags})
 * - An intents flag
 * - An instance of {@link IntentsBitField}
 * - An array of IntentsResolvable
 *
 * @typedef {string|number|IntentsBitField|IntentsResolvable[]} IntentsResolvable
 */
