import { Collection } from '@discordjs/collection';
import { GuildFeature } from 'discord-api-types/v10';
import { Base } from './Base.js';
import { WelcomeChannel } from './WelcomeChannel.js';

/**
 * Represents a welcome screen.
 *
 * @extends {Base}
 */
export class WelcomeScreen extends Base {
  constructor(guild, data) {
    super(guild.client);

    /**
     * The guild for this welcome screen
     *
     * @type {Guild}
     */
    this.guild = guild;

    /**
     * The description of this welcome screen
     *
     * @type {?string}
     */
    this.description = data.description ?? null;

    /**
     * Collection of welcome channels belonging to this welcome screen
     *
     * @type {Collection<Snowflake, WelcomeChannel>}
     */
    this.welcomeChannels = new Collection();

    for (const channel of data.welcome_channels) {
      const welcomeChannel = new WelcomeChannel(this.guild, channel);
      this.welcomeChannels.set(welcomeChannel.channelId, welcomeChannel);
    }
  }

  /**
   * Whether the welcome screen is enabled on the guild
   *
   * @type {boolean}
   */
  get enabled() {
    return this.guild.features.includes(GuildFeature.WelcomeScreenEnabled);
  }
}
