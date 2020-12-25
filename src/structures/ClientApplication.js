'use strict';

const Team = require('./Team');
const Application = require('./interfaces/Application');

/**
 * Represents a Client OAuth2 Application.
 * <info>The only guaranteed properties are `id` and `flags`. To get the entire
 * application, you need to fetch it with `application.fetch()` first.</info>
 * @extends {Application}
 */
class ClientApplication extends Application {
  _patch(data) {
    super._patch(data);

    /**
     * The flags this application has
     * @type {number}
     */
    if ('flags' in data) this.flags = data.flags;

    /**
     * The app's cover image
     * @type {string}
     */
    if ('cover_image' in data) this.cover = data.cover_image;

    /**
     * The app's RPC origins, if enabled
     * @type {string[]}
     */
    if ('rpc_origins' in data) this.rpcOrigins = data.rpc_origins;

    /**
     * If this app's bot requires a code grant when using the OAuth2 flow
     * @type {boolean}
     */
    if ('bot_require_code_grant' in data) this.botRequireCodeGrant = data.bot_require_code_grant;

    /**
     * If this app's bot is public
     * @type {boolean}
     */
    if ('bot_public' in data) this.botPublic = data.bot_public;

    /**
     * The owner of this OAuth application
     * @type {User|Team}
     */
    if ('team' in data) this.owner = new Team(this.client, data.team);
    else if ('owner' in data) this.owner = this.client.users.add(data.owner);
  }

  /**
   * Whether this application is partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return this.name === null;
  }

  /**
   * Obtains this application from Discord.
   * @returns {Promise<ClientApplication>}
   */
  async fetch() {
    const app = await this.client.api.oauth2.applications('@me').get();
    this._patch(app);
    return this;
  }
}

module.exports = ClientApplication;
