'use strict';

const ContextMenuCommandInteraction = require('./ContextMenuCommandInteraction');

/**
 * Represents a user context menu interaction.
 * @extends {ContextMenuCommandInteraction}
 */
class UserContextMenuCommandInteraction extends ContextMenuCommandInteraction {
  /**
   * The user of the target for this interaction
   * @type {User}
   * @readonly
   */
  get targetUser() {
    return this.options.getUser('user');
  }

  /**
   * The member of the target for this interaction
   * @type {?(GuildMember|APIGuildMember)}
   * @readonly
   */
  get targetMember() {
    return this.options.getMember('user');
  }
}

module.exports = UserContextMenuCommandInteraction;
