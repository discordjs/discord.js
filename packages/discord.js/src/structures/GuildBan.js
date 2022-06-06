'use strict';

const Base = require('./Base');
const User = require('./User');

/**
 * Represents a ban in a guild on Discord.
 * @extends {Base}
 */
class GuildBan extends Base {
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
    if ('user' in data) {
      /**
       * The user this ban applies to
       * @type {User}
       */
      // Store / create reference directly as member is highly unlikely to exist anymore
      this.user = this.user ? this.user._patch(data.user) : new User(this.client, data.user);
    }

    if ('reason' in data) {
      /**
       * The reason for the ban
       * @type {?string}
       */
      this.reason = data.reason;
    }
  }

  /**
   * Whether this GuildBan is partial. If the reason is not provided the value is null
   * @type {boolean}
   * @readonly
   */
  get partial() {
    return !('reason' in this);
  }

  /**
   * Fetches this GuildBan.
   * @param {boolean} [force=true] Whether to skip the cache check and request the API
   * @returns {Promise<GuildBan>}
   */
  fetch(force = true) {
    return this.guild.bans.fetch({ user: this.user, cache: true, force });
  }
}

module.exports = GuildBan;
