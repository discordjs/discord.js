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

    /**
     * The url of the app's terms of service
     * @type {?string}
     */
    this.termsOfServiceURL = data.terms_of_service_url ?? this.terms_of_service_url ?? null;

    /**
     * The url of the app's privacy policy
     * @type {?string}
     */
    this.privacyPolicyURL = data.privacyPolicyURL ?? this.data.privacyPolicyURL ?? null;

    /**
     * The Array of RPC origin urls
     * @type {string[]}
     */
    this.rpcOrigins = data.rpc_origins ?? data.rpc_origins ?? [];

    /**
     * The application summary
     * @type {?string}
     */
    this.summary = data.summary ?? this.summary ?? null;

    // TODO: What does #hook indicate?

    /**
     * Unknown
     * @type {?boolean}
     */
    this.hook = data.hook ?? this.hook ?? null;

    /**
     * The application's
     */
    this.cover = data.cover_image ?? this.cover ?? null;
  }
}

module.exports = IntegrationApplication;
