'use strict';

const BaseMessageComponent = require('./BaseMessageComponent');
const Util = require('../util/Util');

/**
 * Represents a modal (form) to be shown in response to an interaction
 */
class Modal {
  /**
   * @typedef {Object} ModalOptions
   * @property {string} [customId] A unique string to be sent in the interaction when clicked
   * @property {string} [title] The title to be displayed on this modal
   * @property {MessageActionRow[]|MessageActionRowOptions[]} [components]
   * Action rows containing interactive components for the modal (text input components)
   */

  /**
   * @param {Modal|ModalOptions} data Modal to clone or raw data
   * @param {Client} client The client constructing this Modal, if provided
   */
  constructor(data = {}, client = null) {
    /**
     * A list of MessageActionRows in the modal
     * @type {MessageActionRow[]}
     */
    this.components = data.components?.map(c => BaseMessageComponent.create(c, client)) ?? [];

    /**
     * A unique string to be sent in the interaction when submitted
     * @type {?string}
     */
    this.customId = data.custom_id ?? data.customId ?? null;

    /**
     * The title to be displayed on this modal
     * @type {?string}
     */
    this.title = data.title ?? null;
  }

  /**
   * Adds components to the modal.
   * @param {...MessageActionRowResolvable[]} components The components to add
   * @returns {Modal}
   */
  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  /**
   * Sets the components of the modal.
   * @param {...MessageActionRowResolvable[]} components The components to set
   * @returns {Modal}
   */
  setComponents(...components) {
    this.spliceComponents(0, this.components.length, components);
    return this;
  }

  /**
   * Sets the custom id for this modal
   * @param {string} customId A unique string to be sent in the interaction when submitted
   * @returns {Modal}
   */
  setCustomId(customId) {
    this.customId = Util.verifyString(customId, RangeError, 'MODAL_CUSTOM_ID');
    return this;
  }

  /**
   * Removes, replaces, and inserts components in the modal.
   * @param {number} index The index to start at
   * @param {number} deleteCount The number of components to remove
   * @param {...MessageActionRowResolvable[]} [components] The replacing components
   * @returns {Modal}
   */
  spliceComponents(index, deleteCount, ...components) {
    this.components.splice(index, deleteCount, ...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  /**
   * Sets the title of this modal
   * @param {string} title The title to be displayed on this modal
   * @returns {Modal}
   */
  setTitle(title) {
    this.title = Util.verifyString(title, RangeError, 'MODAL_TITLE');
    return this;
  }

  toJSON() {
    return {
      components: this.components.map(c => c.toJSON()),
      custom_id: this.customId,
      title: this.title,
    };
  }
}

module.exports = Modal;
