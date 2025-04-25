'use strict';

const Component = require('./Component');
const { createComponent } = require('../util/Components');

/**
 * Represents a container component
 * @extends {Component}
 */
class ContainerComponent extends Component {
  constructor({ components, ...data }) {
    super(data);

    /**
     * The components in this container
     * @type {Component[]}
     * @readonly
     */
    this.components = components.map(component => createComponent(component));
  }

  /**
   * The accent color of this container
   * @type {?number}
   * @readonly
   */
  get accentColor() {
    return this.data.accent_color ?? null;
  }

  /**
   * The hex accent color of this container
   * @type {?string}
   * @readonly
   */
  get hexAccentColor() {
    return typeof this.data.accent_color === 'number'
      ? `#${this.data.accent_color.toString(16).padStart(6, '0')}`
      : (this.data.accent_color ?? null);
  }

  /**
   * Whether this container is spoilered
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return this.data.spoiler ?? false;
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIContainerComponent}
   */
  toJSON() {
    return { ...this.data, components: this.components.map(component => component.toJSON()) };
  }
}

module.exports = ContainerComponent;
