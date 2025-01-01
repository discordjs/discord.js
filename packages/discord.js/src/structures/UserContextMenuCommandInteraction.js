'use strict';

const ContextMenuCommandInteraction = require('./ContextMenuCommandInteraction');

/**
 * Represents a user context menu interaction.
 * @extends {ContextMenuCommandInteraction}
 */
class UserContextMenuCommandInteraction extends ContextMenuCommandInteraction {
  /**
   * The target user from this interaction
   * @type {User}
   * @readonly
   */
  get targetUser() {
    return this.options.getUser('user');
  }

  /**
   * The target member from this interaction
   * @type {?(GuildMember|MinimalGuildMember)}
   * @readonly
   */
  get targetMember() {
    return this.options.getMember('user');
  }
}

module.exports = UserContextMenuCommandInteraction;
