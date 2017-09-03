const Constants = require('../util/Constants');
const Collection = require('../util/Collection');
const ClientUserChannelOverride = require('./ClientUserChannelOverride');

/**
 * A wrapper around the ClientUser's guild settings.
 */
class ClientUserGuildSettings {
  constructor(data, client) {
    /**
     * The client that created the instance of the ClientUserGuildSettings
     * @name ClientUserGuildSettings#client
     * @type {Client}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });
    /**
     * The ID of the guild this settings are for
     * @type {Snowflake}
     */
    this.guildID = data.guild_id;
    this.channelOverrides = new Collection();
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data.
   * @param {Object} data Data to patch this with
   * @returns {void}
   * @private
   */
  patch(data) {
    for (const key of Object.keys(Constants.UserGuildSettingsMap)) {
      const value = Constants.UserGuildSettingsMap[key];
      if (!data.hasOwnProperty(key)) continue;
      if (key === 'channel_overrides') {
        for (const channel of data[key]) {
          this.channelOverrides.set(channel.channel_id,
            new ClientUserChannelOverride(channel));
        }
      } else if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }

  /**
   * Update a specific property of the guild settings.
   * @param {string} name Name of property
   * @param {value} value Value to patch
   * @returns {Promise<Object>}
   */
  update(name, value) {
    return this.client.rest.methods.patchClientUserGuildSettings(this.guildID, { [name]: value });
  }
}

module.exports = ClientUserGuildSettings;
