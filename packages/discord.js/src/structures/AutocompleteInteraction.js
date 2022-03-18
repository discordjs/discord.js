'use strict';

const { InteractionResponseType, Routes } = require('discord-api-types/v10');
const CommandInteractionOptionResolver = require('./CommandInteractionOptionResolver');
const Interaction = require('./Interaction');

/**
 * Represents an autocomplete interaction.
 * @extends {Interaction}
 */
class AutocompleteInteraction extends Interaction {
  constructor(client, data = {}) {
    super(client, data);

    /**
     * The id of the channel this interaction was sent in
     * @type {Snowflake}
     * @name AutocompleteInteraction#channelId
     * @readonly
     */

    /**
     * The raw API data for this interaction
     * @type {RawInteractionData}
     * @name AutocompleteInteraction#data
     * @readonly
     */

    /**
     * Whether this interaction has already received a response
     * @type {boolean}
     */
    this.responded = false;
  }

  /**
   * The invoked application command's id
   * @type {Snowflake}
   * @readonly
   */
  get commandId() {
    return this.data.id;
  }

  /**
   * The invoked application command's name
   * @type {string}
   * @readonly
   */
  get commandName() {
    return this.data.name;
  }

  /**
   * The invoked application command's type
   * @type {ApplicationCommandType.ChatInput}
   * @readonly
   */
  get commandType() {
    return this.data.type;
  }

  /**
   * The options passed to the command
   * @type {CommandInteractionOptionResolver}
   * @readonly
   */
  get options() {
    return new CommandInteractionOptionResolver(this.client, this.data.options ?? []);
  }

  /**
   * The invoked application command, if it was fetched before
   * @type {?ApplicationCommand}
   * @readonly
   */
  get command() {
    const id = this.commandId;
    return this.guild?.commands.cache.get(id) ?? this.client.application.commands.cache.get(id) ?? null;
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
    if (this.responded) throw new Error('INTERACTION_ALREADY_REPLIED');

    await this.client.rest.post(Routes.interactionCallback(this.id, this.token), {
      body: {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices: options,
        },
      },
      auth: false,
    });
    this.responded = true;
  }
}

module.exports = AutocompleteInteraction;
