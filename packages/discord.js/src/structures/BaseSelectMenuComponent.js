'use strict';

const { Component } = require('./Component.js');

/**
 * Represents a select menu component
 *
 * @extends {Component}
 */
class BaseSelectMenuComponent extends Component {
  /**
   * The placeholder for this select menu
   *
   * @type {?string}
   * @readonly
   */
  get placeholder() {
    return this.data.placeholder ?? null;
  }

  /**
   * The maximum amount of options that can be selected
   *
   * @type {?number}
   * @readonly
   */
  get maxValues() {
    return this.data.max_values ?? null;
  }

  /**
   * The minimum amount of options that must be selected
   *
   * @type {?number}
   * @readonly
   */
  get minValues() {
    return this.data.min_values ?? null;
  }

  /**
   * The custom id of this select menu
   *
   * @type {string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id;
  }

  /**
   * Whether this select menu is disabled
   *
   * @type {boolean}
   * @readonly
   */
  get disabled() {
    return this.data.disabled ?? false;
  }
}

exports.BaseSelectMenuComponent = BaseSelectMenuComponent;
