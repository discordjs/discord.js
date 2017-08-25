const Constants = require('../util/Constants');
const Util = require('../util/Util');

/**
 * A wrapper around the ClientUser's settings.
 */
class ClientUserSettings {
  constructor(user, data) {
    this.user = user;
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data.
   * @param {Object} data Data to patch this with
   * @returns {void}
   * @private
   */
  patch(data) {
    for (const key of Object.keys(Constants.UserSettingsMap)) {
      const value = Constants.UserSettingsMap[key];
      if (!data.hasOwnProperty(key)) continue;
      if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }

  /**
   * Update a specific property of of user settings.
   * @param {string} name Name of property
   * @param {*} value Value to patch
   * @returns {Promise<Object>}
   */
  update(name, value) {
    return this.user.client.rest.methods.patchUserSettings({ [name]: value });
  }

  /**
   * Sets the position at which this guild will appear in the Discord client.
   * @param {Guild} guild The guild to move
   * @param {number} position Absolute or relative position
   * @param {boolean} [relative=false] Whether to position relatively or absolutely
   * @returns {Promise<Guild>}
   */
  setGuildPosition(guild, position, relative) {
    const temp = Object.assign([], this.guildPositions);
    Util.moveElementInArray(temp, guild.id, position, relative);
    return this.update('guild_positions', temp).then(() => guild);
  }

  /**
   * Add a guild to the list of restricted guilds.
   * @param {Guild} guild The guild to add
   * @returns {Promise<Guild>}
   */
  addRestrictedGuild(guild) {
    const temp = Object.assign([], this.restrictedGuilds);
    if (temp.includes(guild.id)) return Promise.reject(new Error('Guild is already restricted'));
    temp.push(guild.id);
    return this.update('restricted_guilds', temp).then(() => guild);
  }

  /**
   * Remove a guild from the list of restricted guilds.
   * @param {Guild} guild The guild to remove
   * @returns {Promise<Guild>}
   */
  removeRestrictedGuild(guild) {
    const temp = Object.assign([], this.restrictedGuilds);
    const index = temp.indexOf(guild.id);
    if (index < 0) return Promise.reject(new Error('Guild is not restricted'));
    temp.splice(index, 1);
    return this.update('restricted_guilds', temp).then(() => guild);
  }
}

module.exports = ClientUserSettings;
