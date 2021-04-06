'use strict';

const { default: Collection } = require('@discordjs/collection');
const Base = require('./Base');
const WelcomeChannel = require('./WelcomeChannel');

class WelcomeScreen extends Base {
  constructor(guild, data) {
    super(guild.client);
    this.guild = guild;

    this._patch(data);
  }

  /**
   * Builds the welcome screen with the provided data.
   * @param {*} data The raw data of the welcome screen
   * @private
   */
  _patch(data) {
    if (!data) return;
    this.description = data.description;

    if (!this.welcomeChannels) {
      /**
       * Collection of welcome channels belonging to this welcome screen
       * @type {Collection<Snowflake, NewsChannel|TextChannel>}
       */
      this.welcomeChannels = new Collection();
    }

    for (const channel of data.welcome_channels) {
      const welcomeChannel = new WelcomeChannel(this.guild, channel);
      this.welcomeChannels.set(welcomeChannel.channelID, welcomeChannel);
    }
  }
}

module.exports = WelcomeScreen;
