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
    this.bot = data.bot ? this.client.users._add(data.bot) : this.bot ?? null;

    /**
     * The url of the application's terms of service
     * @type {?string}
     */
    this.termsOfServiceURL = data.terms_of_service_url ?? this.termsOfServiceURL ?? null;

    /**
     * The url of the application's privacy policy
     * @type {?string}
     */
    this.privacyPolicyURL = data.privacy_policy_url ?? this.privacyPolicyURL ?? null;

    /**
     * The Array of RPC origin urls
     * @type {string[]}
     */
    this.rpcOrigins = data.rpc_origins ?? this.rpcOrigins ?? [];

    /**
     * The application's summary
     * @type {?string}
     */
    this.summary = data.summary ?? this.summary ?? null;

    /**
     * Whether the application can be default hooked by the client
     * @type {?boolean}
     */
    this.hook = data.hook ?? this.hook ?? null;

    /**
     * The hash of the application's cover image
     * @type {?string}
     */
    this.cover = data.cover_image ?? this.cover ?? null;

    /**
     * The hex-encoded key for verification in interactions and the GameSDK's GetTicket
     * @type {?string}
     */
    this.verifyKey = data.verify_key ?? this.verifyKey ?? null;
  }
}

module.exports = IntegrationApplication;
