'use strict';

const Application = require('./interfaces/Application');

/**
 * Represents an Integration's OAuth2 Application.
 * @extends {Application}
 */
class IntegrationApplication extends Application {
  _patch(data) {
    super._patch(data);

    if ('bot' in data) {
      /**
       * The bot user for this application
       * @type {?User}
       */
      this.bot = this.client.users._add(data.bot);
    } else {
      this.bot ??= null;
    }

    if ('hook' in data) {
      /**
       * Whether the application can be default hooked by the client
       * @type {?boolean}
       */
      this.hook = data.hook;
    } else {
      this.hook ??= null;
    }
  }
}

module.exports = IntegrationApplication;
