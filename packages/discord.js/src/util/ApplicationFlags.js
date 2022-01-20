'use strict';

const BitField = require('./BitField');

/**
 * Data structure that makes it easy to interact with a {@link ClientApplication#flags} bitfield.
 * @extends {BitField}
 */
class ApplicationFlags extends BitField {}

/**
 * @name ApplicationFlags
 * @kind constructor
 * @memberof ApplicationFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name ApplicationFlags#bitfield
 */

module.exports = ApplicationFlags;
