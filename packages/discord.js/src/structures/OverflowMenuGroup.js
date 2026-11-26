import { MenuActionItemComponent } from './MenuActionItemComponent.js';

/**
 * Represents an overflow menu group
 */
export class OverflowMenuGroup {
  constructor({ components, ...data }) {
    /**
     * The API data associated with this component
     *
     * @type {APIMessageComponent}
     */
    this.data = data;

    /**
     * The menu action items in this overflow menu group
     *
     * @type {MenuActionItemComponent[]}
     * @readonly
     */
    this.components = components.map(item => new MenuActionItemComponent(item));
  }

  /**
   * The label of the group
   *
   * @type {string}
   * @readonly
   */
  get label() {
    return this.data.label;
  }

  /**
   * Returns the API-compatible JSON for this component
   *
   * @returns {APIOverflowMenuGroup}
   */
  toJSON() {
    return { ...this.data, groups: this.groups.map(item => item.toJSON()) };
  }
}
