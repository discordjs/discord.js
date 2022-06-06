'use strict';

const { isJSONEncodable } = require('@discordjs/builders');
const Component = require('./Component');
const Components = require('../util/Components');

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
    this.components = components.map(c => Components.createComponent(c));
  }

  /**
   * Creates a new action row builder from JSON data
   * @param {JSONEncodable<APIActionRowComponent>|APIActionRowComponent} other The other data
   * @returns {ActionRowBuilder}
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIActionRowComponent}
   */
  toJSON() {
    return { ...this.data, components: this.components.map(c => c.toJSON()) };
  }
}

module.exports = ActionRow;
