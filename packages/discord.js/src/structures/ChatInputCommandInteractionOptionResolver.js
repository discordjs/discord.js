'use strict';

const { ApplicationCommandOptionType } = require('discord-api-types/v10');
const InteractionOptionResolver = require('./InteractionOptionResolver');
const { ErrorCodes } = require('../errors');

/**
 * A resolver for chat input interaction options.
 * @extends {InteractionOptionResolver}
 */
class ChatInputCommandInteractionOptionResolver extends InteractionOptionResolver {
  constructor(client, options, resolved) {
    super(client, options, resolved);
    /**
     * The name of the subcommand group.
     * @type {?string}
     * @private
     */
    this._group = null;

    /**
     * The name of the subcommand.
     * @type {?string}
     * @private
     */
    this._subcommand = null;

    // Hoist subcommand group if present
    if (this._hoistedOptions[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
      this._group = this._hoistedOptions[0].name;
      this._hoistedOptions = this._hoistedOptions[0].options ?? [];
    }
    // Hoist subcommand if present
    if (this._hoistedOptions[0]?.type === ApplicationCommandOptionType.Subcommand) {
      this._subcommand = this._hoistedOptions[0].name;
      this._hoistedOptions = this._hoistedOptions[0].options ?? [];
    }
  }

  /**
   * Gets the selected subcommand.
   * @param {boolean} [required=true] Whether to throw an error if there is no subcommand.
   * @returns {?string} The name of the selected subcommand, or null if not set and not required.
   */
  getSubcommand(required = true) {
    if (required && !this._subcommand) {
      throw new TypeError(ErrorCodes.CommandInteractionOptionNoSubcommand);
    }
    return this._subcommand;
  }

  /**
   * Gets the selected subcommand group.
   * @param {boolean} [required=false] Whether to throw an error if there is no subcommand group.
   * @returns {?string} The name of the selected subcommand group, or null if not set and not required.
   */
  getSubcommandGroup(required = false) {
    if (required && !this._group) {
      throw new TypeError(ErrorCodes.CommandInteractionOptionNoSubcommandGroup);
    }
    return this._group;
  }

  /**
   * Gets a boolean option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?boolean} The value of the option, or null if not set and not required.
   */
  getBoolean(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Boolean, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a channel option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(GuildChannel|ThreadChannel|APIChannel)}
   * The value of the option, or null if not set and not required.
   */
  getChannel(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Channel, ['channel'], required);
    return option?.channel ?? null;
  }

  /**
   * Gets a string option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?string} The value of the option, or null if not set and not required.
   */
  getString(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.String, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets an integer option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getInteger(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Integer, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a number option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getNumber(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Number, ['value'], required);
    return option?.value ?? null;
  }

  /**
   * Gets a user option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?User} The value of the option, or null if not set and not required.
   */
  getUser(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.User, ['user'], required);
    return option?.user ?? null;
  }

  /**
   * Gets a member option.
   * @param {string} name The name of the option.
   * @returns {?(GuildMember|APIGuildMember)}
   * The value of the option, or null if the user is not present in the guild or the option is not set.
   */
  getMember(name) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.User, ['member'], false);
    return option?.member ?? null;
  }

  /**
   * Gets a role option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(Role|APIRole)} The value of the option, or null if not set and not required.
   */
  getRole(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Role, ['role'], required);
    return option?.role ?? null;
  }

  /**
   * Gets an attachment option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?Attachment} The value of the option, or null if not set and not required.
   */
  getAttachment(name, required = false) {
    const option = this._getTypedOption(name, ApplicationCommandOptionType.Attachment, ['attachment'], required);
    return option?.attachment ?? null;
  }

  /**
   * Gets a mentionable option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(User|GuildMember|APIGuildMember|Role|APIRole)}
   * The value of the option, or null if not set and not required.
   */
  getMentionable(name, required = false) {
    const option = this._getTypedOption(
      name,
      ApplicationCommandOptionType.Mentionable,
      ['user', 'member', 'role'],
      required,
    );
    return option?.member ?? option?.user ?? option?.role ?? null;
  }
}

module.exports = ChatInputCommandInteractionOptionResolver;
