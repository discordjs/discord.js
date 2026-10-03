import { BaseSelectMenuComponent } from './BaseSelectMenuComponent.js';

/**
 * Represents a string select menu component
 *
 * @extends {BaseSelectMenuComponent}
 */
export class StringSelectMenuComponent extends BaseSelectMenuComponent {
  /**
   * The options in this select menu
   *
   * @type {APISelectMenuOption[]}
   * @readonly
   */
  get options() {
    return this.data.options;
  }
}
