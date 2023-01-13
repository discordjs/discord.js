'use strict';

const process = require('node:process');
const StringSelectMenuOptionBuilder = require('./StringSelectMenuOptionBuilder');

let deprecationEmitted = false;

/**
 * @deprecated Use {@link StringSelectMenuOptionBuilder} instead.
 * @extends {StringSelectMenuOptionBuilder}
 */
class SelectMenuOptionBuilder extends StringSelectMenuOptionBuilder {
  constructor(...params) {
    super(...params);

    if (!deprecationEmitted) {
      process.emitWarning(
        'The SelectMenuOptionBuilder class is deprecated. Use StringSelectMenuOptionBuilder instead.',
        'DeprecationWarning',
      );
      deprecationEmitted = true;
    }
  }
}

module.exports = SelectMenuOptionBuilder;
