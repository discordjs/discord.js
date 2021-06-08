'use strict';

const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');
const Collection = require('../util/Collection');
const { ApplicationCommandOptionTypes } = require('../util/Constants');

/**
 * Represents a command interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 */
class CommandInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The channel this interaction was sent in
     * @type {?TextChannel|NewsChannel|DMChannel}
     * @name CommandInteraction#channel
     * @readonly
     */

    /**
     * The ID of the channel this interaction was sent in
     * @type {Snowflake}
     * @name CommandInteraction#channelID
     */

    /**
     * The ID of the invoked application command
     * @type {Snowflake}
     */
    this.commandID = data.data.id;

    /**
     * The name of the invoked application command
     * @type {string}
     */
    this.commandName = data.data.name;

    /**
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * The options passed to the command.
     * @type {Collection<string, CommandInteractionOption>}
     */
    this.options = this._createOptionsCollection(data.data.options, data.data.resolved);

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationID, this.token);
  }

  /**
   * The invoked application command, if it was fetched before
   * @type {?ApplicationCommand}
   */
  get command() {
    const id = this.commandID;
    return this.guild?.commands.cache.get(id) ?? this.client.application.commands.cache.get(id) ?? null;
  }

  /**
   * Represents an option of a received command interaction.
   * @typedef {Object} CommandInteractionOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string|number|boolean} [value] The value of the option
   * @property {Collection<string, CommandInteractionOption>} [options] Additional options if this option is a
   * subcommand (group)
   * @property {User} [user] The resolved user
   * @property {GuildMember|Object} [member] The resolved member
   * @property {GuildChannel|Object} [channel] The resolved channel
   * @property {Role|Object} [role] The resolved role
   */

  /**
   * Transforms an option received from the API.
   * @param {Object} option The received option
   * @param {Object} resolved The resolved interaction data
   * @returns {CommandInteractionOption}
   * @private
   */
  transformOption(option, resolved) {
    const result = {
      name: option.name,
      type: ApplicationCommandOptionTypes[option.type],
    };

    if ('value' in option) result.value = option.value;
    if ('options' in option) result.options = this._createOptionsCollection(option.options, resolved);

    const user = resolved?.users?.[option.value];
    if (user) result.user = this.client.users.add(user);

    const member = resolved?.members?.[option.value];
    if (member) result.member = this.guild?.members.add({ user, ...member }) ?? member;

    const channel = resolved?.channels?.[option.value];
    if (channel) result.channel = this.client.channels.add(channel, this.guild) ?? channel;

    const role = resolved?.roles?.[option.value];
    if (role) result.role = this.guild?.roles.add(role) ?? role;

    return result;
  }

  /**
   * Creates a collection of options from the received options array.
   * @param {Object[]} options The received options
   * @param {Object} resolved The resolved interaction data
   * @returns {Collection<string, CommandInteractionOption>}
   * @private
   */
  _createOptionsCollection(options, resolved) {
    const optionsCollection = new Collection();
    if (typeof options === 'undefined') return optionsCollection;
    for (const option of options) {
      optionsCollection.set(option.name, this.transformOption(option, resolved));
    }
    return optionsCollection;
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  defer() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
}

InteractionResponses.applyToClass(CommandInteraction, ['deferUpdate', 'update']);

module.exports = CommandInteraction;
