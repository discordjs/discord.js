'use strict';

const Component = require('./Component');

/**
 * Class used to represent a text input component received from the API
 * @extends {Component}
 */
class TextInputComponent extends Component {
  /**
   * The custom id of this text input
   * @type {string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id;
  }

  /**
   * The value for this text input
   * @type {string}
   * @readonly
   */
  get value() {
    return this.data.value;
  }
}

module.exports = TextInputComponent;
