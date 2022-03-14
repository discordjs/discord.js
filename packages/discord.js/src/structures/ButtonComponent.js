'use strict';

const Component = require('./Component');

/**
 * Represents a button component
 * @extends {Component}
 */
class ButtonComponent extends Component {
  /**
   * The style of this button
   * @type {ButtonStyle}
   * @readonly
   */
  get style() {
    return this.data.style;
  }

  /**
   * The label of this button
   * @type {?string}
   * @readonly
   */
  get label() {
    return this.data.label ?? null;
  }

  /**
   * The emoji used in this button
   * @type {?APIMessageComponentEmoji}
   * @readonly
   */
  get emoji() {
    return this.data.emoji ?? null;
  }

  /**
   * Whether this button is disabled
   * @type {?boolean}
   * @readonly
   */
  get disabled() {
    return this.data.disabled ?? null;
  }

  /**
   * The custom id of this button (only defined on non-link buttons)
   * @type {?string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id ?? null;
  }

  /**
   * The URL of this button (only defined on link buttons)
   * @type {?string}
   * @readonly
   */
  get url() {
    return this.data.url ?? null;
  }
}

module.exports = ButtonComponent;
