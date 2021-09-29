'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../util/Constants');

/**
 * Represents an action row containing message components.
 * @extends {BaseMessageComponent}
 */
class MessageActionRow extends BaseMessageComponent {
  /**
   * Components that can be placed in an action row
   * * MessageButton
   * * MessageSelectMenu
   * @typedef {MessageButton|MessageSelectMenu} MessageActionRowComponent
   */

  /**
   * Options for components that can be placed in an action row
   * * MessageButtonOptions
   * * MessageSelectMenuOptions
   * @typedef {MessageButtonOptions|MessageSelectMenuOptions} MessageActionRowComponentOptions
   */

  /**
   * Data that can be resolved into components that can be placed in an action row
   * * MessageActionRowComponent
   * * MessageActionRowComponentOptions
   * @typedef {MessageActionRowComponent|MessageActionRowComponentOptions} MessageActionRowComponentResolvable
   */

  /**
   * @typedef {BaseMessageComponentOptions} MessageActionRowOptions
   * @property {MessageActionRowComponentResolvable[]} [components]
   * The components to place in this action row
   */

  /**
   * @param {MessageActionRow|MessageActionRowOptions} [data={}] MessageActionRow to clone or raw data
   * @param {Client} [client] The client constructing this MessageActionRow, if provided
   */
  constructor(data = {}, client = null) {
    super({ type: 'ACTION_ROW' });

    /**
     * The components in this action row
     * @type {MessageActionRowComponent[]}
     */
    this.components = data.components?.map(c => BaseMessageComponent.create(c, client)) ?? [];
  }

  /**
   * Adds components to the action row.
   * @param {...MessageActionRowComponentResolvable[]} components The components to add
   * @returns {MessageActionRow}
   */
  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  /**
   * Sets the components of the action row.
   * @param {...MessageActionRowComponentResolvable[]} components The components to set
   * @returns {MessageActionRow}
   */
  setComponents(...components) {
    this.spliceComponents(0, this.components.length, components);
    return this;
  }

  /**
   * Removes, replaces, and inserts components in the action row.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of components to remove
   * @param {...MessageActionRowComponentResolvable[]} [components] The replacing components
   * @returns {MessageActionRow}
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

module.exports = MessageActionRow;

/**
 * @external APIMessageComponent
 * @see {@link https://discord.com/developers/docs/interactions/message-components#component-object}
 */
