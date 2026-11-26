import { Component } from './Component.js';
import { OverflowMenuGroup } from './OverflowMenuGroup.js';

/**
 * Represents an overflow menu component
 *
 * @extends {Component}
 */
export class OverflowMenuComponent extends Component {
  constructor({ groups, ...data }) {
    super(data);

    /**
     * The groups in this overflow menu
     *
     * @type {OverflowMenuGroup[]}
     * @readonly
     */
    this.groups = groups.map(group => new OverflowMenuGroup(group));
  }

  /**
   * Returns the API-compatible JSON for this component
   *
   * @returns {APIOverflowMenuComponent}
   */
  toJSON() {
    return { ...this.data, groups: this.groups.map(group => group.toJSON()) };
  }
}
