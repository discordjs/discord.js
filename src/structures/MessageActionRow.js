'use strict';

const MessageComponent = require('./BaseMessageComponent');

/**
 * Represents an ActionRow containing message components.
 */
class MessageActionRow extends MessageComponent {
  /**
   * @typedef {BaseMessageComponentOptions|MessageActionRowOptions|MessageButtonOptions} MessageComponentOptions
   */

  /**
   * @typedef {BaseMessageComponent|MessageActionRow|MessageButton} MessageComponent
   */

  /**
   * @typedef {MessageComponentOptions|MessageComponent} MessageComponentResolvable
   */

  /**
   * @typedef {Object} MessageActionRowOptions
   * @property {(MessageComponent|MessageComponentOptions)[]} [components] The components to place in this ActionRow
   */

  /**
   * @param {MessageActionRow|MessageActionRowOptions} [data={}] MessageActionRow to clone or raw data
   */
  constructor(data = {}) {
    super({ type: 'ACTION_ROW' });

    this.components = (data.components ?? []).map(MessageComponent.create);
  }

  /**
   * Adds a component to the row (max 5).
   * @param {MessageComponent|MessageComponentOptions} component The component to add
   * @returns {MessageEmbed}
   */
  addComponent(component) {
    return this.addButtons({ ...component });
  }

  /**
   * Adds components to the row (max 5).
   * @param {...(MessageComponent|MessageComponentOptions)[]} components The components to add
   * @returns {MessageEmbed}
   */
  addComponents(...components) {
    this.components.push(...components.map(MessageComponent.create));
    return this;
  }
}

module.exports = MessageActionRow;
