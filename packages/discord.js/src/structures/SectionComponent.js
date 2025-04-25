'use strict';

const Component = require('./Component');
const { createComponent } = require('../util/Components');

/**
 * Represents a section component
 * @extends {Component}
 */
class SectionComponent extends Component {
  constructor({ accessory, components, ...data }) {
    super(data);

    /**
     * The components in this section
     * @type {Component[]}
     * @readonly
     */
    this.components = components.map(component => createComponent(component));

    /**
     * The accessory component of this section
     * @type {Component}
     * @readonly
     */
    this.accessory = createComponent(accessory);
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APISectionComponent}
   */
  toJSON() {
    return {
      ...this.data,
      accessory: this.accessory.toJSON(),
      components: this.components.map(component => component.toJSON()),
    };
  }
}

module.exports = SectionComponent;
