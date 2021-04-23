'use strict';

const Base = require('./Base');
const { InteractionTypes } = require('../util/Constants');
const SnowflakeUtil = require('../util/SnowflakeUtil');

/**
 * Represents an interaction.
 * @extends {Base}
 */
class Interaction extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The type of this interaction
     * @type {InteractionType}
     */
    this.type = InteractionTypes[data.type];

    /**
     * The ID of this interaction
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The token of this interaction
     * @type {string}
     * @name Interaction#token
     * @readonly
     */
    Object.defineProperty(this, 'token', { value: data.token });

    /**
     * The ID of the application
     * @type {Snowflake}
     */
    this.applicationID = data.application_id;

    /**
     * The ID of the channel this interaction was sent in
     * @type {?Snowflake}
     */
    this.channelID = data.channel_id ?? null;

    /**
     * The ID of the guild this interaction was sent in
     * @type {?Snowflake}
     */
    this.guildID = data.guild_id ?? null;

    /**
     * The user which sent this interaction
     * @type {User}
     */
    this.user = this.client.users.add(data.user ?? data.member.user);

    /**
     * If this interaction was sent in a guild, the member which sent it
     * @type {?GuildMember|Object}
     */
    this.member = data.member ? this.guild?.members.add(data.member) ?? data.member : null;

    /**
     * The version
     * @type {number}
     */
    this.version = data.version;
  }

  /**
   * The timestamp the interaction was created at
   * @type {number}
   * @readonly
   */
  get createdTimestamp() {
    return SnowflakeUtil.deconstruct(this.id).timestamp;
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
   * @type {?Channel}
   * @readonly
   */
  get channel() {
    return this.client.channels.cache.get(this.channelID) ?? null;
  }

  /**
   * The guild this interaction was sent in
   * @type {?Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildID) ?? null;
  }

  /**
   * Indicates whether this interaction is a command interaction.
   * @returns {boolean}
   */
  isCommand() {
    return InteractionTypes[this.type] === InteractionTypes.APPLICATION_COMMAND;
  }
}

module.exports = Interaction;
