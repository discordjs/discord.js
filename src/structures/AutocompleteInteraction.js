'use strict';

const BaseCommandInteraction = require('./BaseCommandInteraction');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const { InteractionResponseTypes } = require('../util/Constants');

/**
 * Represents an autocomplete interaction.
 * @extends {BaseCommandInteraction}
 */
class AutocompleteInteraction extends BaseCommandInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * The options passed to the command
     * @type {CommandInteractionOptionResolver}
     */
    this.options = new CommandInteractionOptionResolver(
      this.client,
      data.data.options?.map(option => this.transformOption(option, data.data.resolved)) ?? [],
      this.transformResolved(data.data.resolved ?? {}),
    );
  }

  /**
   * Sends results for the autocomplete of this interaction.
   * @param {InteractionResultOptions} options The options for the autocomplete
   * @returns {Promise<void>}
   * @example
   * // respond to autocomplete interaction
   * interaction.result([
   *  {
   *    name: 'Option 1',
   *    value: 'option1',
   *  },
   * ])
   *  .then(console.log)
   *  .catch(console.error);
   */
  async result(options) {
    if (this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: options,
      },
    });
    this.replied = true;
  }
}

module.exports = AutocompleteInteraction;
