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

    if ('terms_of_service_url' in data) {
      /**
       * The URL of the application's terms of service
       * @type {?string}
       */
      this.termsOfServiceURL = data.terms_of_service_url;
    } else {
      this.termsOfServiceURL ??= null;
    }

    if ('privacy_policy_url' in data) {
      /**
       * The URL of the application's privacy policy
       * @type {?string}
       */
      this.privacyPolicyURL = data.privacy_policy_url;
    } else {
      this.privacyPolicyURL ??= null;
    }

    if ('rpc_origins' in data) {
      /**
       * The Array of RPC origin URLs
       * @type {string[]}
       */
      this.rpcOrigins = data.rpc_origins;
    } else {
      this.rpcOrigins ??= [];
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

    if ('cover_image' in data) {
      /**
       * The hash of the application's cover image
       * @type {?string}
       */
      this.cover = data.cover_image;
    } else {
      this.cover ??= null;
    }

    if ('verify_key' in data) {
      /**
       * The hex-encoded key for verification in interactions and the GameSDK's GetTicket
       * @type {?string}
       */
      this.verifyKey = data.verify_key;
    } else {
      this.verifyKey ??= null;
    }
  }
}

module.exports = IntegrationApplication;
