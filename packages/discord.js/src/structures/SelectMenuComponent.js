'use strict';

const process = require('node:process');
const StringSelectMenuComponent = require('./StringSelectMenuComponent');

let deprecationEmitted = false;

/**
 * @deprecated Use {@link StringSelectMenuComponent} instead.
 * @extends {StringSelectMenuComponent}
 */
class SelectMenuComponent extends StringSelectMenuComponent {
  constructor(...params) {
    super(...params);

    if (!deprecationEmitted) {
      process.emitWarning(
        'The SelectMenuComponent class is deprecated. Use StringSelectMenuComponent instead.',
        'DeprecationWarning',
      );
      deprecationEmitted = true;
    }
  }
}

module.exports = SelectMenuComponent;
