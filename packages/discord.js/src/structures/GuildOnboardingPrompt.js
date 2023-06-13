'use strict';

const { Collection } = require('@discordjs/collection');
const Base = require('./Base');
const { GuildOnboardingPromptOption } = require('./GuildOnboardingPromptOption');

/**
 * Represents the data of a prompt of a guilds onboarding.
 * @extends {Base}
 */
class GuildOnboardingPrompt extends Base {
  constructor(client, data, guildId) {
    super(client);

    /**
     * The id of the guild this onboarding prompt is from
     * @type {Snowflake}
     */
    this.guildId = guildId;

    /**
     * The id of the prompt
     * @type {Snowflake}
     */
    this.id = data.id;

    /**
     * The options available within the prompt
     * @type {Collection<Snowflake, GuildOnboardingPromptOption>}
     */
    this.options = data.options.reduce(
      (options, option) => options.set(option.id, new GuildOnboardingPromptOption(client, option, guildId)),
      new Collection(),
    );

    /**
     * The title of the prompt
     * @type {string}
     */
    this.title = data.title;

    /**
     * Whether users are limited to selecting one option for the prompt
     * @type {boolean}
     */
    this.singleSelect = data.single_select;

    /**
     * Whether the prompt is required before a user completes the onboarding flow
     * @type {boolean}
     */
    this.required = data.required;

    /**
     * Whether the prompt is present in the onboarding flow.
     * If `false`, the prompt will only appear in the Channels & Roles tab
     * @type {boolean}
     */
    this.inOnboarding = data.in_onboarding;

    /**
     * The type of the prompt
     * @type {GuildOnboardingPromptType}
     */
    this.type = data.type;
  }

  /**
   * The guild this onboarding prompt is from
   * @type {Guild}
   * @readonly
   */
  get guild() {
    return this.client.guilds.cache.get(this.guildId);
  }
}

exports.GuildOnboardingPrompt = GuildOnboardingPrompt;
