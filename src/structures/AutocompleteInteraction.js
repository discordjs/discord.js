'use strict';

const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const Interaction = require('./Interaction');
const { Error } = require('../errors');
const { InteractionResponseTypes, ApplicationCommandOptionTypes } = require('../util/Constants');

/**
 * Represents an autocomplete interaction.
 * @extends {Interaction}
 */
class AutocompleteInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The id of the channel this interaction was sent in
     * @type {Snowflake}
     * @name AutocompleteInteraction#channelId
     */

    /**
     * The invoked application command's id
     * @type {Snowflake}
     */
    this.commandId = data.data.id;

    /**
     * The invoked application command's name
     * @type {string}
     */
    this.commandName = data.data.name;

    /**
     * Whether this interaction has already received a response
     * @type {boolean}
     */
    this.responded = false;

    /**
     * The options passed to the command
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new CommandInteractionOptionResolver(
      this.client,
      data.data.options?.map(option => this.transformOption(option, data.data.resolved)) ?? [],
    );
  }

  /**
   * The invoked application command, if it was fetched before
   * @type {?ApplicationCommand}
   */
  get command() {
    const id = this.commandId;
    return this.guild?.commands.cache.get(id) ?? this.client.application.commands.cache.get(id) ?? null;
  }

  /**
   * Transforms an option received from the API.
   * @param {APIApplicationCommandOption} option The received option
   * @returns {CommandInteractionOption}
   * @private
   */
  transformOption(option) {
    const result = {
      name: option.name,
      type: ApplicationCommandOptionTypes[option.type],
    };

    if ('value' in option) result.value = option.value;
    if ('options' in option) result.options = option.options.map(opt => this.transformOption(opt));
    if ('focused' in option) result.focused = option.focused;

    return result;
  }

  /**
   * Sends results for the autocomplete of this interaction.
   * @param {ApplicationCommandOptionChoiceData[]} options The options for the autocomplete
   * @returns {Promise<void>}
   * @example
   * // respond to autocomplete interaction
   * interaction.respond([
   *  {
   *    name: 'Option 1',
   *    value: 'option1',
   *  },
   * ])
   *  .then(console.log)
   *  .catch(console.error);
   */
  async respond(options) {
    if (this.responded) throw new Error('INTERACTION_ALREADY_REPLIED');

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: { choices: { ...options, name_localizations: options.nameLocalizations } },
      },
      auth: false,
    });
    this.responded = true;
  }
}

module.exports = AutocompleteInteraction;
