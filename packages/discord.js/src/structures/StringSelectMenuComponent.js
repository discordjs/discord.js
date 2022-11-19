'use strict';

const BaseSelectMenuComponent = require('./BaseSelectMenuComponent');

/**
 * Represents a string select menu component
 * @extends {BaseSelectMenuComponent}
 */
class StringSelectMenuComponent extends BaseSelectMenuComponent {
  /**
   * The options in this select menu
   * @type {APISelectMenuOption[]}
   * @readonly
   */
  get options() {
    return this.data.options;
  }
}

module.exports = StringSelectMenuComponent;
