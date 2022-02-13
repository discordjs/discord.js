'use strict';

const Components = require('./Components');

/**
 * @typedef {Object} ModalData
 * @property {string} customId
 * @property {string} title
 * @property {ActionRowData[]} components
 */

class Modals extends null {
  /**
   * Transforms json data into api-compatible json data.
   * @param {ModalData|APIModalInteractionResponseCallbackData} data The data to transform.
   * @returns {APIMessageComponent|APIModalComponent}
   */
  static transformJSON(data) {
    return {
      title: data?.title,
      custom_id: data?.customId ?? data?.custom_id,
      components: data?.components?.map(component => Components.transformJSON(component)),
    };
  }
}

module.exports = Modals;
