'use strict';

const APIMessage = require('./APIMessage');
const Interaction = require('./Interaction');
const WebhookClient = require('../client/WebhookClient');
const { ApplicationCommandOptionTypes, InteractionResponseTypes } = require('../util/Constants');
const MessageFlags = require('../util/MessageFlags');

/**
 * Represents a command interaction.
 * @extends {Interaction}
 */
class CommandInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

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
     * The options passed to the command.
     * @type {CommandInteractionOption[]}
     */
    this.options = data.data.options?.map(o => this.constructor.transformOption(o, data.data.resolved)) ?? [];

    /**
     * An associated webhook client, can be used to create deferred replies
     * @type {WebhookClient}
     */
    this.webhook = new WebhookClient(this.client.application.id, this.token);
  }

  /**
   * The invoked application command, if it was fetched before
   * @type {?ApplicationCommand}
   */
  get command() {
    return (this.guild ?? this.client.application).commands.cache.get(this.commandID) ?? null;
  }

  /**
   * Defers the reply to this interaction.
   * @param {boolean} [ephemeral] Whether the reply should be ephemeral
   */
  async defer(ephemeral) {
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
        },
      },
    });
  }

  /**
   * Options for a reply to an interaction.
   * @extends MessageOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   * @typedef {Object} InteractionReplyOptions
   */

  /**
   * Creates a reply to this interaction.
   * @param {StringResolvable|APIMessage} content The content for the reply
   * @param {InteractionReplyOptions|MessageAdditions} [options] Additional options for the reply
   */
  async reply(content, options) {
    const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
    const { data } = apiMessage.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
    });
  }

  /**
   * Represents an option of a received command interaction.
   * @property {string} name The name of the option
   * @property {InteractionType} type The type of the interaction
   * @property {string|number|boolean} [value] The value of the option
   * @property {CommandInteractionOption[]} [options] Additional options if this option is a subcommand (group)
   * @property {User} [user] The resolved user
   * @property {?GuildMember} [member] The resolved member
   * @property {?GuildChannel} [channel] The resolved channel
   * @property {?Role} [role] The resolved role
   * @typedef {Object} CommandInteractionOption
   */

  /**
   * Transforms an option received from the API.
   * @param {Object} option The received option
   * @param {Object} resolved The resolved interaction data
   * @returns {CommandInteractionOption}
   * @private
   */
  static transformOption(option, resolved) {
    const result = {
      name: option.name,
      type: ApplicationCommandOptionTypes[option.type],
    };

    if (option.value) {
      result.value = option.value;
    }

    if (option.options) {
      result.options = option.options.map(o => this.transformOption(o, resolved));
    }

    if (option.type === ApplicationCommandOptionTypes.USER) {
      const user = resolved.users[option.value];
      const member = resolved.members[option.value];
      if (member) member.user = user;

      result.user = this.client.users.add(user);
      result.member = this.guild?.members.add(member) ?? null;
    }

    if (option.type === ApplicationCommandOptionTypes.CHANNEL) {
      const channel = resolved.channels[option.value];
      result.channel = this.client.channels.add(channel, this.guild);
    }

    if (option.type === ApplicationCommandOptionTypes.ROLE) {
      const role = resolved.roles[option.value];
      result.role = this.guild?.roles.add(role) ?? null;
    }

    return result;
  }
}

module.exports = CommandInteraction;
