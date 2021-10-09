'use strict';

const { Collection } = require('@discordjs/collection');
const Interaction = require('./Interaction');
const InteractionWebhook = require('./InteractionWebhook');
const InteractionResponses = require('./interfaces/InteractionResponses');
const { ApplicationCommandOptionTypes } = require('../util/Constants');

/**
 * Represents a command interaction.
 * @extends {Interaction}
 * @implements {InteractionResponses}
 * @abstract
 */
class BaseCommandInteraction extends Interaction {
  constructor(client, data) {
    super(client, data);

    /**
     * The channel this interaction was sent in
     * @type {?TextBasedChannels}
     * @name BaseCommandInteraction#channel
     * @readonly
     */

    /**
     * The id of the channel this interaction was sent in
     * @type {Snowflake}
     * @name BaseCommandInteraction#channelId
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
   * Represents the resolved data of a received command interaction.
   * @typedef {Object} CommandInteractionResolvedData
   * @property {Collection<Snowflake, User>} [users] The resolved users
   * @property {Collection<Snowflake, GuildMember|APIGuildMember>} [members] The resolved guild members
   * @property {Collection<Snowflake, Role|APIRole>} [roles] The resolved roles
   * @property {Collection<Snowflake, Channel|APIChannel>} [channels] The resolved channels
   * @property {Collection<Snowflake, Message|APIMessage>} [messages] The resolved messages
   */

  /**
   * Transforms the resolved received from the API.
   * @param {APIInteractionDataResolved} resolved The received resolved objects
   * @returns {CommandInteractionResolvedData}
   * @private
   */
  transformResolved({ members, users, channels, roles, messages }) {
    const result = {};

    if (members) {
      result.members = new Collection();
      for (const [id, member] of Object.entries(members)) {
        const user = users[id];
        result.members.set(id, this.guild?.members._add({ user, ...member }) ?? member);
      }
    }

    if (users) {
      result.users = new Collection();
      for (const user of Object.values(users)) {
        result.users.set(user.id, this.client.users._add(user));
      }
    }

    if (roles) {
      result.roles = new Collection();
      for (const role of Object.values(roles)) {
        result.roles.set(role.id, this.guild?.roles._add(role) ?? role);
      }
    }

    if (channels) {
      result.channels = new Collection();
      for (const channel of Object.values(channels)) {
        result.channels.set(channel.id, this.client.channels._add(channel, this.guild) ?? channel);
      }
    }

    if (messages) {
      result.messages = new Collection();
      for (const message of Object.values(messages)) {
        result.messages.set(message.id, this.channel?.messages?._add(message) ?? message);
      }
    }

    return result;
  }

  /**
   * Represents an option of a received command interaction.
   * @typedef {Object} CommandInteractionOption
   * @property {string} name The name of the option
   * @property {ApplicationCommandOptionType} type The type of the option
   * @property {string|number|boolean} [value] The value of the option
   * @property {CommandInteractionOption[]} [options] Additional options if this option is a
   * subcommand (group)
   * @property {User} [user] The resolved user
   * @property {GuildMember|APIGuildMember} [member] The resolved member
   * @property {GuildChannel|ThreadChannel|APIChannel} [channel] The resolved channel
   * @property {Role|APIRole} [role] The resolved role
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
      type: ApplicationCommandOptionTypes[option.type],
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
}

InteractionResponses.applyToClass(BaseCommandInteraction, ['deferUpdate', 'update']);

module.exports = BaseCommandInteraction;

/* eslint-disable max-len */
/**
 * @external APIInteractionDataResolved
 * @see {@link https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure}
 */
