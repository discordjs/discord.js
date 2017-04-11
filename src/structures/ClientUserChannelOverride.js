const Constants = require('../util/Constants');

/**
 * A wrapper around the ClientUser's channel overrides
 */
class ClientUserChannelOverride {
  constructor(user, data) {
    this.user = user;
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data
   * @param {Object} data Data to patch this with
   */
  patch(data) {
    for (const key of Object.keys(Constants.UserChannelOverrideMap)) {
      const value = Constants.UserSettingsMap[key];
      if (!data.hasOwnProperty(key)) continue;
      if (typeof value === 'function') {
        this.guilds[data.guild_id][value.name] = value(data[key]);
      } else {
        this.guilds[data.guild_id][value] = data[key];
      }
    }
  }
}

module.exports = ClientUserChannelOverride;
