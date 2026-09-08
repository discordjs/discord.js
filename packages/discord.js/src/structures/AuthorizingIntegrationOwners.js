'use strict';

const { ApplicationIntegrationType } = require('discord-api-types/v10');
const { Base } = require('./Base.js');

/**
 * Represents the owners of an authorizing integration.
 *
 * @extends {Base}
 */
class AuthorizingIntegrationOwners extends Base {
  constructor(client, data) {
    super(client);

    Object.defineProperty(this, 'data', { value: data });

    // Support accessing authorizingIntegrationOwners[ApplicationIntegrationType.GuildInstall] or similar, + forward compatibility if new installation types get added
    for (const value of Object.values(ApplicationIntegrationType)) {
      if (typeof value !== 'number') {
        continue;
      }

      Object.defineProperty(this, value, { value: this.data[value] });
    }

    /**
     * The id of the guild where the integration is installed, if applicable.
     *
     * @type {?Snowflake}
     */
    this.guildId = this.data[ApplicationIntegrationType.GuildInstall] ?? null;

    /**
     * The id of the user on which the integration is installed, if applicable.
     *
     * @type {?Snowflake}
     */
    this.userId = this.data[ApplicationIntegrationType.UserInstall] ?? null;
  }

  /**
   * The guild where the integration is installed, if applicable.
   *
   * @type {?Guild}
   */
  get guild() {
    return (this.guildId && this.client.guilds.cache.get(this.guildId)) ?? null;
  }

  /**
   * The user on which the integration is installed, if applicable.
   *
   * @type {?User}
   */
  get user() {
    return (this.userId && this.client.users.cache.get(this.userId)) ?? null;
  }

  toJSON() {
    return this.data;
  }
}

exports.AuthorizingIntegrationOwners = AuthorizingIntegrationOwners;
