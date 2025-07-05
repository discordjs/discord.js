'use strict';

/**
 * Represents the primary guild of a User.
 */
class UserPrimaryGuild {
  constructor(data, client) {
    /**
     * The client that instantiated this
     *
     * @name UserPrimaryGuild#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The id of the user's primary guild
     *
     * @type {?Snowflake}
     */
    this.identityGuildId = data.identity_guild_id;

    /**
     * Whether the user is displaying the primary guild's tag
     *
     * @type {?boolean}
     */
    this.identityEnabled = data.identity_enabled;

    /**
     * The user's guild tag. Limited to 4 characters
     *
     * @type {?string}
     */
    this.tag = data.tag;

    /**
     * The guild tag badge hash
     *
     * @type {?string}
     */
    this.badge = data.badge;
  }

  /**
   * The user's primary guild
   *
   * @type {?Guild}
   * @readonly
   */
  get identityGuild() {
    return this.client.guilds.cache.get(this.identityGuildId) ?? null;
  }

  /**
   * A link to the user's guild tag badge.
   *
   * @param {ImageURLOptions} [options={}] Options for the image URL
   * @returns {?string}
   */
  guildTagBadgeURL(options = {}) {
    return this.badge ? this.client.rest.cdn.guildTagBadge(this.identityGuildId, this.badge, options) : null;
  }
}

exports.UserPrimaryGuild = UserPrimaryGuild;
