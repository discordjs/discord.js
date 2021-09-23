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
   * @param {APIInteractionDataResolved} resolved The resolved interaction data
   * @returns {CommandInteractionOption}
   * @private
   */
  transformOption(option, resolved) {
    const result = {
      name: option.name,
      type: ApplicationCommandOptionTypes[option.type],
    };

    if ('value' in option) result.value = option.value;
    if ('options' in option) result.options = option.options.map(opt => this.transformOption(opt, resolved));
    if ('focused' in option) result.focused = option.focused;

    if (resolved) {
      const user = resolved.users?.[option.value];
      if (user) result.user = this.client.users._add(user);

      const member = resolved.members?.[option.value];
      if (member) result.member = this.guild?.members._add({ user, ...member }) ?? member;

      const channel = resolved.channels?.[option.value];
      if (channel) result.channel = this.client.channels._add(channel, this.guild) ?? channel;

      const role = resolved.roles?.[option.value];
      if (role) result.role = this.guild?.roles._add(role) ?? role;
    }

    return result;
  }

  /**
   * Sends results for the autocomplete of this interaction.
   * @param {ApplicationCommandOptionChoice[]} options The options for the autocomplete
   * @returns {Promise<void>}
   * @example
   * // respond to autocomplete interaction
   * interaction.sendResult([
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
        data: {
          choices: options,
        },
      },
    });
    this.replied = true;
  }
}

module.exports = AutocompleteInteraction;
