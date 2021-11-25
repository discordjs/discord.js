'use strict';

const { ComponentTypes } = require('../util/Constants');

/**
 * Represents a discord interactive component.
 * @abstract
 */
class BaseComponent {
  /**
   * Options for a Component
   * @typedef {Object} BaseComponentOptions
   * @property {ComponentTypeResolvable} type The type of this component
   */
  /**
   * Data that can be resolved into options for a MessageComponent. This can be:
   * * ActionRowOptions
   * * ButtonOptions
   * * SelectMenuOptions
   * @typedef {ActionRowOptions|ButtonOptions|SelectMenuOptions|InputTextOptions} ComponentOptions
   */
  /**
   * All of the Component variants. These can be:
   * * ActionRow
   * * Button
   * * SelectMenu
   * * TextInput
   * @typedef {ActionRow|Button|SelectMenu|TextInput} Component
   * @see {@link https://discord.com/developers/docs/interactions/message-components#component-object-component-types}
   */
  /**
   * Data that can be resolved to a ComponentType. This can be:
   * * ComponentType
   * * string
   * * number
   * @typedef {string|number|ComponentType} ComponentTypeResolvable
   */

  /**
   * @param {BaseComponent|BaseComponentOptions} data The options for this component
   */
  constructor(data = {}) {
    this.type = 'type' in data ? BaseComponent.resolveType(data.type) : null;
  }

  /**
   * Resolves the type of a Component
   * @param {ComponentTypeResolvable} type The type to resolve
   * @returns {ComponentType}
   * @private
   */
  static resolveType(type) {
    return typeof type === 'string' ? type : ComponentTypes[type];
  }
}

module.exports = BaseComponent;
