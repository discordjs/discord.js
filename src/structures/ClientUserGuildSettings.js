const Constants = require('../util/Constants');
const Collection = require('../util/Util/Collection');
const ClientUserChannelOverride = require('./ClientUserChannelOverride');

/**
 * A wrapper around the ClientUser's guild settings
 */
class ClientUserGuildSettings {
  constructor(user, data) {
    this.user = user;
    this.channelOverrides = new Collection();
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data
   * @param {Object} data Data to patch this with
   */
  patch(data) {
    for (const key of Object.keys(Constants.UserGuildSettingsMap)) {
      const value = Constants.UserSettingsMap[key];
      if (!data.hasOwnProperty(key)) continue;
      if (key === 'channel_overrides') {
        for (const channel of data[key]) {
          this.channelOverrides.set(channel.channel_id, new ClientUserChannelOverride(this.user, channel));
        }
      } else if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }
}

module.exports = ClientUserGuildSettings;
