import { SeparatorSpacingSize } from 'discord-api-types/v10';
import { Component } from './Component.js';

/**
 * Represents a separator component
 *
 * @extends {Component}
 */
export class SeparatorComponent extends Component {
  /**
   * The spacing of this separator
   *
   * @type {SeparatorSpacingSize}
   * @readonly
   */
  get spacing() {
    return this.data.spacing ?? SeparatorSpacingSize.Small;
  }

  /**
   * Whether this separator is a divider
   *
   * @type {boolean}
   * @readonly
   */
  get divider() {
    return this.data.divider ?? true;
  }
}
