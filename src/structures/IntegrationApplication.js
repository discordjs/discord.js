'use strict';

const Application = require('./interfaces/Application');

/**
 * Represents an Integration's OAuth2 Application.
 * @extends {Application}
 */
class IntegrationApplication extends Application {
  _patch(data) {
    super._patch(data);

    if (typeof data.bot !== 'undefined') {
      /**
       * The bot {@link User user} for this application
       * @type {?User}
       */
      this.bot = this.client.users.add(data.bot);
    } else if (!this.bot) {
      this.bot = null;
    }
  }
}

module.exports = IntegrationApplication;
