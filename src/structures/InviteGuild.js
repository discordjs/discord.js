'use strict';

const Guild = require('./Guild');
const WelcomeScreen = require('./WelcomeScreen');

/**
 * Represents a guild received from an invite, including welcome screen data if available.
 * @extends {Guild}
 */
class InviteGuild extends Guild {
  constructor(client, data) {
    super(client, data);
    this.welcomeScreen =
      typeof data.welcome_screen !== 'undefined' ? new WelcomeScreen(this, data.welcome_screen) : null;
  }
}

module.exports = InviteGuild;
