'use strict';

const { SeparatorSpacingSize } = require('discord-api-types/v10');
const Component = require('./Component');

/**
 * Represents a separator component
 * @extends {Component}
 */
class SeparatorComponent extends Component {
  /**
   * The spacing of this separator
   * @type {SeparatorSpacingSize}
   * @readonly
   */
  get spacing() {
    return this.data.spacing ?? SeparatorSpacingSize.Small;
  }

  /**
   * Whether this separator is a divider
   * @type {boolean}
   * @readonly
   */
  get divider() {
    return this.data.divider ?? true;
  }
}

module.exports = SeparatorComponent;
