'use strict';

const { DiscordSnowflake } = require('@sapphire/snowflake');
const { InteractionType, ApplicationCommandType, ComponentType } = require('discord-api-types/v10');
const Base = require('./Base');
const { SelectMenuTypes } = require('../util/Constants');
const PermissionsBitField = require('../util/PermissionsBitField');

/**
 * Represents an interaction.
 * @extends {Base}
 * @abstract
 */
class BaseInteraction extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The interaction's type
     * @type {InteractionType}
     */
    this.type = data.type;

    /**
     * The interaction's id
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The interaction's token
     * @type {string}
     * @name BaseInteraction#token
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
     * The user who created this interaction
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
     * @type {?Readonly<PermissionsBitField>}
     */
    this.appPermissions = data.app_permissions ? new PermissionsBitField(data.app_permissions).freeze() : null;

    /**
     * The permissions of the member, if one exists, in the channel this interaction was executed in
     * @type {?Readonly<PermissionsBitField>}
     */
    this.memberPermissions = data.member?.permissions
      ? new PermissionsBitField(data.member.permissions).freeze()
      : null;

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
    return DiscordSnowflake.timestampFrom(this.id);
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
   * Indicates whether this interaction is an {@link AutocompleteInteraction}
   * @returns {boolean}
   */
  isAutocomplete() {
    return this.type === InteractionType.ApplicationCommandAutocomplete;
  }

  /**
   * Indicates whether this interaction is a {@link CommandInteraction}
   * @returns {boolean}
   */
  isCommand() {
    return this.type === InteractionType.ApplicationCommand;
  }

  /**
   * Indicates whether this interaction is a {@link ChatInputCommandInteraction}.
   * @returns {boolean}
   */
  isChatInputCommand() {
    return this.type === InteractionType.ApplicationCommand && this.commandType === ApplicationCommandType.ChatInput;
  }

  /**
   * Indicates whether this interaction is a {@link ContextMenuCommandInteraction}
   * @returns {boolean}
   */
  isContextMenuCommand() {
    return (
      this.type === InteractionType.ApplicationCommand &&
      [ApplicationCommandType.User, ApplicationCommandType.Message].includes(this.commandType)
    );
  }

  /**
   * Indicates whether this interaction is a {@link MessageComponentInteraction}
   * @returns {boolean}
   */
  isMessageComponent() {
    return this.type === InteractionType.MessageComponent;
  }

  /**
   * Indicates whether this interaction is a {@link ModalSubmitInteraction}
   * @returns {boolean}
   */
  isModalSubmit() {
    return this.type === InteractionType.ModalSubmit;
  }

  /**
   * Indicates whether this interaction is a {@link UserContextMenuCommandInteraction}
   * @returns {boolean}
   */
  isUserContextMenuCommand() {
    return this.isContextMenuCommand() && this.commandType === ApplicationCommandType.User;
  }

  /**
   * Indicates whether this interaction is a {@link MessageContextMenuCommandInteraction}
   * @returns {boolean}
   */
  isMessageContextMenuCommand() {
    return this.isContextMenuCommand() && this.commandType === ApplicationCommandType.Message;
  }

  /**
   * Indicates whether this interaction is a {@link ButtonInteraction}.
   * @returns {boolean}
   */
  isButton() {
    return this.type === InteractionType.MessageComponent && this.componentType === ComponentType.Button;
  }

  /**
   * Indicates whether this interaction is a base {@link SelectMenuInteraction}.
   * @returns {boolean}
   */
  isSelectMenu() {
    return (
      this.type === InteractionType.MessageComponent && SelectMenuTypes.includes(this.componentType)
    );
  }
  /**
   * Indicates whether this interaction is a {@link StringSelectMenuInteraction}
   * @returns {boolean}
   */
  isStringSelectMenu() {
    return this.type === InteractionType.MessageComponent && this.componentType === ComponentType.StringSelect;
  }
  /**
   * Indicates whether this interaction is a {@link UserSelectMenuInteraction}
   * @returns {boolean}
   */
  isUserSelectMenu() {
    return this.type === InteractionType.MessageComponent && this.componentType === ComponentType.UserSelect;
  }
  /**
   * Indicates whether this interaction is a {@link RoleSelectMenuInteraction}
   * @returns {boolean}
   */
  isRoleSelectMenu() {
    return this.type === InteractionType.MessageComponent && this.componentType === ComponentType.RoleSelect;
  }
  /**
   * Indicates whether this interaction is a {@link ChannelSelectMenuInteraction}
   * @returns {boolean}
   */
  isChannelSelectMenu() {
    return this.type === InteractionType.MessageComponent && this.componentType === ComponentType.ChannelSelect;
  }
  /**
   * Indicates whether this interaction is a {@link MenionableSelectMenuInteraction}
   * @returns {boolean}
   */
  isMentionableSelectMenu() {
    return this.type === InteractionType.MessageComponent && this.componentType === ComponentType.MentionableSelect;
  }
  /**
   * Indicates whether this interaction can be replied to.
   * @returns {boolean}
   */
  isRepliable() {
    return ![InteractionType.Ping, InteractionType.ApplicationCommandAutocomplete].includes(this.type);
  }
}

module.exports = BaseInteraction;
