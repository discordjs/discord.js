'use strict';

const Application = require('./interfaces/Application');

/**
 * Represents an Integration's OAuth2 Application.
 * @extends {Application}
 */
class IntegrationApplication extends Application {
  _patch(data) {
    super._patch(data);

    /**
     * The bot user for this application
     * @type {?User}
     */
    this.bot = data.bot ? this.client.users.add(data.bot) : this.bot ?? null;
  }
}

module.exports = IntegrationApplication;
