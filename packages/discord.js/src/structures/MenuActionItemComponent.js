import { Component } from './Component.js';

/**
 * Represents a menu action item component
 *
 * @extends {Component}
 */
export class MenuActionItemComponent extends Component {
  /**
   * The style of this menu action item
   *
   * @type {MenuActionItemStyle}
   * @readonly
   */
  get style() {
    return this.data.style;
  }

  /**
   * The label of this menu action item
   *
   * @type {string}
   * @readonly
   */
  get label() {
    return this.data.label;
  }

  /**
   * The description of this menu action item
   *
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * The emoji used in this menu action item
   *
   * @type {?APIMessageComponentEmoji}
   * @readonly
   */
  get emoji() {
    return this.data.emoji ?? null;
  }

  /**
   * Whether this menu action item is disabled
   *
   * @type {boolean}
   * @readonly
   */
  get disabled() {
    return this.data.disabled ?? false;
  }

  /**
   * The custom id of this menu action item (only defined on non-link menu action items)
   *
   * @type {?string}
   * @readonly
   */
  get customId() {
    return this.data.custom_id ?? null;
  }

  /**
   * The URL of this menu action item (only defined on link menu action items)
   *
   * @type {?string}
   * @readonly
   */
  get url() {
    return this.data.url ?? null;
  }
}
