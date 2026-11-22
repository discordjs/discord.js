import { AnonymousGuild } from './AnonymousGuild.js';
import { WelcomeScreen } from './WelcomeScreen.js';

/**
 * Represents a guild received from an invite, includes welcome screen data if available.
 *
 * @extends {AnonymousGuild}
 */
export class InviteGuild extends AnonymousGuild {
  constructor(client, data) {
    super(client, data);

    /**
     * The welcome screen for this invite guild
     *
     * @type {?WelcomeScreen}
     */
    this.welcomeScreen = data.welcome_screen === undefined ? null : new WelcomeScreen(this, data.welcome_screen);
  }
}
