'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');
const { resolvePartialEmoji } = require('../util/Util');

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
     * The data for an emoji of a guilds onboarding prompt option
     * @typedef {Object} GuildOnboardingPromptOptionEmoji
     * @property {?Snowflake} id The id of the emoji
     * @property {?string} name The name of the emoji
     * @property {boolean} animated Whether the emoji is animated
     */

    /**
     * The emoji of the option
     * @type {?GuildOnboardingPromptOptionEmoji}
     */
    this.emoji = resolvePartialEmoji(data.emoji);

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
}

exports.GuildOnboardingPromptOption = GuildOnboardingPromptOption;
