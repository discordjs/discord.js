import { ContextMenuCommandInteraction } from './ContextMenuCommandInteraction.js';

/**
 * Represents a user context menu interaction.
 *
 * @extends {ContextMenuCommandInteraction}
 */
export class UserContextMenuCommandInteraction extends ContextMenuCommandInteraction {
  /**
   * The target user from this interaction
   *
   * @type {User}
   * @readonly
   */
  get targetUser() {
    return this.options.getUser('user');
  }

  /**
   * The target member from this interaction
   *
   * @type {?(GuildMember|APIGuildMember)}
   * @readonly
   */
  get targetMember() {
    return this.options.getMember('user');
  }
}
