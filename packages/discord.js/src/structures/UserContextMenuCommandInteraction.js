'use strict';

const ContextMenuCommandInteraction = require('./ContextMenuCommandInteraction');

/**
 * Represents a user context menu interaction.
 * @extends {ContextMenuCommandInteraction}
 */
class UserContextMenuCommandInteraction extends ContextMenuCommandInteraction {
  /**
   * The user this interaction was sent from
   * @type {User}
   * @readonly
   */
  get targetUser() {
    return this.options.getUser('user');
  }

  /**
   * The member this interaction was sent from
   * @type {?(GuildMember|APIGuildMember)}
   * @readonly
   */
  get targetMember() {
    return this.options.getMember('user');
  }
}

module.exports = UserContextMenuCommandInteraction;
