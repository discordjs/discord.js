'use strict';

const { Component } = require('./Component.js');
const { createComponent } = require('../util/Components.js');

/**
 * Represents an action row
 * @extends {Component}
 */
class ActionRow extends Component {
  constructor({ components, ...data }) {
    super(data);

    /**
     * The components in this action row
     * @type {Component[]}
     * @readonly
     */
    this.components = components.map(component => createComponent(component));
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIActionRowComponent}
   */
  toJSON() {
    return { ...this.data, components: this.components.map(component => component.toJSON()) };
  }
}

exports.ActionRow = ActionRow;
