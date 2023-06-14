'use strict';

const process = require('node:process');
const StringSelectMenuInteraction = require('./StringSelectMenuInteraction');

let deprecationEmitted = false;

/**
 * @deprecated Use {@link StringSelectMenuInteraction} instead.
 * @extends {StringSelectMenuInteraction}
 */
class SelectMenuInteraction extends StringSelectMenuInteraction {
  constructor(...params) {
    super(...params);

    if (!deprecationEmitted) {
      process.emitWarning(
        'The SelectMenuInteraction class is deprecated. Use StringSelectMenuInteraction instead.',
        'DeprecationWarning',
      );
      deprecationEmitted = true;
    }
  }
}

module.exports = SelectMenuInteraction;
