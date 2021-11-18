'use strict';

const ContextMenuInteraction = require('./ContextMenuInteraction');

/**
 * Represents a user context menu interaction.
 * @extends {ContextMenuInteraction}
 */
class UserContextMenuInteraction extends ContextMenuInteraction {
  /**
   * The user this interaction was sent from
   * @type {User}
   * @readonly
   */
  get user() {
    return this.options.getUser('user');
  }
}

module.exports = UserContextMenuInteraction;
