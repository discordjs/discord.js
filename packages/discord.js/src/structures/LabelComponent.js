'use strict';

const { Component } = require('./Component.js');
const { createComponent } = require('../util/Components.js');

/**
 * Represents an action row
 *
 * @extends {Component}
 */
class LabelComponent extends Component {
  constructor({ component, ...data }) {
    super(data);

    /**
     * The components in this action row
     *
     * @type {Component[]}
     * @readonly
     */
    this.component = createComponent(component);
  }

  /**
   * The label of the component
   *
   * @type {string}
   * @readonly
   */
  get label() {
    return this.data.label;
  }

  /**
   * The description of this component
   *
   * @type {?string}
   * @readonly
   */
  get description() {
    return this.data.description ?? null;
  }

  /**
   * Returns the API-compatible JSON for this component
   *
   * @returns {APIActionRowComponent | APIStringSelectComponent}
   */
  toJSON() {
    return { ...this.data, component: this.component.toJSON() };
  }
}

module.exports = LabelComponent;
