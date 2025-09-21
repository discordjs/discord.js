'use strict';

const Attachment = require('./Attachment');
const BaseInteraction = require('./BaseInteraction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');

/**
 * Represents a command interaction.
 * @extends {BaseInteraction}
 * @implements {InteractionResponses}
 * @abstract
 */
class CommandInteraction extends BaseInteraction {
  constructor(client, data) {
    super(client, data);

    /**
     * The id of the channel this interaction was sent in
     * @type {Snowflake}
     * @name CommandInteraction#channelId
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
     * The invoked application command's type
     * @type {ApplicationCommandType}
     */
    this.commandType = data.data.type;

    /**
     * The id of the guild the invoked application command is registered to
     * @type {?Snowflake}
     */
    this.commandGuildId = data.data.guild_id ?? null;

    /**
     * Whether the reply to this interaction has been deferred
     * @type {boolean}
     */
    this.deferred = false;

    /**
     * Whether this interaction has already been replied to
     * @type {boolean}
     */
    this.replied = false;

    /**
     * Whether the reply to this interaction is ephemeral
     * @type {?boolean}
     */
    this.ephemeral = null;

    /**
     * An associated interaction webhook, can be used to further interact with this interaction
     * @type {InteractionWebhook}
     */
    this.webhook = new InteractionWebhook(this.client, this.applicationId, this.token);
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
   * @typedef {Object} BaseInteractionResolvedData
   * @property {Collection<Snowflake, User>} [users] The resolved users
   * @property {Collection<Snowflake, GuildMember|APIGuildMember>} [members] The resolved guild members
   * @property {Collection<Snowflake, Role|APIRole>} [roles] The resolved roles
   * @property {Collection<Snowflake, BaseChannel|APIChannel>} [channels] The resolved channels
   */

  /**
   * Represents the resolved data of a received command interaction.
   *
   * @typedef {BaseInteractionResolvedData} CommandInteractionResolvedData
   * @property {Collection<Snowflake, Message|APIMessage>} [messages] The resolved messages
   * @property {Collection<Snowflake, Attachment>} [attachments] The resolved attachments
   */

  /**
   * Represents an option of a received command interaction.
   * @typedef {Object} CommandInteractionOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {boolean} [autocomplete] Whether the autocomplete interaction is enabled for a
   * {@link ApplicationCommandOptionType.String}, {@link ApplicationCommandOptionType.Integer} or
   * {@link ApplicationCommandOptionType.Number} option
   * @property {string|number|boolean} [value] The value of the option
   * @property {CommandInteractionOption[]} [options] Additional options if this option is a
   * subcommand (group)
   * @property {User} [user] The resolved user
   * @property {GuildMember|APIGuildMember} [member] The resolved member
   * @property {GuildChannel|ThreadChannel|APIChannel} [channel] The resolved channel
   * @property {Role|APIRole} [role] The resolved role
   * @property {Attachment} [attachment] The resolved attachment
   */

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
      type: option.type,
    };

    if ('value' in option) result.value = option.value;
    if ('options' in option) result.options = option.options.map(opt => this.transformOption(opt, resolved));

    if (resolved) {
      const user = resolved.users?.[option.value];
      if (user) result.user = this.client.users._add(user);

      const member = resolved.members?.[option.value];
      if (member) result.member = this.guild?.members._add({ user, ...member }) ?? member;

      const channel = resolved.channels?.[option.value];
      if (channel) result.channel = this.client.channels._add(channel, this.guild) ?? channel;

      const role = resolved.roles?.[option.value];
      if (role) result.role = this.guild?.roles._add(role) ?? role;

      const attachment = resolved.attachments?.[option.value];
      if (attachment) result.attachment = new Attachment(attachment);
    }

    return result;
  }

  // These are here only for documentation purposes - they are implemented by InteractionResponses
  /* eslint-disable no-empty-function */
  deferReply() {}
  reply() {}
  fetchReply() {}
  editReply() {}
  deleteReply() {}
  followUp() {}
  launchActivity() {}
  showModal() {}
  sendPremiumRequired() {}
  awaitModalSubmit() {}
}

InteractionResponses.applyToClass(CommandInteraction, ['deferUpdate', 'update']);

module.exports = CommandInteraction;
