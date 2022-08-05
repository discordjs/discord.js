'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const InteractionOptionResolver = require('./InteractionOptionResolver');

/**
 * A resolver for context menu interaction options.
 * @extends {InteractionOptionResolver}
 */
class ContextMenuCommandInteractionOptionResolver extends InteractionOptionResolver {
  /**
   * Gets a user option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?User} The value of the option, or null if not set and not required.
   */
  getUser(required = false) {
    const option = this._getTypedOption('user', ApplicationCommandOptionType.User, ['user'], required);
    return option?.user ?? null;
  }

  /**
   * Gets a member option.
   * @returns {?(GuildMember|APIGuildMember)}
   * The value of the option, or null if the user is not present in the guild or the option is not set.
   */
  getMember() {
    const option = this._getTypedOption('user', ApplicationCommandOptionType.User, ['member'], false);
    return option?.member ?? null;
  }

  /**
   * Gets a message option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?Message}
   * The value of the option, or null if not set and not required.
   */
  getMessage(required = false) {
    const option = this._getTypedOption('message', '_MESSAGE', ['message'], required);
    return option?.message ?? null;
  }
}

module.exports = ContextMenuCommandInteractionOptionResolver;
