'use strict';

const { emitWarning } = require('node:process');
const { isJSONEncodable } = require('@discordjs/builders');
const Component = require('./Component');
const { createComponent } = require('../util/Components');

let deprecationEmittedForFrom = false;

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
    this.components = components.map(c => createComponent(c));
  }

  /**
   * Creates a new action row builder from JSON data
   * @param {JSONEncodable<APIActionRowComponent>|APIActionRowComponent} other The other data
   * @returns {ActionRowBuilder}
   * @deprecated Use {@link ActionRowBuilder.from()} instead
   */
  static from(other) {
    if (!deprecationEmittedForFrom) {
      emitWarning(
        'The ActionRow.from() method is deprecated. Use ActionRowBuilder.from() instead.',
        'DeprecationWarning',
      );
      deprecationEmittedForFrom = true;
    }

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
