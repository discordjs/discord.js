'use strict';

const AnonymousGuild = require('./AnonymousGuild');
const WelcomeScreen = require('./WelcomeScreen');

/**
 * Represents a guild received from an invite, includes welcome screen data if available.
 * @extends {AnonymousGuild}
 */
class InviteGuild extends AnonymousGuild {
  constructor(client, data) {
    super(client, data);
    this.welcomeScreen =
      typeof data.welcome_screen !== 'undefined' ? new WelcomeScreen(this, data.welcome_screen) : null;
  }
}

module.exports = InviteGuild;
