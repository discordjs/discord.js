'use strict';

const Base = require('./Base');
const { InteractionTypes, MessageComponentTypes, ApplicationCommandTypes } = require('../util/Constants');
const Permissions = require('../util/Permissions');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents an interaction.
 * @extends {Base}
 */
class Interaction extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The interaction's type
     * @type {InteractionType}
     */
    this.type = InteractionTypes[data.type];

    /**
     * The interaction's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The interaction's token
     * @type {string}
     * @name Interaction#token
     * @readonly
     */
    Object.defineProperty(this, 'token', { value: data.token });

    /**
     * The application's id
     * @type {Snowflake}
     */
    this.applicationId = data.application_id;

    /**
     * The id of the channel this interaction was sent in
     * @type {?Snowflake}
     */
    this.channelId = data.channel_id ?? null;

    /**
     * The id of the guild this interaction was sent in
     * @type {?Snowflake}
     */
    this.guildId = data.guild_id ?? null;

    /**
     * The user which sent this interaction
     * @type {User}
     */
    this.user = this.client.users._add(data.user ?? data.member.user);

    /**
     * If this interaction was sent in a guild, the member which sent it
     * @type {?(GuildMember|APIGuildMember)}
     */
    this.member = data.member ? this.guild?.members._add(data.member) ?? data.member : null;

    /**
     * The version
     * @type {number}
     */
    this.version = data.version;

    /**
     * Set of permissions the application or bot has within the channel the interaction was sent from
     * @type {?Readonly<Permissions>}
     */
    this.appPermissions = data.app_permissions ? new Permissions(data.app_permissions).freeze() : null;

    /**
     * The permissions of the member, if one exists, in the channel this interaction was executed in
     * @type {?Readonly<Permissions>}
     */
    this.memberPermissions = data.member?.permissions ? new Permissions(data.member.permissions).freeze() : null;

    /**
     * A Discord locale string, possible values are:
     * * en-US (English, US)
     * * en-GB (English, UK)
     * * bg (Bulgarian)
     * * zh-CN (Chinese, China)
     * * zh-TW (Chinese, Taiwan)
     * * hr (Croatian)
     * * cs (Czech)
     * * da (Danish)
     * * nl (Dutch)
     * * fi (Finnish)
     * * fr (French)
     * * de (German)
     * * el (Greek)
     * * hi (Hindi)
     * * hu (Hungarian)
     * * it (Italian)
     * * ja (Japanese)
     * * ko (Korean)
     * * lt (Lithuanian)
     * * no (Norwegian)
     * * pl (Polish)
     * * pt-BR (Portuguese, Brazilian)
     * * ro (Romanian, Romania)
     * * ru (Russian)
     * * es-ES (Spanish)
     * * sv-SE (Swedish)
     * * th (Thai)
     * * tr (Turkish)
     * * uk (Ukrainian)
     * * vi (Vietnamese)
     * @see {@link https://discord.com/developers/docs/reference#locales}
     * @typedef {string} Locale
     */

    /**
     * The locale of the user who invoked this interaction
     * @type {Locale}
     */
    this.locale = data.locale;

    /**
     * The preferred locale from the guild this interaction was sent in
     * @type {?Locale}
     */
    this.guildLocale = data.guild_locale ?? null;
  }

  /**
   * The timestamp the interaction was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.timestampFrom(this.id);
  }

  /**
   * The time the interaction was created at
   * @type {Date}
   * @readonly
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The channel this interaction was sent in
   * @type {?TextBasedChannels}
   * @readonly
   */
  get channel() {
    return this.client.channels.cache.get(this.channelId) ?? null;
  }

  /**
   * The guild this interaction was sent in
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildId) ?? null;
  }

  /**
   * Indicates whether this interaction is received from a guild.
   * @returns {boolean}
   */
  inGuild() {
    return Boolean(this.guildId && this.member);
  }

  /**
   * Indicates whether or not this interaction is both cached and received from a guild.
   * @returns {boolean}
   */
  inCachedGuild() {
    return Boolean(this.guild && this.member);
  }

  /**
   * Indicates whether or not this interaction is received from an uncached guild.
   * @returns {boolean}
   */
  inRawGuild() {
    return Boolean(this.guildId && !this.guild && this.member);
  }

  /**
   * Indicates whether this interaction is a {@link BaseCommandInteraction}.
   * @returns {boolean}
   */
  isApplicationCommand() {
    return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND;
  }

  /**
   * Indicates whether this interaction is a {@link CommandInteraction}.
   * @returns {boolean}
   */
  isCommand() {
    return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND && typeof this.targetId === 'undefined';
  }

  /**
   * Indicates whether this interaction is a {@link ContextMenuInteraction}
   * @returns {boolean}
   */
  isContextMenu() {
    return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND && typeof this.targetId !== 'undefined';
  }

  /**
   * Indicates whether this interaction is a {@link ModalSubmitInteraction}
   * @returns {boolean}
   */
  isModalSubmit() {
    return InteractionTypes[this.type] === InteractionTypes.MODAL_SUBMIT;
  }

  /**
   * Indicates whether this interaction is a {@link UserContextMenuInteraction}
   * @returns {boolean}
   */
  isUserContextMenu() {
    return this.isContextMenu() && ApplicationCommandTypes[this.targetType] === ApplicationCommandTypes.USER;
  }

  /**
   * Indicates whether this interaction is a {@link MessageContextMenuInteraction}
   * @returns {boolean}
   */
  isMessageContextMenu() {
    return this.isContextMenu() && ApplicationCommandTypes[this.targetType] === ApplicationCommandTypes.MESSAGE;
  }

  /**
   * Indicates whether this interaction is an {@link AutocompleteInteraction}
   * @returns {boolean}
   */
  isAutocomplete() {
    return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
  }

  /**
   * Indicates whether this interaction is a {@link MessageComponentInteraction}.
   * @returns {boolean}
   */
  isMessageComponent() {
    return InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT;
  }

  /**
   * Indicates whether this interaction is a {@link ButtonInteraction}.
   * @returns {boolean}
   */
  isButton() {
    return (
      InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
      MessageComponentTypes[this.componentType] === MessageComponentTypes.BUTTON
    );
  }

  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}.
   * @returns {boolean}
   */
  isAnySelectMenu() {
    return InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT && typeof this.values !== 'undefined';
  }

  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}
   * @returns {boolean}
   * @deprecated Use {@link Interaction#isStringSelect()} instead
   */
  isSelectMenu() {
    return this.isStringSelectMenu();
  }
  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}.with a `STRING_SELECT` type
   * @returns {boolean}
   */
  isStringSelect() {
    return (
      InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
      MessageComponentTypes[this.componentType] === MessageComponentTypes.STRING_SELECT
    );
  }

  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}.with a `USER_SELECT` type
   * @returns {boolean}
   */
  isUserSelect() {
    return (
      InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
      MessageComponentTypes[this.componentType] === MessageComponentTypes.USER_SELECT
    );
  }

  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}.with a `ROLE_SELECT` type
   * @returns {boolean}
   */
  isRoleSelect() {
    return (
      InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
      MessageComponentTypes[this.componentType] === MessageComponentTypes.ROLE_SELECT
    );
  }

  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}.with a `MENTIONABLE_SELECT` type
   * @returns {boolean}
   */
  isMentionableSelect() {
    return (
      InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
      MessageComponentTypes[this.componentType] === MessageComponentTypes.MENTIONABLE_SELECT
    );
  }

  /**
   * Indicates whether this interaction is a {@link SelectMenuInteraction}.with a `CHANNEL_SELECT` type
   * @returns {boolean}
   */
  isChannelSelect() {
    return (
      InteractionTypes[this.type] === InteractionTypes.MESSAGE_COMPONENT &&
      MessageComponentTypes[this.componentType] === MessageComponentTypes.CHANNEL_SELECT
    );
  }

  /**
   * Indicates whether this interaction can be replied to.
   * @returns {boolean}
   */
  isRepliable() {
    return ![InteractionTypes.PING, InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE].includes(
      InteractionTypes[this.type],
    );
  }
}

module.exports = Interaction;
