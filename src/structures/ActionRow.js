'use strict';

const BaseComponent = require('./BaseComponent');
const Components = require('./Components');
const { ComponentTypes } = require('../util/Constants');

/**
 * Represents an action row containing components.
 * @extends {BaseComponent}
 */
class ActionRow extends BaseComponent {
  /**
   * Components that can be placed in an action row
   * * Button
   * * SelectMenu
   * * InputText
   * @typedef {Button|SelectMenu|InputText} ActionRowComponent
   */

  /**
   * Options for components that can be placed in an action row
   * * ButtonOptions
   * * SelectMenuOptions
   * * InputTextOptions
   * @typedef {ButtonOptions|SelectMenuOptions|InputTextOptions} ActionRowComponentOptions
   */

  /**
   * Data that can be resolved into components that can be placed in an action row
   * * ActionRowComponent
   * * ActionRowComponentOptions
   * @typedef {ActionRowComponent|ActionRowComponentOptions} ActionRowComponentResolvable
   */

  /**
   * @typedef {BaseComponentOptions} ActionRowOptions
   * @property {ActionRowComponentResolvable[]} [components]
   * The components to place in this action row
   */

  /**
   * @param {ActionRow|ActionRowOptions} [data={}] ActionRow to clone or raw data
   * @param {Client} [client] The client constructing this ActionRow, if provided
   */
  constructor(data = {}, client = null) {
    super({ type: 'ACTION_ROW' });

    /**
     * The components in this action row
     * @type {ActionRowComponent[]}
     */
    this.components = data.components?.map(c => Components.create(c, client)) ?? [];
  }

  /**
   * Adds components to the action row.
   * @param {...ActionRowComponentResolvable[]} components The components to add
   * @returns {ActionRow}
   */
  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map(c => Components.create(c)));
    return this;
  }

  /**
   * Sets the components of the action row.
   * @param {...ActionRowComponentResolvable[]} components The components to set
   * @returns {ActionRow}
   */
  setComponents(...components) {
    return this.spliceComponents(0, this.components.length, components);
  }

  /**
   * Removes, replaces, and inserts components in the action row.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of components to remove
   * @param {...ActionRowComponentResolvable[]} [components] The replacing components
   * @returns {ActionRow}
   */
  spliceComponents(index, deleteCount, ...components) {
    this.components.splice(index, deleteCount, ...components.flat(Infinity).map(c => Components.create(c)));
    return this;
  }

  /**
   * Transforms the action row to a plain object.
   * @returns {APIMessageComponent} The raw data of this action row
   */
  toJSON() {
    return {
      components: this.components.map(c => c.toJSON()),
      type: ComponentTypes[this.type],
    };
  }
}

module.exports = ActionRow;

/**
 * @external APIMessageComponent
 * @see {@link https://discord.com/developers/docs/interactions/message-components#component-object}
 */
