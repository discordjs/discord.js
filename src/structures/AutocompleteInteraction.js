'use strict';

const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const Interaction = require('./Interaction');
const { InteractionResponseTypes, ApplicationCommandOptionTypes } = require('../util/Constants');

/**
 * Represents an autocomplete interaction.
 * @extends {Interaction}
 */
class AutocompleteInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

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
   * @param {ApplicationCommandOptionChoice[]} options The options for the autocomplete
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
    if (this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: {
          choices: options,
        },
      },
    });
    this.replied = true;
  }
}

module.exports = AutocompleteInteraction;
