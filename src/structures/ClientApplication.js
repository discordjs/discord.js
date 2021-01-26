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

    if ('flags' in data) {
      /**
       * The flags this application has
       * @type {number}
       */
      this.flags = data.flags;
    }

    if ('cover_image' in data) {
      /**
       * The app's cover image
       * @type {string}
       */
      this.cover = data.cover_image;
    }

    if ('rpc_origins' in data) {
      /**
       * The app's RPC origins, if enabled
       * @type {string[]}
       */
      this.rpcOrigins = data.rpc_origins;
    }

    if ('bot_require_code_grant' in data) {
      /**
       * If this app's bot requires a code grant when using the OAuth2 flow
       * @type {boolean}
       */
      this.botRequireCodeGrant = data.bot_require_code_grant;
    }

    if ('bot_public' in data) {
      /**
       * If this app's bot is public
       * @type {boolean}
       */
      this.botPublic = data.bot_public;
    }

    // Discord explicitly sends null for this field, if not owned by a team.
    if (data.team) {
      /**
       * The owner of this OAuth application
       * @type {User|Team}
       */
      this.owner = new Team(this.client, data.team);
    } else if ('owner' in data) {
      this.owner = this.client.users.add(data.owner);
    }
  }

  /**
   * Whether this application is partial
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return 'name' in this;
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
