const Base = require('./Base');

/**
 * Represent a Ban
 */
class GuildBan extends Base {
  constructor(guild, data, fetched) {
    super(guild.client);
    /**
	 * Reason the user was banned
	 * @type {string}
	 */
    this.reason = data.reason;

    /**
	 * Guild where the Ban occurred
	 * @type {Guild}
	 */
    this.guild = guild;

    /**
	 * If this GuildBan is fetched and will be accurate about the reason
	 * @type {boolean}
	 */
    this.fetched = fetched;

    /**
	 * User that was banned.
	 * @type {User}
	 */
    this.user = this.client.users.add(data.user);
  }
}

module.exports = GuildBan;
