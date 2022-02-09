'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * Represents an action row containing message components.
 * @extends {BaseMessageComponent}
 */
class ModalActionRow extends BaseMessageComponent {
  /**
   * Components that can be placed in an action row
   * * InputTextComponent
   * @typedef {InputTextComponent} ModalActionRowComponent
   */

  /**
   * Options for components that can be placed in an action row
   * * InputTextComponentOptions
   * @typedef {InputTextComponentOptions} ModalActionRowComponentOptions
   */

  /**
   * Data that can be resolved into components that can be placed in an action row
   * * ModalActionRowComponent
   * * ModalActionRowComponentOptions
   * @typedef {ModalActionRowComponent|ModalActionRowComponentOptions} ModalActionRowComponentResolvable
   */

  /**
   * @typedef {BaseMessageComponentOptions} ModalActionRowOptions
   * @property {ModalActionRowComponentResolvable[]} [components]
   * The components to place in this action row
   */

  /**
   * @param {ModalActionRow|ModalActionRowOptions} [data={}] ModalActionRow to clone or raw data
   * @param {Client} [client] The client constructing this ModalActionRow, if provided
   */
  constructor(data = {}, client = null) {
    super({ type: 'ACTION_ROW' });

    /**
     * The components in this action row
     * @type {ModalActionRowComponent[]}
     */
    this.components = data.components?.map(c => BaseMessageComponent.create(c, client)) ?? [];
  }

  /**
   * Adds components to the action row.
   * @param {...ModalActionRowComponentResolvable[]} components The components to add
   * @returns {ModalActionRow}
   */
  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  /**
   * Sets the components of the action row.
   * @param {...ModalActionRowComponentResolvable[]} components The components to set
   * @returns {ModalActionRow}
   */
  setComponents(...components) {
    this.spliceComponents(0, this.components.length, components);
    return this;
  }

  /**
   * Removes, replaces, and inserts components in the action row.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of components to remove
   * @param {...ModalActionRowComponentResolvable[]} [components] The replacing components
   * @returns {ModalActionRow}
   */
  spliceComponents(index, deleteCount, ...components) {
    this.components.splice(index, deleteCount, ...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  /**
   * Transforms the action row to a plain object.
   * @returns {APIMessageComponent} The raw data of this action row
   */
  toJSON() {
    return {
      components: this.components.map(c => c.toJSON()),
      type: MessageComponentTypes[this.type],
    };
  }
}

module.exports = ModalActionRow;

/**
 * @external APIMessageComponent
 * @see {@link https://discord.com/developers/docs/interactions/message-components#component-object}
 */
