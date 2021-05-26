'use strict';

const APIMessage = require('./APIMessage');
const Interaction = require('./Interaction');
const WebhookClient = require('../client/WebhookClient');
const { Error } = require('../errors');
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
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * The options passed to the command.
     * @type {CommandInteractionOption[]}
     */
    this.options = data.data.options?.map(o => this.transformOption(o, data.data.resolved)) ?? [];

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * An associated webhook client, can be used to create deferred replies
     * @type {WebhookClient}
     */
    this.webhook = new WebhookClient(this.applicationID, this.token, this.client.options);
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
   * Options for deferring the reply to a {@link CommandInteraction}.
   * @typedef {InteractionDeferOptions}
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   */

  /**
   * Defers the reply to this interaction.
   * @param {InteractionDeferOptions} [options] Options for deferring the reply to this interaction
   * @returns {Promise<void>}
   * @example
   * // Defer the reply to this interaction
   * interaction.defer()
   *   .then(console.log)
   *   .catch(console.error)
   * @example
   * // Defer to send an ephemeral reply later
   * interaction.defer({ ephemeral: true })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async defer({ ephemeral } = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: ephemeral ? MessageFlags.FLAGS.EPHEMERAL : undefined,
        },
      },
    });
    this.deferred = true;
  }

  /**
   * Options for a reply to an interaction.
   * @typedef {BaseMessageOptions} InteractionReplyOptions
   * @property {boolean} [ephemeral] Whether the reply should be ephemeral
   * @property {MessageEmbed[]|Object[]} [embeds] An array of embeds for the message
   */

  /**
   * Creates a reply to this interaction.
   * @param {string|APIMessage|MessageAdditions} content The content for the reply
   * @param {InteractionReplyOptions} [options] Additional options for the reply
   * @returns {Promise<void>}
   * @example
   * // Reply to the interaction with an embed
   * const embed = new MessageEmbed().setDescription('Pong!');
   *
   * interaction.reply(embed)
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create an ephemeral reply
   * interaction.reply('Pong!', { ephemeral: true })
   *   .then(console.log)
   *   .catch(console.error);
   */
  async reply(content, options) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
    const { data, files } = await apiMessage.resolveData().resolveFiles();

    await this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
      files,
    });
    this.replied = true;
  }

  /**
   * Fetches the initial reply to this interaction.
   * @see Webhook#fetchMessage
   * @returns {Promise<Message|Object>}
   * @example
   * // Fetch the reply to this interaction
   * interaction.fetchReply()
   *   .then(reply => console.log(`Replied with ${reply.content}`))
   *   .catch(console.error);
   */
  async fetchReply() {
    const raw = await this.webhook.fetchMessage('@original');
    return this.channel?.messages.add(raw) ?? raw;
  }

  /**
   * Edits the initial reply to this interaction.
   * @see Webhook#editMessage
   * @param {string|APIMessage|MessageAdditions} content The new content for the message
   * @param {WebhookEditMessageOptions} [options] The options to provide
   * @returns {Promise<Message|Object>}
   * @example
   * // Edit the reply to this interaction
   * interaction.editReply('New content')
   *   .then(console.log)
   *   .catch(console.error);
   */
  async editReply(content, options) {
    const raw = await this.webhook.editMessage('@original', content, options);
    return this.channel?.messages.add(raw) ?? raw;
  }

  /**
   * Deletes the initial reply to this interaction.
   * @see Webhook#deleteMessage
   * @returns {Promise<void>}
   * @example
   * // Delete the reply to this interaction
   * interaction.deleteReply()
   *   .then(console.log)
   *   .catch(console.error);
   */
  async deleteReply() {
    await this.webhook.deleteMessage('@original');
  }

  /**
   * Represents an option of a received command interaction.
   * @typedef {Object} CommandInteractionOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string|number|boolean} [value] The value of the option
   * @property {CommandInteractionOption[]} [options] Additional options if this option is a subcommand (group)
   * @property {User} [user] The resolved user
   * @property {GuildMember|Object} [member] The resolved member
   * @property {GuildChannel|Object} [channel] The resolved channel
   * @property {Role|Object} [role] The resolved role
   */

  /**
   * Send a follow-up message to this interaction.
   * @param {string|APIMessage|MessageAdditions} content The content for the reply
   * @param {InteractionReplyOptions} [options] Additional options for the reply
   * @returns {Promise<Message|Object>}
   */
  async followUp(content, options) {
    const apiMessage = content instanceof APIMessage ? content : APIMessage.create(this, content, options);
    const { data, files } = await apiMessage.resolveData().resolveFiles();

    const raw = await this.client.api.webhooks(this.applicationID, this.token).post({
      data,
      files,
    });

    return this.channel?.messages.add(raw) ?? raw;
  }

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
    if ('options' in option) result.options = option.options.map(o => this.transformOption(o, resolved));

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
}

module.exports = CommandInteraction;
