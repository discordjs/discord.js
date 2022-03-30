'use strict';

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
}

module.exports = ActionRow;
