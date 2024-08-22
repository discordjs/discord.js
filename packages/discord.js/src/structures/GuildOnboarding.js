'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');
const { GuildOnboardingPrompt } = require('./GuildOnboardingPrompt');

/**
 * Represents the onboarding data of a guild.
 * @extends {Base}
 */
class GuildOnboarding extends Base {
  constructor(client, data) {
    super(client);

    /**
     * The id of the guild this onboarding data is for
     * @type {Snowflake}
     */
    this.guildId = data.guild_id;

    const guild = this.guild;

    /**
     * The prompts shown during onboarding and in customize community
     * @type {Collection<Snowflake, GuildOnboardingPrompt>}
     */
    this.prompts = data.prompts.reduce(
      (prompts, prompt) => prompts.set(prompt.id, new GuildOnboardingPrompt(client, prompt, this.guildId)),
      new Collection(),
    );

    /**
     * The ids of the channels that new members get opted into automatically
     * @type {Collection<Snowflake, GuildChannel>}
     */
    this.defaultChannels = data.default_channel_ids.reduce(
      (channels, channelId) => channels.set(channelId, guild.channels.cache.get(channelId)),
      new Collection(),
    );

    /**
     * Whether onboarding is enabled
     * @type {boolean}
     */
    this.enabled = data.enabled;

    /**
     * The mode of this onboarding
     * @type {GuildOnboardingMode}
     */
    this.mode = data.mode;
  }

  /**
   * The guild this onboarding is from
   * @type {Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildId);
  }
}

exports.GuildOnboarding = GuildOnboarding;
