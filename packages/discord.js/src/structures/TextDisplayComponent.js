'use strict';

const BaseComponent = require('./BaseComponent');

/**
 * Represents a text display component
 * @extends {BaseComponent}
 */
class TextDisplayComponent extends BaseComponent {
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
