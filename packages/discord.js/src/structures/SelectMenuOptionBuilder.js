'use strict';

const { process } = require('node:process');
const { StringSelectMenuOptionBuilder } = require('./StringSelectMenuOptionBuilder');

let deprecationEmitted = false;

/**
 * @deprecated Use {@link StringSelectMenuOptionBuilder} instead.
 */
class SelectMenuOptionBuilder extends StringSelectMenuOptionBuilder {
  constructor(...params) {
    super(...params);

    if (!deprecationEmitted) {
      process.emitWarning(
        'The SelectMenuOptionBuilder class is deprecated, use StringSelectMenuOptionBuilder instead.',
        'DeprecationWarning',
      );
      deprecationEmitted = true;
    }
  }
}

module.exports = SelectMenuOptionBuilder;
