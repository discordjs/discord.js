'use strict';

const Component = require('./Component');

/**
 * Represents a text display component
 * @extends {Component}
 */
class TextDisplayComponent extends Component {
  /**
   * The content of this text display
   * @type {string}
   * @readonly
   */
  get content() {
    return this.data.content;
  }
}

module.exports = TextDisplayComponent;
