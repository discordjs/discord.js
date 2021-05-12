'use strict';

const Base = require('./Base');

/**
 * Represents a ban in a guild on Discord.
 * @extends {Base}
 */
class GuildBan extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The data for the ban
   * @param {Guild} guild The guild in which the ban is
   */
  constructor(client, data, guild) {
    super(client);

    /**
     * The guild in which the ban is
     * @type {Guild}
     */
    this.guild = guild;

    this._patch(data);
  }

  _patch(data) {
    /**
     * The user this ban applies to
     * @type {User}
     */
    this.user = this.client.users.add(data.user, true);

    if ('reason' in data) {
      /**
       * The reason for the ban
       * @type {?string}
       */
      this.reason = data.reason;
    }
  }

  /**
   * Whether this GuildBan is a partial
   * If the reason is not provided the value is null
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !('reason' in this);
  }

  /**
   * Fetches this GuildBan.
   * @param {boolean} [force=false] Whether to skip the cache check and request the API
   * @returns {Promise<GuildBan>}
   */
  fetch(force = false) {
    return this.guild.bans.fetch({ user: this.user, cache: true, force });
  }
}

module.exports = GuildBan;
