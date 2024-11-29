'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');
const { Emoji } = require('./Emoji.js');

/**
 * Represents the data of an option from a prompt of a guilds onboarding.
 * @extends {Base}
 */
class GuildOnboardingPromptOption extends Base {
  constructor(client, data, guildId) {
    super(client);

    /**
     * The id of the guild this onboarding prompt option is from
     * @type {Snowflake}
     */
    this.guildId = guildId;

    const guild = this.guild;

    /**
     * The id of the option
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The channels a member is added to when the option is selected
     * @type {Collection<Snowflake, GuildChannel>}
     */
    this.channels = data.channel_ids.reduce(
      (channels, channelId) => channels.set(channelId, guild.channels.cache.get(channelId)),
      new Collection(),
    );

    /**
     * The roles assigned to a member when the option is selected
     * @type {Collection<Snowflake, Role>}
     */
    this.roles = data.role_ids.reduce(
      (roles, roleId) => roles.set(roleId, guild.roles.cache.get(roleId)),
      new Collection(),
    );

    /**
     * The raw emoji of the option
     * @type {APIPartialEmoji}
     * @private
     */
    this._emoji = data.emoji;

    /**
     * The title of the option
     * @type {string}
     */
    this.title = data.title;

    /**
     * The description of the option
     * @type {?string}
     */
    this.description = data.description;
  }

  /**
   * The guild this onboarding prompt option is from
   * @type {Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildId);
  }

  /**
   * The emoji of this onboarding prompt option
   * @type {?(GuildEmoji|Emoji)}
   */
  get emoji() {
    if (!this._emoji.id && !this._emoji.name) return null;
    return this.client.emojis.cache.get(this._emoji.id) ?? new Emoji(this.client, this._emoji);
  }
}

exports.GuildOnboardingPromptOption = GuildOnboardingPromptOption;
