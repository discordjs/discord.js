'use strict';

const Component = require('./Component');

/**
 * Represents a component v2
 * @extends {Component}
 */
class BaseComponent extends Component {
  /**
   * The id of this component v2
   * @type {number}
   * @readonly
   */
  get id() {
    return this.data.style;
  }
}

module.exports = BaseComponent;
